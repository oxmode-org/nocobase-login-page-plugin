import { Plugin } from '@nocobase/server';
import { resolve } from 'path';

export class PluginLoginPageServer extends Plugin {
  async afterAdd() {}

  async beforeLoad() {
    this.app.acl.registerSnippet({
      name: `pm.${this.name}.login-page`,
      actions: ['loginSettings:update'],
    });
  }

  async load() {
    await this.importCollections(resolve(__dirname, 'collections'));
    this.app.acl.addFixedParams('loginSettings', 'destroy', () => {
      return { 'id.$ne': 1 };
    });
    this.app.acl.allow('loginSettings', '*', 'public');
  }

  async install() {
    const repo = this.db.getRepository('loginSettings');
    const existing = await repo.count();
    if (existing === 0) {
      await repo.create({ values: { layout: 'default' } });
    }
  }

  async afterEnable() {}
  async afterDisable() {}
  async remove() {}
}

export default PluginLoginPageServer;