import { Plugin } from '@nocobase/client-v2';

export default class LoginPagePlugin extends Plugin {
  async load() {
    this.app.pluginSettingsManager.addMenuItem({
      key: 'login-page',
      title: this.t('Login page') as unknown as string,
      icon: 'LoginOutlined',
      aclSnippet: 'pm.login-page',
    });

    this.app.pluginSettingsManager.addPageTabItem({
      menuKey: 'login-page',
      key: 'index',
      title: this.t('Login settings') as unknown as string,
      aclSnippet: 'pm.login-page',
      componentLoader: () => import('./LoginSettingsPage'),
    });

    this.router.add('auth', {
      componentLoader: () => import('./LoginPageLayout'),
    });
  }
}
