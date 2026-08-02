/**
 * Adapted from @youchaoyun/plugin-login-settings (https://github.com/youchaoyun/nocobase-login-settings),
 * Copyright 有巢数智 (youchaoyun), licensed AGPL-3.0. Modified by Masu Phan since 2026-07-27 for
 * NocoBase 2.x (@nocobase/client) and to render support text as plain text instead of raw HTML.
 * This file remains licensed under AGPL-3.0 — see LICENSE.
 */
import { css } from '@emotion/css';
import { useToken } from '@nocobase/client';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLoginSettings } from './LoginSettingsProvider';

export const PoweredBy = () => {
  const { data: loginSettingsData } = useLoginSettings();
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
  `;

  const supportLabel = supports[i18n.language] || supports['en-US'];
  const supportText = loginSettingsData?.data?.technicalSupport || '';

  if (!supportText) return null;

  return <div className={style}>{supportLabel}: {supportText}</div>;
};