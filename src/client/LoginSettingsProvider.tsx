import React, { createContext, ReactNode, useContext } from 'react';
import { useRequest } from '@nocobase/client-v2';

export const LoginSettingsContext = createContext<any>(null);
LoginSettingsContext.displayName = 'LoginSettingsContext';

export const useLoginSettings = () => {
  return useContext(LoginSettingsContext);
};

export const LoginSettingsProvider: React.FC<{ children?: ReactNode }> = (props) => {
  const result = useRequest({
    url: 'loginSettings:get/1?appends=backgroundImages',
  });

  return (
    <LoginSettingsContext.Provider value={result}>
      {props.children}
    </LoginSettingsContext.Provider>
  );
};