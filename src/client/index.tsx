/**
 * Legacy (NocoBase 1.x-style) client entry — adapted from @youchaoyun/plugin-login-settings
 * (https://github.com/youchaoyun/nocobase-login-settings), Copyright 有巢数智 (youchaoyun),
 * licensed AGPL-3.0. Modified by Masu Phan since 2026-07-27 for NocoBase 2.x client-v2 bridging
 * (see src/client-v2/ for the primary NocoBase 2.2.x+ implementation).
 * This file remains licensed under AGPL-3.0 — see LICENSE.
 */
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
