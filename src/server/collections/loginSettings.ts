import { defineCollection } from '@nocobase/database';

export default defineCollection({
  name: 'loginSettings',
  fields: [
    {
      type: 'bigInt',
      name: 'id',
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    { type: 'string', name: 'layout' },
    {
      type: 'belongsToMany',
      name: 'backgroundImages',
      target: 'attachments',
      through: 'loginSettings_attachments',
      foreignKey: 'attachmentId',
      otherKey: 'loginSettingsId',
      targetKey: 'id',
      sourceKey: 'id',
    },
    { type: 'bigInt', name: 'titleFontSize' },
    { type: 'string', name: 'technicalSupport' },
  ],
});