/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** labs-api local domain */
  readonly VITE_LABS_API_BASE_URL?: string
  /** labs-api path prefix */
  readonly VITE_LABS_API_PATH?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
