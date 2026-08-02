import { normalizeAttachmentArray, normalizeLoginLayout } from '../shared/login-layout';
import type { LoginLayout } from '../shared/login-layout';

export type { LoginLayout } from '../shared/login-layout';

export type LegacyLoginLayout = LoginLayout | 'leftRight';

export type Attachment = {
  id?: number;
  title?: string;
  filename?: string;
  url?: string;
};

export type LoginSettings = {
  id?: number;
  layout?: LegacyLoginLayout;
  titleFontSize?: number;
  technicalSupport?: string;
  backgroundImages?: Attachment[];
};

export const defaultLoginSettings: Required<Pick<LoginSettings, 'layout' | 'titleFontSize' | 'technicalSupport' | 'backgroundImages'>> = {
  layout: 'default',
  titleFontSize: 28,
  technicalSupport: '',
  backgroundImages: [],
};

export const normalizeLoginSettings = (value?: LoginSettings): LoginSettings => ({
  ...defaultLoginSettings,
  ...value,
  layout: normalizeLoginLayout(value?.layout),
  backgroundImages: normalizeAttachmentArray<Attachment>(value?.backgroundImages),
});
