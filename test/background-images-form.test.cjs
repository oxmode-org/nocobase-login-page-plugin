const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');

test('normalizes a malformed Upload field payload to an empty attachment array', () => {
  const { normalizeAttachmentArray } = require(path.join(root, 'dist/shared/login-layout.js'));
  const attachments = [{ id: 1, url: '/storage/1.png' }];

  assert.equal(typeof normalizeAttachmentArray, 'function');
  assert.deepEqual(normalizeAttachmentArray({ file: { uid: 'upload-1' }, fileList: [] }), []);
  assert.deepEqual(normalizeAttachmentArray('C:\\fakepath\\background.png'), []);
  assert.strictEqual(normalizeAttachmentArray(attachments), attachments);
});

test('does not bind the background-image Upload wrapper as an Ant Design Form field', () => {
  const page = read('src/client-v2/LoginSettingsPage.tsx');

  assert.doesNotMatch(page, /<Form\.Item\s+name="backgroundImages"/);
});

test('normalizes background images before legacy public auth rendering', () => {
  const authLayout = read('src/client/AuthLayout.tsx');

  assert.match(authLayout, /import \{ normalizeAttachmentArray \} from '\.\.\/shared\/login-layout';/);
  assert.match(authLayout, /const backgroundImages = normalizeAttachmentArray<\{ id: number; url: string \}>\(/);
});
