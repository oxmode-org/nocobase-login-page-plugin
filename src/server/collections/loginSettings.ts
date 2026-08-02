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
