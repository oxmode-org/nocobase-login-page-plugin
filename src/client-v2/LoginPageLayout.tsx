import { Carousel, Space, Typography, theme } from 'antd';
import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { SwitchLanguage, useApp, PoweredBy, useSystemSettings } from '@nocobase/client-v2';
import { AuthenticatorsContextProvider } from '@nocobase/plugin-auth/client-v2';
import { BrandLogo } from '../shared/BrandLogo';
import { getPublicLoginMediaUrl } from '../shared/public-login-media';
import { defaultLoginSettings, normalizeLoginSettings, type Attachment, type LoginSettings } from './types';

const getResponseData = (response: any): LoginSettings | undefined => response?.data?.data;

const Background = ({ images }: { images: Attachment[] }) => {
  if (!images.length) {
    return <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #0f172a, #1d4ed8)' }} />;
  }

  return (
    <Carousel autoplay autoplaySpeed={5000} effect="fade" style={{ width: '100%', height: '100%' }}>
      {images.map((image) => {
        const imageUrl = getPublicLoginMediaUrl(image.id);
        if (!imageUrl) {
          return null;
        }

        return (
          <div key={image.id}>
            <div
              style={{
                width: '100%',
                height: '100vh',
                backgroundImage: `linear-gradient(rgba(15, 23, 42, .28), rgba(15, 23, 42, .5)), url(${imageUrl})`,
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
              }}
            />
          </div>
        );
      })}
    </Carousel>
  );
};

export const LoginPageLayout = () => {
  const app = useApp();
  const { token } = theme.useToken();
  const [settings, setSettings] = useState<LoginSettings>(defaultLoginSettings);
  const images = settings.backgroundImages || [];

  useEffect(() => {
    let active = true;

    app.apiClient
      .request({
        url: 'loginSettings:get/1?appends=backgroundImages',
        method: 'get',
        skipAuth: true,
        skipNotify: true,
      })
      .then((response) => {
        if (active) {
          setSettings(normalizeLoginSettings(getResponseData(response)));
        }
      })
      .catch(() => {
        // The login route must remain available when plugin settings are temporarily unavailable.
      });

    return () => {
      active = false;
    };
  }, [app]);

  const languageSwitcher = (
    <div style={{ color: token.colorTextSecondary }}>
      <SwitchLanguage />
    </div>
  );

  const footer = (
    <Space direction="vertical" size={2} style={{ width: '100%', textAlign: 'center' }}>
      {settings.technicalSupport ? <Typography.Text type="secondary">{settings.technicalSupport}</Typography.Text> : null}
      <PoweredBy />
    </Space>
  );

  const authentication = (
    <AuthenticatorsContextProvider>
      <Outlet />
    </AuthenticatorsContextProvider>
  );

  const systemSettings = useSystemSettings();
  const systemLogoId = systemSettings?.data?.data?.logo?.id ?? systemSettings?.data?.data?.logoId;
  const systemLogoUrl = getPublicLoginMediaUrl(systemLogoId);

  const formPanel = (card = false) => (
    <div
      style={{
        width: 'min(100%, 380px)',
        ...(card
          ? {
              background: token.colorBgContainer,
              borderRadius: token.borderRadiusLG,
              boxShadow: token.boxShadowSecondary,
              padding: token.paddingLG,
            }
          : {}),
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: token.marginLG }}>{languageSwitcher}</div>
      <BrandLogo logoUrl={systemLogoUrl} />
      {authentication}
      <div style={{ marginTop: token.marginXL }}>{footer}</div>
    </div>
  );

  if (settings.layout === 'left-right') {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', background: token.colorBgLayout }}>
        <div style={{ width: '55%', minHeight: '100vh', overflow: 'hidden' }}>
          <Background images={images} />
        </div>
        <main style={{ flex: 1, display: 'grid', placeItems: 'center', padding: token.paddingLG }}>{formPanel(false)}</main>
      </div>
    );
  }

  if (settings.layout === 'center') {
    return (
      <div style={{ position: 'relative', minHeight: '100vh', display: 'grid', placeItems: 'center', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <Background images={images} />
        </div>
        <main style={{ position: 'relative', zIndex: 1, padding: token.paddingLG }}>{formPanel(true)}</main>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', minHeight: '100vh', background: token.colorBgLayout, overflow: 'hidden' }}>
      {images.length ? (
        <div style={{ position: 'absolute', inset: 0, opacity: 0.18 }}>
          <Background images={images} />
        </div>
      ) : null}
      <main
        style={{
          position: 'relative',
          zIndex: 1,
          minHeight: '100vh',
          width: 'min(100%, 380px)',
          margin: '0 auto',
          padding: `${token.paddingLG}px ${token.paddingLG}px ${token.paddingXL * 3}px`,
        }}
      >
        {formPanel(false)}
      </main>
    </div>
  );
};

export default LoginPageLayout;
