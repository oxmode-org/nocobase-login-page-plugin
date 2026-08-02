/**
 * Collection schema (name + core field set) adapted from @youchaoyun/plugin-login-settings
 * (https://github.com/youchaoyun/nocobase-login-settings), Copyright 有巢数智 (youchaoyun),
 * licensed AGPL-3.0. Modified by Masu Phan since 2026-07-27 (title metadata, default values).
 * This file remains licensed under AGPL-3.0 — see LICENSE.
 */
import { defineCollection } from '@nocobase/database';

export default defineCollection({
  name: 'loginSettings',
  title: 'Login settings',
  fields: [
    {
      type: 'string',
      name: 'layout',
      defaultValue: 'default',
    },
    {
      type: 'integer',
      name: 'titleFontSize',
      defaultValue: 28,
    },
    {
      type: 'string',
      name: 'technicalSupport',
      defaultValue: '',
    },
    {
      type: 'belongsToMany',
      name: 'backgroundImages',
      target: 'attachments',
      through: 'loginSettings_attachments',
      foreignKey: 'loginSettingsId',
      otherKey: 'attachmentId',
    },
  ],
});
