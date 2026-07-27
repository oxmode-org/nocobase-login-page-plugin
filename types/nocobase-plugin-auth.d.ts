declare module '@nocobase/plugin-auth/client' {
  import { createContext } from 'react';
  export const AuthenticatorsContext: ReturnType<typeof createContext>;
}
