/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_GOOGLE_DRIVE_API_KEY: string
  readonly VITE_IMGUR_CLIENT_ID: string
  readonly VITE_IMGUR_API_KEY: string
  readonly VITE_IMGUR_ALBUM_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
