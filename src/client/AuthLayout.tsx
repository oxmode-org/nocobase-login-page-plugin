import { css } from '@emotion/css';
import { ReadPretty, SwitchLanguage, useAPIClient, useDocumentTitle, useRequest, useSystemSettings, useToken } from '@nocobase/client-v2';
import { Spin, Carousel } from 'antd';
import React, { FC, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { AuthenticatorsContext } from '@nocobase/plugin-auth/client';
import { useLoginSettings } from './LoginSettingsProvider';
import { PoweredBy } from './PoweredBy';

export const AuthenticatorsContextProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const api = useAPIClient();
  const { data: authenticators = [], error, loading } = useRequest(() =>
    api
      .resource('authenticators')
      .publicList()
      .then((res) => res?.data?.data || []),
  );

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin />
      </div>
    );
  }

  if (error) {
    throw error;
  }

  return <AuthenticatorsContext.Provider value={authenticators}>{children}</AuthenticatorsContext.Provider>;
};

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
  const { data: loginSettingsData } = useLoginSettings() || {};
  const { setTitle: setDocumentTitle } = useDocumentTitle();
  const { token } = useToken();

  useEffect(() => {
    setDocumentTitle(data?.data?.title);
  }, []);

  const titleFontSize = loginSettingsData?.data?.titleFontSize;
  const titleStyle = titleFontSize ? { fontSize: `${titleFontSize}px` } : undefined;

  if (loginSettingsData?.data?.layout === 'leftRight') {
    return (
      <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
        <div className={leftWrapper}>
          <div className={leftCarouselWrapper}>
            <Carousel autoplay dots={false} style={{ height: '100%' }}>
              {loginSettingsData?.data?.backgroundImages?.length > 0 ? (
                loginSettingsData?.data?.backgroundImages?.map((img: any) => (
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
              <h2 style={titleStyle}>{data?.data?.title}</h2>
              <Outlet />
              <div style={{ marginTop: 20 }}>
                <ReadPretty />
              </div>
              <PoweredBy />
              <div style={{ textAlign: 'center', marginTop: 10 }}>
                <SwitchLanguage />
              </div>
            </div>
          </AuthenticatorsContextProvider>
        </div>
      </div>
    );
  } else if (loginSettingsData?.data?.layout === 'center') {
    return (
      <div>
        <div className={carouselWrapper}>
          <Carousel autoplay dots={false} style={{ height: '100%' }}>
            {loginSettingsData?.data?.backgroundImages?.map((img: any) => (
              <div key={img.id} style={contentStyle}>
                <img src={img.url} alt="background" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ))}
          </Carousel>
        </div>
        <div className={formWrapper}>
          <h2 style={titleStyle}>{data?.data?.title}</h2>
          <AuthenticatorsContextProvider>
            <Outlet />
            <div style={{ marginTop: 20 }}>
              <ReadPretty />
            </div>
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
        <h2 style={titleStyle}>{data?.data?.title}</h2>
        <AuthenticatorsContextProvider>
          <Outlet />
          <div style={{ marginTop: 20 }}>
            <ReadPretty />
          </div>
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
