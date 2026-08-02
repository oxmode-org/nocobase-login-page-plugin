import { useRequest } from '@nocobase/client';

export type LoginSettings = {
  layout?: 'default' | 'center' | 'left-right' | 'leftRight';
  titleFontSize?: number;
  technicalSupport?: string;
  backgroundImages?: Array<{ id: number; url: string }>;
};

type LoginSettingsResponse = { data?: LoginSettings };

export const useLoginSettings = () =>
  useRequest<LoginSettingsResponse>({
    url: 'loginSettings:get/1?appends=backgroundImages',
  });