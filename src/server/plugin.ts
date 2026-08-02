import { resolve } from 'node:path';
import { Plugin } from '@nocobase/server';
import { normalizeLegacyLoginLayouts } from './normalize-legacy-login-layout';

const defaults = {
  layout: 'default',
  titleFontSize: 28,
  technicalSupport: '',
};

export default class LoginPagePlugin extends Plugin {
  async beforeLoad() {
    await this.importCollections(resolve(__dirname, 'collections'));
    this.app.acl.registerSnippet({
      name: 'pm.login-page',
      actions: ['loginSettings:update'],
    });
  }

  async load() {
    this.app.acl.allow('loginSettings', 'get', 'public');
    this.app.acl.addFixedParams('loginSettings', 'get', () => ({ filter: { id: 1 } }));
    this.app.acl.allow('loginSettings', 'update', 'allowConfigure');
  }

  async upgrade() {
    await super.upgrade();
    await normalizeLegacyLoginLayouts(this.db.getRepository('loginSettings'));
  }

  async afterEnable() {
    const repository = this.db.getRepository('loginSettings');
    const count = await repository.count();

    if (!count) {
      await repository.create({ values: defaults });
    }

    await normalizeLegacyLoginLayouts(repository);
  }
}
