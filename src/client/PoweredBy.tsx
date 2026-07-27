import { css } from '@emotion/css';
import { useToken } from '@nocobase/client-v2';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLoginSettings } from './LoginSettingsProvider';

export const PoweredBy = () => {
  const { data: loginSettingsData } = useLoginSettings() || {};
  const { i18n } = useTranslation();
  const { token } = useToken();

  const supports: Record<string, string> = {
    'en-US': 'Technical Support',
    'zh-CN': '技术支持',
    'vi-VN': 'Hỗ trợ kỹ thuật',
  };

  const style = css`
    text-align: center;
    color: ${token.colorTextDescription};
    a {
      color: ${token.colorTextDescription};
      &:hover {
        color: ${token.colorText};
      }
    }
  `;

  const supportLabel = supports[i18n.language] || supports['en-US'];
  const supportText = loginSettingsData?.data?.technicalSupport || '';

  if (!supportText) return null;

  return (
    <div
      className={style}
      dangerouslySetInnerHTML={{
        __html: `${supportLabel}: ${supportText}`,
      }}
    />
  );
};