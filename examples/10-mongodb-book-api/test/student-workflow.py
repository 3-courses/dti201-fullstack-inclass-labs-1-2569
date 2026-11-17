"""Rehearse file creation and npm init in a fresh student repo.

A disposable local bare remote stands in for GitHub. File copies stand in for
pasting each linked file's contents. Use a disposable DB via LAB10_TEST_URI.
"""
from pathlib import Path
from urllib.parse import urlsplit, urlunsplit
import json, os, re, shutil, subprocess, tempfile, uuid

SOURCE = Path(__file__).resolve().parents[1]
COURSE = SOURCE.parents[1]

def run(args, cwd):
    result = subprocess.run(args, cwd=cwd, capture_output=True, text=True)
    if result.returncode:
        raise RuntimeError(f'{args[0]} failed: {result.stdout}\n{result.stderr}')
    return result.stdout

def copy(root, source, target):
    path = root / target
    path.parent.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(SOURCE / source, path)

def script(folder, name, command):
    run(['npm', 'pkg', 'set', f'scripts.{name}={command}'], folder)

def identity(folder):
    run(['git', 'config', 'user.name', 'Lab Workflow Test'], folder)
    run(['git', 'config', 'user.email', 'lab@example.invalid'], folder)

def checkpoint(root, message):
    run(['git', 'add', '.'], root)
    names = run(['git', 'diff', '--cached', '--name-only'], root).splitlines()
    assert not any(Path(n).name == '.env' or 'node_modules' in Path(n).parts or 'dist' in Path(n).parts for n in names)
    run(['git', 'commit', '-m', message], root)
    run(['git', 'push'], root)
    assert not run(['git', 'status', '--porcelain'], root)

with tempfile.TemporaryDirectory(prefix='lab10-own-repo-') as temporary:
    base = Path(temporary)
    remote = base / 'remote.git'
    seed = base / 'initial-readme'
    seed.mkdir()
    run(['git', 'init', '--bare', '--initial-branch=main', str(remote)], base)
    run(['git', 'init', '--initial-branch=main'], seed)
    identity(seed)
    (seed / 'README.md').write_text('# DTI201 Bookstore\n')
    run(['git', 'add', 'README.md'], seed)
    run(['git', 'commit', '-m', 'Initial README'], seed)
    run(['git', 'remote', 'add', 'origin', str(remote)], seed)
    run(['git', 'push', '-u', 'origin', 'main'], seed)
    run(['git', 'clone', str(remote), 'dti201-bookstore'], base)
    root = base / 'dti201-bookstore'
    identity(root)
    intro = (COURSE / 'docs/lab10/00-create-your-repository.md').read_text()
    (root / '.gitignore').write_text(re.search(r'```gitignore\n(.*?)```', intro, re.S).group(1))
    checkpoint(root, 'Initialize bookstore project')
    backend = root / 'backend'
    backend.mkdir()
    run(['npm', 'init', '-y'], backend)
    run(['npm', 'pkg', 'set', 'type=module'], backend)
    run(['npm', 'install', 'express@5.3.0', 'mongoose@8.24.8'], backend)
    for name in ['src/db.js', 'scripts/check-db.js', '.env.example']:
        copy(root, name, f'backend/{name}')
    parsed = urlsplit(os.environ.get('LAB10_TEST_URI', 'mongodb://127.0.0.1:27018'))
    uri = urlunsplit(parsed._replace(path='/course_books_lab10_test_' + uuid.uuid4().hex))
    (backend / '.env').write_text(f'MONGODB_URI={uri}\nPORT=3001\n')
    script(backend, 'db:check', 'node --env-file=.env scripts/check-db.js')
    assert not (backend / 'src/models/Book.js').exists()
    assert 'Database ping: OK' in run(['npm', 'run', 'db:check'], backend)
    assert 'backend/.env' in run(['git', 'check-ignore', 'backend/.env'], root)
    print('Fresh clone + npm init + connection before Book model: PASS', flush=True)
    for name in ['data.js', 'inspect.js', 'sample-db.js']:
        copy(root, f'demo/{name}', f'backend/demo/{name}')
    for name, command in [('demo:seed', 'node --env-file=.env demo/sample-db.js --seed'), ('demo:inspect', 'node --env-file=.env demo/sample-db.js')]:
        script(backend, name, command)
        assert '3200 satang = 32.00 THB' in run(['npm', 'run', name], backend)
    checkpoint(root, 'Connect Atlas and add sample database')
    for name in ['Drink.js', 'drinks.js']:
        copy(root, f'demo/{name}', f'backend/demo/{name}')
    script(backend, 'demo:drinks', 'node --env-file=.env demo/drinks.js')
    assert 'Iced Cocoa' in run(['npm', 'run', 'demo:drinks'], backend)
    checkpoint(root, 'Read drinks through a Mongoose model')
    for name in ['src/models/Book.js', 'src/books.js', 'scripts/seed.js', 'src/book-store.js', 'src/app.js', 'src/server.js']:
        copy(root, name, f'backend/{name}')
    script(backend, 'seed', 'node --env-file=.env scripts/seed.js')
    script(backend, 'dev', 'node --env-file=.env --watch src/server.js')
    script(backend, 'start', 'node --env-file=.env src/server.js')
    for _ in range(2):
        assert 'Books: 200' in run(['npm', 'run', 'seed'], backend)
    run(['node', '--env-file=.env', '--input-type=module', '-e', "const {createApp}=await import('./src/app.js'); const app=createApp(); const server=app.listen(0,'127.0.0.1'); await new Promise(r=>server.once('listening',r)); const result=await fetch('http://127.0.0.1:'+server.address().port+'/api/books/1'); if(result.status!==422)process.exitCode=1; server.close();"], backend)
    checkpoint(root, 'Add persistent book CRUD API')
    print('Staged file creation, sample data, Book seed and API imports: PASS', flush=True)
    frontend = root / 'frontend'
    frontend.mkdir()
    run(['npm', 'init', '-y'], frontend)
    run(['npm', 'pkg', 'set', 'type=module'], frontend)
    run(['npm', 'install', 'react@19.3.1', 'react-dom@19.3.1'], frontend)
    run(['npm', 'install', '-D', 'vite@8.3.8', '@vitejs/plugin-react@6.3.0'], frontend)
    for name, command in [('dev', 'vite --host 127.0.0.1'), ('build', 'vite build'), ('preview', 'vite preview --host 127.0.0.1')]:
        script(frontend, name, command)
    for name in ['index.html', 'vite.config.js', 'src/main.jsx', 'src/style.css', 'src/api.js', 'src/App.jsx']:
        copy(root, f'client/{name}', f'frontend/{name}')
    run(['npm', 'run', 'build'], frontend)
    checkpoint(root, 'Add React interface for book CRUD')
    names = run(['git', 'ls-files'], root).splitlines()
    assert 'backend/package-lock.json' in names and 'frontend/package-lock.json' in names
    assert run(['git', '--git-dir', str(remote), 'rev-parse', 'main'], base) == run(['git', 'rev-parse', 'HEAD'], root)
    print('Independent frontend build, own lock files, commits and pushes: PASS', flush=True)
