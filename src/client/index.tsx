import { Plugin } from '@nocobase/client-v2';

export class PluginLoginPageClient extends Plugin {
  async load() {
    // Register settings menu item
    this.pluginSettingsManager.addMenuItem({
      key: 'login-page',
      title: this.t('Login settings'),
      icon: 'ControlOutlined',
    });

    // Register settings page
    this.pluginSettingsManager.addPageTabItem({
      menuKey: 'login-page',
      key: 'index',
      title: this.t('Login settings'),
      componentLoader: () => import('./LoginSettingsPane'),
    });

    // Override auth layout route (login page)
    this.router.add('auth', {
      componentLoader: () => import('./AuthLayout'),
    });
  }
}

export default PluginLoginPageClient;
