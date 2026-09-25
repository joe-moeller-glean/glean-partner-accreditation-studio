"""Tests for the learning/ hierarchy: canonical modules plus accreditation definitions."""
import json
import shutil
import subprocess
import sys
import tempfile
import unittest
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SCRIPTS = ROOT / "skills" / "scripts"
sys.path.insert(0, str(SCRIPTS))

import learning_layout as L  # noqa: E402
import validate_accreditations as V  # noqa: E402


def run(*args, cwd=ROOT):
    return subprocess.run([sys.executable, *map(str, args)], cwd=cwd, capture_output=True, text=True)


class RepositoryLayout(unittest.TestCase):
    def test_legacy_directories_are_gone(self):
        self.assertFalse((ROOT / "modules").exists())
        self.assertFalse((ROOT / "accreditations").exists())

    def test_validator_passes_on_repository(self):
        errors, _ = V.validate(ROOT)
        self.assertEqual(errors, [])

    def test_every_module_dir_matches_its_id(self):
        dirs = L.module_dirs(ROOT)
        self.assertGreaterEqual(len(dirs), 13)
        for d in dirs:
            self.assertEqual(json.loads((d / "module.json").read_text())["module_id"], d.name)

    def test_accreditations_are_definitions_only(self):
        for d in L.accreditations_root(ROOT).iterdir():
            if d.is_dir():
                self.assertEqual(sorted(p.name for p in d.iterdir()), [L.DEFINITION_FILE], d)

    def test_definitions_match_tracker_snapshot(self):
        tracker = json.loads((ROOT / "plan/accreditations.json").read_text())["accreditations"]
        mine = {a["id"]: L.tracker_view(a) for a in L.load_accreditations(ROOT)}
        self.assertEqual({e["directory"]: e for e in tracker}, mine)

    def test_shared_module_counts_toward_several_accreditations(self):
        self.assertEqual(L.accreditations_for_module(ROOT, "BLD-101"), ["accred-agents", "accred-builder"])

    def test_agents_badge_references_built_modules(self):
        a = L.load_accreditation(L.accreditations_root(ROOT) / "accred-agents" / L.DEFINITION_FILE)
        self.assertEqual(a["status"], "built")
        self.assertEqual(a["overview_module"], "accred-agents")
        self.assertEqual(a["completion"]["assessment_module"], "ACC-104")
        for mid in L.module_ids(a):
            self.assertTrue((L.module_dir(ROOT, mid) / "module.json").is_file(), mid)

    def test_industry_electives_resolve(self):
        a = L.load_accreditation(L.accreditations_root(ROOT) / "accred-industry-specialist" / L.DEFINITION_FILE)
        queue = {j["module_id"] for j in json.loads((ROOT / "plan/queue.json").read_text())["jobs"]}
        self.assertGreaterEqual(len(L.elective_matches(a, queue)["IND-*"]), 2)


class ValidatorCatchesDrift(unittest.TestCase):
    def setUp(self):
        self.tmp = Path(tempfile.mkdtemp())
        for rel in ("learning", "plan/queue.json", "plan/accreditations.json"):
            src = ROOT / rel
            dst = self.tmp / rel
            dst.parent.mkdir(parents=True, exist_ok=True)
            (shutil.copytree if src.is_dir() else shutil.copy)(src, dst)

    def tearDown(self):
        shutil.rmtree(self.tmp)

    def errors(self):
        return V.validate(self.tmp)[0]

    def test_clean_copy_passes(self):
        self.assertEqual(self.errors(), [])

    def test_unknown_module_is_rejected(self):
        f = self.tmp / L.ACCREDITATIONS_DIR / "accred-builder" / L.DEFINITION_FILE
        f.write_text(f.read_text().replace("  - BLD-201\n", "  - BLD-999\n"))
        self.assertTrue(any("unknown module BLD-999" in e for e in self.errors()))

    def test_nested_scorm_source_is_rejected(self):
        (self.tmp / L.ACCREDITATIONS_DIR / "accred-builder" / "module.json").write_text("{}")
        self.assertTrue(any("contains module.json" in e for e in self.errors()))

    def test_legacy_directory_is_rejected(self):
        (self.tmp / "modules").mkdir()
        self.assertTrue(any("legacy directory modules/" in e for e in self.errors()))

    def test_built_badge_needs_built_modules(self):
        shutil.rmtree(self.tmp / L.MODULES_DIR / "SOL-203")
        self.assertTrue(any("SOL-203 is not built" in e for e in self.errors()))


class ScriptsUseLearningModules(unittest.TestCase):
    def test_scaffold_writes_to_learning_modules(self):
        with tempfile.TemporaryDirectory() as tmp:
            r = run(SCRIPTS / "scaffold_module.py", "--module-id", "TST-101", "--title", "Test", "--repo-root", tmp)
            self.assertEqual(r.returncode, 0, r.stderr)
            self.assertTrue((Path(tmp) / "learning/modules/TST-101/module.json").is_file())
            self.assertFalse((Path(tmp) / "modules").exists())

    def test_watch_sources_scans_learning_modules(self):
        with tempfile.TemporaryDirectory() as tmp:
            shutil.copytree(ROOT / L.MODULES_DIR / "BLD-101", Path(tmp) / L.MODULES_DIR / "BLD-101")
            out = Path(tmp) / "queue.json"
            r = run(SCRIPTS / "watch_sources.py", "--repo-root", tmp, "--out", out, "--today", "2030-01-01")
            self.assertEqual(r.returncode, 0, r.stderr)
            ids = [c["module_id"] for c in json.loads(out.read_text())["candidates"]]
            self.assertIn("BLD-101", ids)

    def test_build_and_validate_from_learning_modules(self):
        with tempfile.TemporaryDirectory() as tmp:
            r = run(SCRIPTS / "build_scorm.py", "--module", ROOT / L.MODULES_DIR / "accred-agents", "--output", tmp)
            self.assertEqual(r.returncode, 0, r.stderr)
            z = Path(r.stdout.strip().splitlines()[0])
            self.assertEqual(z.name, "accred-agents-v1.0.0-scorm12.zip")
            with zipfile.ZipFile(z) as zf:
                self.assertIn("imsmanifest.xml", zf.namelist())
            v = run(SCRIPTS / "validate_scorm.py", z)
            self.assertEqual(v.stdout.strip().splitlines()[-1], "PASS", v.stdout)


if __name__ == "__main__":
    unittest.main()
