#!/usr/bin/env bash
# Run the test suite in its container. See tests/README.md.
#
#   tests/run.sh                         # every stage
#   tests/run.sh unit packages           # selected stages
#   tests/run.sh --update-evidence       # full run, then promote SBP QA results into plan/
#   tests/run.sh --rebuild               # rebuild the image without cache first
#
# Results: tests/.results/ (summary.txt, per-stage logs, JSON results, screenshots).
set -euo pipefail

HERE="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(cd "$HERE/.." && pwd)"
COMPOSE_FILE="$HERE/container/docker-compose.yml"
UPDATE=0
REBUILD=0
STAGES=()
for a in "$@"; do
  case "$a" in
    --update-evidence) UPDATE=1 ;;
    --rebuild) REBUILD=1 ;;
    -h|--help) sed -n '2,9p' "$0"; exit 0 ;;
    *) STAGES+=("$a") ;;
  esac
done

if docker compose version >/dev/null 2>&1; then DC=(docker compose)
elif command -v docker-compose >/dev/null 2>&1; then DC=(docker-compose)
else echo "Docker Compose not found. Install Docker Desktop, or Colima plus docker-compose." >&2; exit 2; fi
if ! docker info >/dev/null 2>&1; then
  echo "Docker daemon is not running. Start Docker Desktop, or run: colima start" >&2
  exit 2
fi

mkdir -p "$ROOT/tests/.results"
if [ "$REBUILD" = 1 ]; then "${DC[@]}" -f "$COMPOSE_FILE" build --no-cache tests
else "${DC[@]}" -f "$COMPOSE_FILE" build tests; fi

set +e
"${DC[@]}" -f "$COMPOSE_FILE" run --rm tests "${STAGES[@]}"
rc=$?
set -e

if [ "$UPDATE" = 1 ]; then
  if [ "$rc" -ne 0 ]; then
    echo "Suite failed; evidence in plan/ was not updated." >&2
  else
    for f in visual-qa-results.json runtime-qa-results.json; do
      src="$ROOT/tests/.results/sbp/$f"
      [ -f "$src" ] && cp "$src" "$ROOT/plan/sales-blueprinting/$f" && echo "updated plan/sales-blueprinting/$f"
    done
  fi
fi
echo "Results: $ROOT/tests/.results/summary.txt"
exit "$rc"
