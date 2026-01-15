interface ImportMetaEnv {
  [x: string]: any;
  readonly VERSION: string;
  readonly PORT: string;
  readonly NAME: string;
  readonly SERVERPORT: string;
  readonly SERVERNAME: string;
  readonly FSPORT: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
declare module "*.svg" {
  const content: string;
  export default content;
}
