const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');
const { buildSync } = require('esbuild');

const root = path.resolve(__dirname, '..');

const loadTypeScriptModule = (relativeEntry) => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'login-page-test-'));
  const output = path.join(directory, 'module.cjs');

  try {
    buildSync({
      bundle: true,
      entryPoints: [path.join(root, relativeEntry)],
      format: 'cjs',
      outfile: output,
      platform: 'node',
      target: 'node20',
      logLevel: 'silent',
    });
    return require(output);
  } finally {
    fs.rmSync(directory, { force: true, recursive: true });
  }
};

test('normalizes legacy leftRight settings to the v2 layout value', () => {
  const { normalizeLoginLayout } = loadTypeScriptModule('src/shared/login-layout.ts');

  assert.equal(normalizeLoginLayout('leftRight'), 'left-right');
  assert.equal(normalizeLoginLayout('left-right'), 'left-right');
  assert.equal(normalizeLoginLayout('center'), 'center');
  assert.equal(normalizeLoginLayout('unexpected'), 'default');
});

test('normalizes malformed background-image payloads before v2 public rendering', () => {
  const { normalizeLoginSettings } = loadTypeScriptModule('src/client-v2/types.ts');
  const attachments = [{ id: 1, url: '/storage/background.png' }];

  assert.deepEqual(normalizeLoginSettings({ backgroundImages: 'C:\\fakepath\\background.png' }).backgroundImages, []);
  assert.strictEqual(normalizeLoginSettings({ backgroundImages: attachments }).backgroundImages, attachments);
});

test('migrates only legacy leftRight records through the repository API', async () => {
  const { normalizeLegacyLoginLayouts } = loadTypeScriptModule('src/server/normalize-legacy-login-layout.ts');
  const updates = [];

  await normalizeLegacyLoginLayouts({
    update: async (options) => updates.push(options),
  });

  assert.deepEqual(updates, [
    {
      filter: { layout: 'leftRight' },
      values: { layout: 'left-right' },
    },
  ]);
});

test('includes a one-time NocoBase migration for existing installations', () => {
  const migration = path.join(root, 'src/server/migrations/20260727190000-normalize-legacy-login-layout.ts');

  assert.equal(fs.existsSync(migration), true);
  assert.match(fs.readFileSync(migration, 'utf8'), /normalizeLegacyLoginLayouts/);
});

test('runs the compatibility update from the plugin upgrade lifecycle', async () => {
  const LoginPagePlugin = require(path.join(root, 'dist/server/index.js')).default;
  const updates = [];
  const plugin = Object.create(LoginPagePlugin.prototype);
  plugin.app = {
    db: {
      getRepository: () => ({ update: async (options) => updates.push(options) }),
    },
  };

  await plugin.upgrade();

  assert.deepEqual(updates, [{ filter: { layout: 'leftRight' }, values: { layout: 'left-right' } }]);
});
