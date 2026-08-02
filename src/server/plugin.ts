import { resolve } from 'node:path';
import { Plugin } from '@nocobase/server';
import { normalizeLegacyLoginLayouts } from './normalize-legacy-login-layout';

type FileManager = {
  getFileStream: (file: unknown) => Promise<{ stream: NodeJS.ReadableStream; contentType?: string }>;
};

const defaults = {
  layout: 'default',
  titleFontSize: 28,
  technicalSupport: '',
};

export default class LoginPagePlugin extends Plugin {
  async beforeLoad() {
    await this.importCollections(resolve(__dirname, 'collections'));
    this.app.acl.registerSnippet({
      name: 'pm.login-page',
      actions: ['loginSettings:update'],
    });
  }

  async load() {
    this.app.acl.allow('loginSettings', 'get', 'public');
    this.app.acl.addFixedParams('loginSettings', 'get', () => ({ filter: { id: 1 } }));
    this.app.acl.allow('loginSettings', 'update', 'allowConfigure');

    this.app.resourceManager.define({
      name: 'loginPageMedia',
      actions: {
        get: async (ctx, next) => {
          const attachmentId = Number(ctx.action?.params.filterByTk);
          if (!Number.isInteger(attachmentId) || attachmentId <= 0) {
            ctx.throw(404);
            return;
          }

          const loginSettings = await ctx.db.getRepository('loginSettings').findOne({
            filterByTk: 1,
            appends: ['backgroundImages'],
          });
          const backgroundImageIds = new Set(
            (loginSettings?.get('backgroundImages') || []).map((attachment: { get: (key: string) => unknown }) =>
              Number(attachment.get('id')),
            ),
          );
          const systemSettings = await ctx.db.getRepository('systemSettings').findOne({ filterByTk: 1 });
          const logoId = Number(systemSettings?.get('logoId'));

          if (attachmentId !== logoId && !backgroundImageIds.has(attachmentId)) {
            ctx.throw(404);
            return;
          }

          const attachment = await ctx.db.getRepository('attachments').findOne({ filterByTk: attachmentId });
          if (!attachment || !String(attachment.get('mimetype')).startsWith('image/')) {
            ctx.throw(404);
            return;
          }

          const fileManager = this.app.pm.get('@nocobase/plugin-file-manager') as unknown as FileManager | undefined;
          if (!fileManager || typeof fileManager.getFileStream !== 'function') {
            ctx.throw(503, 'File Manager is unavailable');
            return;
          }

          const { stream, contentType } = await fileManager.getFileStream(attachment);
          ctx.set('Cache-Control', 'public, max-age=300');
          ctx.type = contentType || attachment.get('mimetype') || 'application/octet-stream';
          ctx.body = stream;
          await next();
        },
      },
    });
    this.app.acl.allow('loginPageMedia', 'get', 'public');
  }

  async upgrade() {
    await super.upgrade();
    await normalizeLegacyLoginLayouts(this.db.getRepository('loginSettings'));
  }

  async afterEnable() {
    const repository = this.db.getRepository('loginSettings');
    const record = await repository.findOne({ filterByTk: 1 });

    if (!record) {
      await repository.create({ values: { id: 1, ...defaults } });
    }

    await normalizeLegacyLoginLayouts(repository);
  }
}
