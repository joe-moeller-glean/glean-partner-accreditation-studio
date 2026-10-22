"""Author aid: show keyword-in-context passages from extracted source text (.research/sbp/).

  python3 tools/sbp/src_grep.py S03 "BVC|Business Value" [--width 300] [--max 6]
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]


def main():
    args = sys.argv[1:]
    width, most = 300, 6
    if "--width" in args:
        i = args.index("--width"); width = int(args[i + 1]); del args[i:i + 2]
    if "--max" in args:
        i = args.index("--max"); most = int(args[i + 1]); del args[i:i + 2]
    sids, pat = args[0].split(","), re.compile(args[1], re.I)
    for sid in sids:
        text = re.sub(r"\s+", " ", (ROOT / ".research" / "sbp" / f"{sid}.txt").read_text(errors="replace"))
        hits, last = 0, -10 ** 9
        for m in pat.finditer(text):
            if m.start() - last < width:
                continue
            last = m.start()
            print(f"[{sid} @{m.start()}] ...{text[max(0, m.start() - width // 2): m.end() + width]}...\n")
            hits += 1
            if hits >= most:
                break


if __name__ == "__main__":
    main()
