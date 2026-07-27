declare module '@nocobase/client-v2' {
  import { ComponentType } from 'react';
  export class Plugin {
    router: { add: (name: string, config: any) => void };
    pluginSettingsManager: {
      addMenuItem: (config: any) => void;
      addPageTabItem: (config: any) => void;
    };
    app: {
      providers: any[];
      addComponents: (components: Record<string, any>) => void;
    };
    t: (key: string) => string;
    async afterAdd(): Promise<void>;
    async beforeLoad(): Promise<void>;
    async load(): Promise<void>;
  }
  export function useRequest(fn: any, options?: any): any;
  export function useAPIClient(): any;
  export function useSystemSettings(): { data: any };
  export function useDocumentTitle(): { setTitle: (title: string) => void };
  export function useToken(): { token: any };
  export function ReadPretty(props?: any): any;
  export function SwitchLanguage(props?: any): any;
  export function SchemaComponent(props: any): any;
  export function useActionContext(): { setVisible: (v: boolean) => void; visible: boolean };
  export const lazy: any;
  export { default } from '@nocobase/client';
}
