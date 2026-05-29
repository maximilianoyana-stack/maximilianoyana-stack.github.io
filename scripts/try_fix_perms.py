import os
import stat
from pathlib import Path

p = Path('img/Platos')
print('Checking', str(p))
try:
    entries = list(p.iterdir())
    print('Directory is readable. Contains', len(entries), 'entries.')
except PermissionError as e:
    print('PermissionError listing directory:', e)
    try:
        print('Attempting to set directory mode to readable (0o755)...')
        os.chmod(p, 0o755)
        entries = list(p.iterdir())
        print('Success: now readable, contains', len(entries), 'entries.')
    except Exception as e2:
        print('Failed to change permissions:', type(e2).__name__, e2)
        print('On Windows you may need to adjust folder security via Explorer or run this script as Administrator.')
except FileNotFoundError:
    print('Directory does not exist.')
except Exception as e:
    print('Error:', e)
