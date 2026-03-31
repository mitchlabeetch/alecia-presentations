// Type declarations for styled-jsx

declare module "styled-jsx" {
  import { CSSProperties, HTMLAttributes } from "react";

  export interface StyleProps extends HTMLAttributes<HTMLStyleElement> {
    jsx?: true;
    global?: true;
    children?: string;
  }

  const styledJsx: any;
  export default styledJsx;
}

declare namespace JSX {
  interface IntrinsicElements {
    style: {
      jsx?: true;
      global?: true;
      children?: string;
      className?: string;
      dangerouslySetInnerHTML?: { __html: string };
      [key: string]: unknown;
    };
  }
}
