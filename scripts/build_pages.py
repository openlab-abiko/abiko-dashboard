#!/usr/bin/env python3
"""Copy the reviewed public files into a new GitHub Pages output directory."""

import argparse
from pathlib import Path, PurePosixPath
import shutil


ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / "scripts" / "pages-files.txt"
ASSET_TYPES = {".css", ".js", ".json", ".webp", ".png", ".jpg", ".jpeg", ".svg", ".woff", ".woff2", ".ico"}


def public_files():
    paths = set()
    for line in MANIFEST.read_text(encoding="utf-8").splitlines():
        entry = line.strip()
        if not entry or entry.startswith("#"):
            continue
        path = PurePosixPath(entry)
        if entry != path.as_posix() or path.is_absolute() or "\\" in entry or any(
            part.startswith(".") for part in path.parts
        ):
            raise ValueError(f"Invalid public path: {entry}")
        if not (
            (len(path.parts) == 1 and path.suffix == ".html")
            or (len(path.parts) == 2 and path.parts[0] == "articles" and path.suffix == ".html")
            or (len(path.parts) >= 2 and path.parts[0] == "assets" and path.suffix in ASSET_TYPES)
        ):
            raise ValueError(f"Path outside the public site: {entry}")
        source = ROOT / path
        if source.resolve() != source or not source.is_file():
            raise ValueError(f"Missing file or symbolic link: {entry}")
        if path in paths:
            raise ValueError(f"Duplicate public path: {entry}")
        paths.add(path)
    if PurePosixPath("index.html") not in paths:
        raise ValueError("The public file list must include index.html")
    return sorted(paths)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path, default=ROOT / "_site", help="New output directory")
    args = parser.parse_args()
    try:
        paths = public_files()
        args.output.mkdir(parents=True)
        for path in paths:
            destination = args.output / path
            destination.parent.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(ROOT / path, destination)
        (args.output / ".nojekyll").touch()
    except (OSError, ValueError) as error:
        parser.exit(1, f"Pages build failed: {error}\n")
    print(f"Built {len(paths)} public files and .nojekyll in {args.output}")


if __name__ == "__main__":
    main()
