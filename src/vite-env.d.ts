/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CONVEX_URL: string;
  readonly VITE_CONVEX_SITE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// styled-jsx JSX type declarations
declare namespace JSX {
  interface StyleHTMLAttributes<T> {
    jsx?: true;
    global?: true;
  }
}
