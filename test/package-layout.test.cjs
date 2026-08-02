const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');

test('ships a RequireJS-compatible NocoBase client-v2 entry', () => {
  const entry = path.join(root, 'dist/client-v2/index.js');

  assert.equal(fs.existsSync(entry), true, 'NocoBase loads dist/client-v2/index.js for client-v2 plugins');
  assert.equal(read('client-v2.js').trim(), "module.exports = require('./dist/client-v2/index.js');");
  assert.match(read('dist/client-v2/index.js'), /webpackUniversalModuleDefinition|define\(/);
});

test('ships a real legacy auth entry alongside the client-v2 settings entry', () => {
  const pkg = JSON.parse(read('package.json'));
  const legacyClient = read('src/client/index.tsx');
  const buildScript = read('scripts/build-plugin.cjs');

  assert.equal(pkg.version, '1.0.16');
  assert.equal(pkg.files.includes('client.js'), true, 'the public /signin shell requires a legacy root marker');
  assert.equal(pkg.files.includes('client.d.ts'), true);
  assert.equal(pkg.files.includes('dist/client'), true);
  assert.equal(read('client.js').trim(), "module.exports = require('./dist/client/index.js');");
  assert.match(legacyClient, /import \{ Plugin \} from '@nocobase\/client';/);
  assert.doesNotMatch(legacyClient, /@nocobase\/client-v2/);
  assert.match(legacyClient, /router\.add\('auth'/);
  assert.match(buildScript, /buildPluginClient\(cwd, userConfig, false, log, 'client'\)/);
  assert.match(buildScript, /buildPluginClient\(cwd, userConfig, false, log, 'client-v2'\)/);
});

test('uses the official legacy auth provider without obsolete ReadPretty rendering', () => {
  const layout = read('src/client/AuthLayout.tsx');

  assert.match(layout, /AuthenticatorsContextProvider \} from '@nocobase\/plugin-auth\/client'/);
  assert.doesNotMatch(layout, /AuthenticatorsContext\.Provider/);
  assert.doesNotMatch(layout, /ReadPretty/);
});

test('renders the bundled company logo instead of the default text brand in every public login layout', () => {
  const legacyLayout = read('src/client/AuthLayout.tsx');
  const modernLayout = read('src/client-v2/LoginPageLayout.tsx');
  const pkg = JSON.parse(read('package.json'));

  assert.equal(fs.existsSync(path.join(root, 'src/assets/oxmode-logo.jpg')), true, 'the public login must not depend on an external logo URL');
  assert.equal(pkg.files.includes('dist/assets'), true, 'the packaged plugin must include the bundled logo asset');
  assert.match(legacyLayout, /import \{ BrandLogo \} from '\.\.\/shared\/BrandLogo';/);
  assert.match(modernLayout, /import \{ BrandLogo \} from '\.\.\/shared\/BrandLogo';/);
  assert.equal((legacyLayout.match(/<BrandLogo \/>/g) || []).length, 3, 'legacy layout must cover default, center, and left-right views');
  assert.match(modernLayout, /<BrandLogo logoUrl=\{systemLogoUrl\} \/>/);
  assert.doesNotMatch(legacyLayout, /<h2 style=\{titleStyle\}>\{data\?\.data\?\.title\}<\/h2>/);
  assert.doesNotMatch(modernLayout, /<h1[^>]*>\{title\}<\/h1>/);
});

test('binds React for the legacy JSX transform used by public login bundles', () => {
  const brandLogo = read('src/shared/BrandLogo.tsx');

  assert.match(brandLogo, /^import React from 'react';$/m);
});

test('renders public support text without interpreting it as HTML', () => {
  const poweredBy = read('src/client/PoweredBy.tsx');

  assert.doesNotMatch(poweredBy, /dangerouslySetInnerHTML/);
  assert.match(poweredBy, /\{supportLabel\}: \{supportText\}/);
});

test('declares the NocoBase v2 dependencies required by its server and client', () => {
  const pkg = JSON.parse(read('package.json'));

  assert.equal(pkg.version, '1.0.16');
  assert.equal(pkg.scripts.prepack, 'npm run build && npm test');
  assert.equal(pkg.peerDependencies['@nocobase/client-v2'], '2.x');
  assert.equal(pkg.peerDependencies['@nocobase/database'], '2.x');
  assert.equal(pkg.files.includes('client.js'), true, 'the public /signin shell requires a legacy client entry');
  assert.equal(pkg.files.includes('dist/shared'), true, 'server runtime helpers must be included in the package');
});

test('uses only exports available to the NocoBase 2.1 client-v2 auth layout', () => {
  const layout = read('src/client-v2/LoginPageLayout.tsx');
  const tsconfig = JSON.parse(read('tsconfig.json'));

  assert.match(layout, /PoweredBy, useSystemSettings \} from '@nocobase\/client-v2'/);
  assert.doesNotMatch(layout, /PoweredBy \} from '@nocobase\/plugin-auth\/client-v2'/);
  assert.doesNotMatch(layout, /paddingXXL/);
  assert.ok(!tsconfig.exclude.includes('src/client'), 'the active legacy entry must participate in type checks');
});

