"""Production isolation: the development review overlay must never reach a SCORM package.

The overlay lives only in tools/feedback and is injected by the dev server at response time.
These tests prove that module sources, shared runtime sources, and every built package are free
of it, and that the validator and packagers reject a package that does contain it.
"""
import contextlib
import io
import shutil
import subprocess
import sys
import tempfile
import unittest
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "tools" / "feedback"))
sys.path.insert(0, str(ROOT / "skills" / "scripts"))

import markers  # noqa: E402
import server  # noqa: E402
import validate_scorm  # noqa: E402

DIST = Path(__import__("os").environ.get("PACKAGES_DIR", ROOT / "dist"))


def packages():
    return sorted(DIST.rglob("*.zip")) if DIST.exists() else []


class SourcesAreClean(unittest.TestCase):
    def test_module_and_shared_sources_have_no_overlay(self):
        for base in (ROOT / "learning", ROOT / "shared"):
            if base.exists():
                self.assertEqual(markers.scan_tree(base), [], base)

    def test_overlay_assets_live_only_in_tools_feedback(self):
        self.assertTrue((ROOT / "tools" / "feedback" / "overlay" / "overlay.js").exists())
        for p in ROOT.rglob("overlay.js"):
            rel = p.relative_to(ROOT)
            if rel.parts[0] in {"node_modules", ".git"}:
                continue
            self.assertEqual(rel.parts[:2], ("tools", "feedback"), rel)

    def test_validator_markers_match_framework_markers(self):
        self.assertEqual(set(validate_scorm.DEV_FEEDBACK_MARKERS), set(markers.MARKERS))
        skill_copy = ROOT / ".glean" / "skills" / "glean-partner-accreditation-studio" / "scripts" / "validate_scorm.py"
        if skill_copy.exists():
            self.assertIn("DEV_FEEDBACK_MARKERS", skill_copy.read_text(),
                          "the packagers' validator copy is missing the feedback guard")


class PackagesAreClean(unittest.TestCase):
    def test_every_built_package_is_free_of_the_overlay(self):
        found = {str(z.relative_to(DIST)): markers.scan_package(z) for z in packages()}
        self.assertEqual({k: v for k, v in found.items() if v}, {})

    def test_packaged_html_matches_source_html_not_dev_server_html(self):
        """A package's launch page is the module's index.html as written, never the served variant."""
        for z in packages():
            with zipfile.ZipFile(z) as zf:
                if "index.html" not in zf.namelist():
                    continue
                html = zf.read("index.html").decode("utf-8", "ignore")
            self.assertNotIn("/__feedback/overlay.js", html, z.name)


class GuardsRejectALeak(unittest.TestCase):
    """Simulate the failure: a package built from a page captured off the dev server."""

    def _leaky_package(self, tmp: Path) -> Path:
        src = next(z for z in packages() if "index.html" in zipfile.ZipFile(z).namelist()) if packages() else None
        if src is None:
            self.skipTest("no built packages to copy; run a packager first")
        out = tmp / "leak.zip"
        with zipfile.ZipFile(src) as zin, zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED) as zout:
            for name in zin.namelist():
                data = zin.read(name)
                if name == "index.html":
                    data = server.inject(data.decode("utf-8", "ignore"), {"scope_type": "module", "scope_id": "X",
                                                                           "page": "index.html", "api": "/__feedback/api"}).encode()
                zout.writestr(name, data)
        return out

    def test_marker_scan_flags_injected_package(self):
        with tempfile.TemporaryDirectory() as t:
            z = self._leaky_package(Path(t))
            self.assertTrue(markers.scan_package(z))

    def test_validate_scorm_fails_injected_package(self):
        with tempfile.TemporaryDirectory() as t:
            z = self._leaky_package(Path(t))
            r = subprocess.run([sys.executable, str(ROOT / "skills" / "scripts" / "validate_scorm.py"), str(z)],
                               capture_output=True, text=True)
            self.assertIn("Development feedback overlay in package", r.stdout)
            self.assertNotEqual(r.stdout.strip().splitlines()[-1], "PASS")

    def test_cli_guard_fails_injected_package(self):
        with tempfile.TemporaryDirectory() as t:
            z = self._leaky_package(Path(t))
            r = subprocess.run([sys.executable, str(ROOT / "tools" / "feedback" / "cli.py"), "guard", str(z)],
                               capture_output=True, text=True)
            self.assertEqual(r.returncode, 1, r.stdout)

    def test_packager_never_picks_up_overlay(self):
        """Building a module with the generic packager yields a clean package."""
        import build_scorm

        mod = next((d for d in sorted((ROOT / "learning" / "modules").iterdir())
                    if (d / "module.json").exists() and (d / "index.html").exists()), None)
        if mod is None:
            self.skipTest("no module to package")
        with tempfile.TemporaryDirectory() as t:
            work = Path(t) / mod.name
            shutil.copytree(mod, work)
            out = Path(t) / "out"
            try:
                with contextlib.redirect_stdout(io.StringIO()):
                    build_scorm.build(work, out)
            except SystemExit as exc:  # module not packageable by the generic builder
                self.skipTest(f"generic packager declined {mod.name}: {exc}")
            built = sorted(out.glob("*.zip"))
            self.assertEqual(len(built), 1)
            self.assertEqual(markers.scan_package(built[0]), [])


if __name__ == "__main__":
    unittest.main()
