import { css } from '@emotion/css';
import { SwitchLanguage, useDocumentTitle, useSystemSettings, useToken } from '@nocobase/client';
import { Carousel } from 'antd';
import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { AuthenticatorsContextProvider } from '@nocobase/plugin-auth/client';
import { normalizeAttachmentArray } from '../shared/login-layout';
import { BrandLogo } from '../shared/BrandLogo';
import { useLoginSettings } from './LoginSettingsProvider';
import { PoweredBy } from './PoweredBy';


const contentStyle: React.CSSProperties = {
  height: '100vh',
  width: '100%',
  color: '#fff',
  textAlign: 'center',
};

const carouselWrapper = css`
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  z-index: -1;
  .ant-carousel {
    height: 100%;
  }
`;

const formWrapper = css`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 420px;
  transform: translate(-50%, -50%);
  padding: 30px 40px 70px 40px;
  border-radius: 20px;
  background: #ffffffb3;
  box-shadow:
    0 6px 16px 0 hsl(0 0% 0% / 0.05),
    0 3px 6px -4px hsl(0 0% 0% / 0.05),
    0 9px 28px 8px hsl(0 0% 0% / 0.05);
`;

const rightFormWrapper = css`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 420px;
  transform: translate(-50%, -50%);
  padding: 30px 40px 70px 40px;
  border-radius: 20px;
  @media (max-width: 1025px) {
    top: 40%;
  }
`;

const leftWrapper = css`
  width: 66%;
  height: 100%;
  @media (max-width: 1025px) {
    width: 100%;
    height: 40vh;
    .slick-slide img {
      height: 40vh !important;
    }
  }
`;

const rightWrapper = css`
  position: relative;
  width: 34%;
  height: 100%;
  @media (max-width: 1025px) {
    width: 100%;
    height: 60vh;
  }
`;

const leftCarouselWrapper = css`
  width: 100%;
  height: 100%;
  .ant-carousel {
    height: 100%;
  }
`;

export const AuthLayout = () => {
  const { data } = useSystemSettings() || {};
  const { data: loginSettingsData } = useLoginSettings();
  const { setTitle: setDocumentTitle } = useDocumentTitle();
  const { token } = useToken();

  useEffect(() => {
    setDocumentTitle(data?.data?.title);
  }, []);

  const layout = loginSettingsData?.data?.layout === 'leftRight' ? 'left-right' : loginSettingsData?.data?.layout;
  const backgroundImages = normalizeAttachmentArray<{ id: number; url: string }>(loginSettingsData?.data?.backgroundImages);

  if (layout === 'left-right') {
    return (
      <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
        <div className={leftWrapper}>
          <div className={leftCarouselWrapper}>
            <Carousel autoplay dots={false} style={{ height: '100%' }}>
              {backgroundImages.length > 0 ? (
                backgroundImages.map((img) => (
                  <div key={img.id} style={contentStyle}>
                    <img src={img.url} alt="background" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))
              ) : (
                <div style={{ ...contentStyle, background: token.colorBgLayout }} />
              )}
            </Carousel>
          </div>
        </div>
        <div className={rightWrapper}>
          <AuthenticatorsContextProvider>
            <div className={rightFormWrapper}>
              <BrandLogo />
              <Outlet />
              <PoweredBy />
              <div style={{ textAlign: 'center', marginTop: 10 }}>
                <SwitchLanguage />
              </div>
            </div>
          </AuthenticatorsContextProvider>
        </div>
      </div>
    );
  } else if (layout === 'center') {
    return (
      <div>
        <div className={carouselWrapper}>
          <Carousel autoplay dots={false} style={{ height: '100%' }}>
            {backgroundImages.map((img) => (
              <div key={img.id} style={contentStyle}>
                <img src={img.url} alt="background" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ))}
          </Carousel>
        </div>
        <div className={formWrapper}>
          <BrandLogo />
          <AuthenticatorsContextProvider>
            <Outlet />
            <PoweredBy />
            <div style={{ textAlign: 'center', marginTop: 10 }}>
              <SwitchLanguage />
            </div>
          </AuthenticatorsContextProvider>
        </div>
      </div>
    );
  }

  // Default layout
  return (
    <div>
      <div className={formWrapper}>
        <BrandLogo />
        <AuthenticatorsContextProvider>
          <Outlet />
          <PoweredBy />
          <div style={{ textAlign: 'center', marginTop: 10 }}>
            <SwitchLanguage />
          </div>
        </AuthenticatorsContextProvider>
      </div>
    </div>
  );
};
export default AuthLayout;
