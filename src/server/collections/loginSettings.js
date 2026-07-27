"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var loginSettings_exports = {};
__export(loginSettings_exports, {
  default: () => loginSettings_default
});
module.exports = __toCommonJS(loginSettings_exports);
var import_database = require("@nocobase/database");
var loginSettings_default = (0, import_database.defineCollection)({
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