test('registers a configurable ACL snippet for the Login Page settings UI', () => {
  const client = read('src/client-v2/index.tsx');
  const server = read('src/server/plugin.ts');

  assert.match(client, /aclSnippet: 'pm\.login-page'/);
  assert.match(server, /name: 'pm\.login-page'/);
  assert.match(server, /actions: \['loginSettings:update'\]/);
  assert.match(server, /acl\.allow\('loginSettings', 'update', 'allowConfigure'\)/);
  assert.match(server, /acl\.allow\('loginSettings', 'get', 'public'\)/);
  assert.match(server, /acl\.addFixedParams\('loginSettings', 'get', \(\) => \(\{ filter: \{ id: 1 \} \}\)\)/);
  assert.doesNotMatch(server, /\['get', 'list'\]/, 'the unauthenticated login route must not enumerate settings');

  const collection = read('src/server/collections/loginSettings.ts');
  assert.match(collection, /through: 'loginSettings_attachments'/, 'upgrade must retain the v1.0.0 attachment join table');
  assert.match(collection, /foreignKey: 'loginSettingsId'/);
  assert.match(collection, /otherKey: 'attachmentId'/);
});

test('compiles legacy-layout compatibility into the release artifacts', () => {
  const plugin = read('dist/server/plugin.js');
  const serverHelper = read('dist/server/normalize-legacy-login-layout.js');
  const shared = read('dist/shared/login-layout.js');
  const client = fs
    .readdirSync(path.join(root, 'dist/client-v2'))
    .filter((file) => file.endsWith('.js'))
    .map((file) => read(path.join('dist/client-v2', file)))
    .join('\n');
  const migration = path.join(root, 'dist/server/migrations/20260727190000-normalize-legacy-login-layout.js');

  assert.match(plugin, /async upgrade\(\)[\s\S]*normalizeLegacyLoginLayouts/);
  assert.match(plugin, /normalizeLegacyLoginLayouts/);
  assert.match(serverHelper, /shared\/login-layout/);
  assert.match(shared, /leftRight/);
  assert.match(shared, /left-right/);
  assert.match(client, /leftRight/);
  assert.match(client, /left-right/);
  assert.equal(fs.existsSync(migration), true);
});

test('emits NocoBase 2.2 external versions accepted by workplace', () => {
  const pkg = JSON.parse(read('package.json'));
  const externalVersions = read('dist/externalVersion.js');
  const directNocoBaseDeps = [
    '@nocobase/actions',
    '@nocobase/auth',
    '@nocobase/build',
    '@nocobase/client',
    '@nocobase/client-v2',
    '@nocobase/database',
    '@nocobase/plugin-auth',
    '@nocobase/server',
    '@nocobase/test',
  ];

  assert.equal(pkg.version, '1.0.16');
  for (const dependency of directNocoBaseDeps) {
    assert.equal(pkg.devDependencies[dependency], '2.2.0-beta.9');
  }
  for (const dependency of [
    '@nocobase/client-v2',
    '@nocobase/plugin-auth',
    '@nocobase/utils',
    '@nocobase/database',
    '@nocobase/server',
  ]) {
    assert.match(externalVersions, new RegExp(`"${dependency.replace('/', '\\/')}": "2\\.2\\.0-beta\\.9"`));
  }
});
