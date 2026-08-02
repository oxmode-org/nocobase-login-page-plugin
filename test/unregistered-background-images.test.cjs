const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const { JSDOM } = require('jsdom');

const root = path.resolve(__dirname, '..');
const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', { url: 'http://localhost/' });
const matchMedia = () => ({
  matches: false,
  addListener() {},
  removeListener() {},
  addEventListener() {},
  removeEventListener() {},
  dispatchEvent() { return false; },
});

dom.window.matchMedia = matchMedia;
dom.window.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

for (const key of ['window', 'document', 'navigator', 'HTMLElement', 'Element', 'Node', 'MutationObserver', 'getComputedStyle', 'SVGElement']) {
  global[key] = dom.window[key];
}
global.matchMedia = matchMedia;
global.ResizeObserver = dom.window.ResizeObserver;

const React = require('react');
const { render, act } = require('@testing-library/react');
const { Form, Input } = require('antd');

test('Ant Design validateFields excludes unregistered attachment state', async () => {
  let form;
  const attachments = [{ id: 1, url: '/storage/background.png' }];

  const Fixture = () => {
    const [instance] = Form.useForm();
    form = instance;
    return React.createElement(Form, { form: instance }, React.createElement(Form.Item, { name: 'layout' }, React.createElement(Input)));
  };

  const container = document.createElement('div');
  document.body.append(container);
  const view = render(React.createElement(Fixture), { container });
  await act(async () => form.setFieldsValue({ layout: 'default', backgroundImages: attachments }));
  const values = await form.validateFields();

  assert.equal(values.backgroundImages, undefined);
  assert.deepEqual(form.getFieldValue('backgroundImages'), attachments);
  view.unmount();
  container.remove();
});

test('Ant Design useWatch preserves unregistered attachment state when requested', async () => {
  let form;
  let watched;
  const attachments = [{ id: 1, url: '/storage/background.png' }];

  const Fixture = () => {
    const [instance] = Form.useForm();
    form = instance;
    watched = Form.useWatch('backgroundImages', { form: instance, preserve: true });
    return React.createElement(Form, { form: instance }, React.createElement(Form.Item, { name: 'layout' }, React.createElement(Input)));
  };

  const container = document.createElement('div');
  document.body.append(container);
  const view = render(React.createElement(Fixture), { container });
  await act(async () => form.setFieldValue('backgroundImages', attachments));

  assert.deepEqual(watched, attachments);
  view.unmount();
  container.remove();
});

test('saves background images from the form store after removing the Upload binding', () => {
  const page = fs.readFileSync(path.join(root, 'src/client-v2/LoginSettingsPage.tsx'), 'utf8');

  assert.match(
    page,
    /backgroundImages:\s*normalizeAttachmentArray<Attachment>\(form\.getFieldValue\('backgroundImages'\)\)\.map/,
  );
});

test('watches unregistered background images with preserve enabled', () => {
  const page = fs.readFileSync(path.join(root, 'src/client-v2/LoginSettingsPage.tsx'), 'utf8');

  assert.match(page, /Form\.useWatch<Attachment\[\]>\('backgroundImages', \{ form, preserve: true \}\)/);
});

test('appends completed uploads from the latest form state', () => {
  const page = fs.readFileSync(path.join(root, 'src/client-v2/LoginSettingsPage.tsx'), 'utf8');

  assert.match(
    page,
    /const currentBackgroundImages = normalizeAttachmentArray<Attachment>\(form\.getFieldValue\('backgroundImages'\)\);/,
  );
  assert.match(page, /form\.setFieldValue\('backgroundImages', \[\.\.\.currentBackgroundImages, attachment\]\);/);
});

test('keeps upload loading active until every concurrent upload settles', async () => {
  let beginUpload;
  let settleUpload;
  let uploading;

  const Fixture = () => {
    const [uploadingCount, setUploadingCount] = React.useState(0);
    uploading = uploadingCount > 0;
    beginUpload = () => setUploadingCount((count) => count + 1);
    settleUpload = () => setUploadingCount((count) => Math.max(0, count - 1));
    return null;
  };

  const container = document.createElement('div');
  document.body.append(container);
  const view = render(React.createElement(Fixture), { container });

  await act(async () => {
    beginUpload();
    beginUpload();
  });
  assert.equal(uploading, true);

  await act(async () => settleUpload());
  assert.equal(uploading, true);

  await act(async () => settleUpload());
  assert.equal(uploading, false);

  view.unmount();
  container.remove();
});

test('uses an active upload counter for the background upload button', () => {
  const page = fs.readFileSync(path.join(root, 'src/client-v2/LoginSettingsPage.tsx'), 'utf8');

  assert.match(page, /const \[uploadingCount, setUploadingCount\] = useState\(0\);/);
  assert.match(page, /const uploading = uploadingCount > 0;/);
  assert.match(page, /setUploadingCount\(\(count\) => count \+ 1\);/);
  assert.match(page, /setUploadingCount\(\(count\) => Math\.max\(0, count - 1\)\);/);
});
