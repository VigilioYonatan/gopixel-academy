#!/usr/bin/env python3
"""Compare the downloadable native Go archive against repository source byte-for-byte."""
from pathlib import Path
from zipfile import ZipFile, BadZipFile
import sys
root = Path(__file__).resolve().parents[1]
source = root / 'labs-native'
archive = root / 'public/downloads/go-native-senior-labs.zip'
actual = {f'labs-native/{p.relative_to(source).as_posix()}': p for p in source.rglob('*') if p.is_file()}
if not archive.is_file(): raise SystemExit('FAIL: Go lab archive missing')
try:
    with ZipFile(archive) as z:
        if z.testzip() is not None: raise SystemExit('FAIL: archive has bad CRC')
        contents = {n: z.read(n) for n in z.namelist() if not n.endswith('/')}
except BadZipFile: raise SystemExit('FAIL: archive is corrupt')
if set(actual) != set(contents):
    raise SystemExit(f'FAIL missing={sorted(set(actual)-set(contents))} extra={sorted(set(contents)-set(actual))}')
for path, file in actual.items():
    if file.read_bytes() != contents[path]: raise SystemExit(f'FAIL byte mismatch: {path}')
print(f'OK: {len(actual)} native source files match archive byte-for-byte ({archive.stat().st_size} bytes)')
