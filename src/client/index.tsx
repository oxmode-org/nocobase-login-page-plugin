import { Plugin } from '@nocobase/client';
import { AuthLayout } from './AuthLayout';

export class PluginLoginPageClient extends Plugin {
  async load() {
    this.app.router.add('auth', {
      Component: AuthLayout,
    });
    this.app.addComponents({ AuthLayout });
  }
}

export default PluginLoginPageClient;
