import { Plugin } from '@nocobase/client-v2';
import { AuthLayout } from './AuthLayout';
import { LoginSettingsPane } from './LoginSettingsPane';
import { LoginSettingsProvider } from './LoginSettingsProvider';
import { NAMESPACE } from './locale';

export class PluginLoginPageClient extends Plugin {
  async afterAdd() {}

  async beforeLoad() {}

  async load() {
    // Register plugin settings menu
    this.pluginSettingsManager.addMenuItem({
      key: 'login-page',
      title: `{{t("Login page", { ns: "${NAMESPACE}" })}}`,
      icon: 'ControlOutlined',
    });

    // Register settings page tab
    this.pluginSettingsManager.addPageTabItem({
      menuKey: 'login-page',
      key: 'index',
      title: `{{t("Login page", { ns: "${NAMESPACE}" })}}`,
      componentLoader: () => import('./LoginSettingsPane'),
    });

    // Override the auth layout route
    this.router.add('auth', {
      componentLoader: () => import('./AuthLayout'),
    });

    // Inject LoginSettingsProvider into the app
    this.app.providers.unshift([LoginSettingsProvider, {}]);
  }
}

export default PluginLoginPageClient;