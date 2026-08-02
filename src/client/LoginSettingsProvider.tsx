/**
 * Adapted from @youchaoyun/plugin-login-settings (https://github.com/youchaoyun/nocobase-login-settings),
 * Copyright 有巢数智 (youchaoyun), licensed AGPL-3.0. Modified by Masu Phan since 2026-07-27 for
 * NocoBase 2.x (@nocobase/client) with typed request/response shapes.
 * This file remains licensed under AGPL-3.0 — see LICENSE.
 */
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