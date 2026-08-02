import { Migration } from '@nocobase/server';
import { normalizeLegacyLoginLayouts } from '../normalize-legacy-login-layout';

export default class NormalizeLegacyLoginLayout extends Migration {
  on = 'afterLoad' as const;

  async up() {
    await normalizeLegacyLoginLayouts(this.db.getRepository('loginSettings'));
  }
}
