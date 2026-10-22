#!/usr/bin/env bash
# Test suite entrypoint inside the test container. See tests/README.md.
#
# Stages (run in order; pass names as arguments or SUITE_STAGES to run a subset):
#   unit      Python unit tests (tests/test_*.py), including feedback and production isolation
#   build     regenerate and validate SBP sources, rebuild dist/restricted-preview packages
#   packages  validate_scorm + feedback guard on every package, then extract them
#   runtime   SBP SCORM runtime QA (jsdom) against the extracted production packages
#   browser   Chromium: production smoke on every package, SBP visual + figure QA, screenshots
#   overlay   Chromium: review overlay end-to-end against the feedback dev server
#
# /repo is the read-only checkout; work happens on a copy in /work. Results go to /results.
set -uo pipefail

ALL=(unit build packages runtime browser overlay)
if [ "$#" -gt 0 ]; then STAGES=("$@")
elif [ -n "${SUITE_STAGES:-}" ]; then read -r -a STAGES <<<"${SUITE_STAGES//,/ }"
else STAGES=("${ALL[@]}"); fi

R=/results
W=/work
EX=$W/.extracted
mkdir -p "$R"
rm -rf "${R:?}"/*
: >"$R/summary.txt"
declare -A STATUS

log() { printf '\n=== %s ===\n' "$*"; }
want() { local s; for s in "${STAGES[@]}"; do [ "$s" = "$1" ] && return 0; done; return 1; }
record() { STATUS[$1]=$2; printf '%-9s %s\n' "$1" "$2" >>"$R/summary.txt"; }
stage() { # stage NAME FUNCTION
  want "$1" || return 0
  log "$1"
  if "$2" > >(tee "$R/$1.log") 2>&1; then record "$1" PASS; else record "$1" FAIL; fi
}

copy_repo() {
  log "copy repository to $W"
  # Everything except VCS internals, caches, local review data, and prior results.
  tar -C /repo \
    --exclude=./.git --exclude=./node_modules --exclude='*/node_modules' --exclude=./.feedback \
    --exclude=./tests/.results --exclude='__pycache__' --exclude=./.extracted \
    -cf - . | tar -C "$W" -xf -
  ln -sfn /opt/qa/node_modules "$W/node_modules"
  # build_ref() in the feedback server asks git for a commit; give it a throwaway repository.
  git -C "$W" init -q 2>/dev/null && git -C "$W" -c user.name=suite -c user.email=suite@local add -A >/dev/null 2>&1 \
    && git -C "$W" -c user.name=suite -c user.email=suite@local commit -qm snapshot >/dev/null 2>&1 || true
}

s_unit() {
  cd "$W" && python3 -m unittest discover -s tests -p 'test_*.py' -v
}

s_build() {
  cd "$W" || return 1
  python3 tools/sbp/build_sbp.py generate && \
  python3 tools/sbp/build_sbp.py validate && \
  python3 tools/sbp/build_sbp.py package
}

s_packages() {
  cd "$W" || return 1
  local rc=0 n=0 z name dest
  rm -rf "$EX"; mkdir -p "$EX/all" "$EX/sbp"
  while IFS= read -r z; do
    n=$((n + 1))
    res=$(python3 skills/scripts/validate_scorm.py "$z" | tail -1)
    if [ "$res" != PASS ]; then rc=1; echo "FAIL validate_scorm $z"; python3 skills/scripts/validate_scorm.py "$z"; fi
    name=$(basename "$z" .zip)
    dest="$EX/all/$name"
    mkdir -p "$dest" && unzip -qo "$z" -d "$dest"
    case "$name" in SBP-*) mkdir -p "$EX/sbp/${name%%-v*}" && unzip -qo "$z" -d "$EX/sbp/${name%%-v*}";; esac
  done < <(find dist -name '*.zip' | sort)
  echo "validated $n package(s)"
  python3 tools/feedback/cli.py guard dist || rc=1
  PACKAGES_DIR="$W/dist" python3 -m unittest tests.test_production_isolation -v || rc=1
  [ "$n" -gt 0 ] || { echo "no packages found"; rc=1; }
  return $rc
}

