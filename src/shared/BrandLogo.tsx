import React from 'react';
import oxmodeLogo from '../assets/oxmode-logo.jpg';

export const BrandLogo = () => (
  <img
    alt="OXMODE"
    src={oxmodeLogo}
    style={{
      display: 'block',
      width: 210,
      maxWidth: '100%',
      height: 'auto',
      margin: '0 auto 24px',
    }}
  />
);
