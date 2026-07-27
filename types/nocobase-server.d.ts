declare module '@nocobase/server' {
  export class Plugin {
    app: {
      acl: {
        registerSnippet: (config: any) => void;
        addFixedParams: (resource: string, action: string, fn: () => any) => void;
        allow: (resource: string, action: string, role: string) => void;
      };
      db: any;
    };
    db: {
      getRepository: (name: string) => any;
    };
    name: string;
    async importCollections(path: string): Promise<void>;
    async afterAdd(): Promise<void>;
    async beforeLoad(): Promise<void>;
    async load(): Promise<void>;
    async install(): Promise<void>;
    async afterEnable(): Promise<void>;
    async afterDisable(): Promise<void>;
    async remove(): Promise<void>;
  }
  export { default } from '@nocobase/server';
}
