#!/usr/bin/env python3
"""Create local development credentials without committing predictable secrets."""
from pathlib import Path
from secrets import token_urlsafe

root = Path(__file__).resolve().parent.parent
target = root / '.env'
if target.exists():
  raise SystemExit('.env already exists; refusing to overwrite or rotate credentials.')
example = (root / '.env.example').read_text()
example = example.replace('DATABASE_PASSWORD=', 'DATABASE_PASSWORD=' + token_urlsafe(32))
example = example.replace('JWT_SECRET=', 'JWT_SECRET=' + token_urlsafe(48))
with target.open('x') as stream:
  stream.write(example)
target.chmod(0o600)
print('Created .env with random local database/JWT secrets. Do not commit this file.')