s_runtime() {
  cd "$W" || return 1
  [ -d "$EX/sbp" ] || { echo "run the packages stage first"; return 1; }
  SBP_MODULES_DIR="$EX/sbp" node tools/sbp/runtime_qa_sbp.js --out "$R/sbp/runtime-qa-results.json"
}

serve_static() { # serve_static DIR PORT -> pid in SERVER_PID
  python3 -m http.server "$2" --bind 127.0.0.1 --directory "$1" >"$R/http-$2.log" 2>&1 &
  SERVER_PID=$!
  for _ in $(seq 1 50); do
    python3 -c "import urllib.request;urllib.request.urlopen('http://127.0.0.1:$2/')" 2>/dev/null && return 0
    sleep 0.1
  done
  echo "static server on $2 did not start"; return 1
}

s_browser() {
  cd "$W" || return 1
  [ -d "$EX/all" ] || { echo "run the packages stage first"; return 1; }
  local rc=0
  serve_static "$EX/all" 8801 || return 1
  local p1=$SERVER_PID
  node tests/browser/prod_smoke.mjs "$EX/all" http://127.0.0.1:8801 "$R/prod-smoke-results.json" || rc=1
  kill "$p1" 2>/dev/null
  if [ -n "$(ls "$EX/sbp" 2>/dev/null)" ]; then
    serve_static "$EX/sbp" 8802 || return 1
    local p2=$SERVER_PID
    node tests/browser/sbp_visual.mjs "$EX/sbp" http://127.0.0.1:8802 "$R/sbp" || rc=1
    kill "$p2" 2>/dev/null
  fi
  return $rc
}

s_overlay() {
  cd "$W" || return 1
  local rc=0 port=8803
  export FEEDBACK_DB="$W/.feedback-e2e/feedback.db" FEEDBACK_HISTORY="$W/.feedback-e2e/history"
  rm -rf "$W/.feedback-e2e"
  python3 tools/feedback/cli.py serve --port $port >"$R/feedback-server.log" 2>&1 &
  local pid=$!
  for _ in $(seq 1 50); do
    python3 -c "import urllib.request;urllib.request.urlopen('http://127.0.0.1:$port/')" 2>/dev/null && break
    sleep 0.1
  done
  local mod=${OVERLAY_MODULE:-SBP-101} acc=${OVERLAY_ACCREDITATION:-accred-ai-blueprinting}
  node tests/browser/overlay_e2e.mjs "http://127.0.0.1:$port" "$mod" "$acc" "$R/overlay-e2e-results.json" || rc=1
  kill "$pid" 2>/dev/null
  mkdir -p "$R/feedback-history" && cp -r "$FEEDBACK_HISTORY"/. "$R/feedback-history/" 2>/dev/null
  # The dev server and its overlay must leave the working copy's module sources untouched.
  python3 - <<'PY' || rc=1
import sys
sys.path.insert(0, "tools/feedback")
import markers
from pathlib import Path
bad = markers.scan_tree(Path("learning"))
print("module sources clean after overlay session" if not bad else f"LEAK into sources: {bad[:5]}")
sys.exit(1 if bad else 0)
PY
  return $rc
}

copy_repo
mkdir -p "$R/sbp"
stage unit s_unit
stage build s_build
stage packages s_packages
stage runtime s_runtime
stage browser s_browser
stage overlay s_overlay

log summary
cat "$R/summary.txt"
for s in "${!STATUS[@]}"; do [ "${STATUS[$s]}" = PASS ] || exit 1; done
[ "${#STATUS[@]}" -gt 0 ] || { echo "no stages ran (unknown stage name?)"; exit 2; }
exit 0
