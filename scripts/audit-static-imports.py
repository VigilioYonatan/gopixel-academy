#!/usr/bin/env python3
"""Static relative-import check; does not replace TypeScript compilation."""
from pathlib import Path
import re
root=Path(__file__).resolve().parents[1]
files=[*root.joinpath('src').rglob('*.ts'),*root.joinpath('src').rglob('*.tsx'),*root.joinpath('src').rglob('*.mjs'),root/'vite.config.ts']
expr=re.compile(r'(?:\bfrom\s*["\']|\bimport\s*\(\s*["\'])(\.{1,2}/[^"\']+)["\']')
checked=0
broken=[]
for file in files:
 source=file.read_text(encoding='utf-8')
 for relative in expr.findall(source):
  base=(file.parent/relative)
  candidates=[base,*[Path(str(base)+suffix) for suffix in ['.ts','.tsx','.js','.mjs','.json','.mts','.d.mts']],base/'index.ts',base/'index.tsx']
  checked+=1
  if not any(x.is_file() for x in candidates):broken.append(f'{file.relative_to(root)} -> {relative}')
if broken:raise SystemExit('BROKEN IMPORTS:\n'+'\n'.join(broken))
print(f'OK: {checked} source-relative imports resolve across {len(files)} source files')
