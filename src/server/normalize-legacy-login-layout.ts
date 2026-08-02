import type { Repository } from '@nocobase/database';
import { LEGACY_LEFT_RIGHT_LAYOUT, normalizeLoginLayout } from '../shared/login-layout';

export const normalizeLegacyLoginLayouts = async (repository: Repository) => {
  await repository.update({
    filter: { layout: LEGACY_LEFT_RIGHT_LAYOUT },
    values: { layout: normalizeLoginLayout(LEGACY_LEFT_RIGHT_LAYOUT) },
  });
};
