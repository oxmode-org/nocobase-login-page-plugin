export const LEGACY_LEFT_RIGHT_LAYOUT = 'leftRight';

export type LoginLayout = 'default' | 'center' | 'left-right';

export const normalizeAttachmentArray = <T>(value: unknown): T[] => (Array.isArray(value) ? value as T[] : []);

export const normalizeLoginLayout = (layout: unknown): LoginLayout => {
  if (layout === LEGACY_LEFT_RIGHT_LAYOUT) {
    return 'left-right';
  }

  if (layout === 'center' || layout === 'left-right') {
    return layout;
  }

  return 'default';
};
