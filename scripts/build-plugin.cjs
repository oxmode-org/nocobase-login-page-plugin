const path = require('node:path');
const { buildPluginClient, buildPluginServer, writeExternalPackageVersion } = require('@nocobase/build/lib/buildPlugin');

const cwd = path.resolve(__dirname, '..');

const userConfig = {
  modifyTsupConfig(config) {
    return {
      ...config,
      config: false,
      entry: config.entry.filter((file) => !file.endsWith('/src/server/collections/loginSettings.js')),
    };
  },
};
const log = (...args) => console.log(...args);

Promise.resolve()
  .then(() => buildPluginClient(cwd, userConfig, false, log, 'client'))
  .then(() => buildPluginClient(cwd, userConfig, false, log, 'client-v2'))
  .then(() => buildPluginServer(cwd, userConfig, false, log))
  .then(() => writeExternalPackageVersion(cwd, log))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
