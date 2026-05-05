export type ChallengeType = 'auto' | 'image_puzzle' | 'pow' | 'behavioral' | 'text_math' | 'press_hold' | 'rotate_align';

export type Theme = 'light' | 'dark' | 'auto';
export type WidgetPreset = 'standard' | 'compact' | 'newsletter' | 'login';
export type WidgetWidth = number | string;

export interface LazyCaptchaProps {
  /** Your public site key from the LazyCaptcha dashboard. */
  sitekey: string;
  /** Challenge type. Defaults to 'auto'. */
  type?: ChallengeType;
  /** Widget theme. */
  theme?: Theme;
  /** Widget preset. Use `newsletter` for the intentionally skinny newsletter layout. */
  widget?: WidgetPreset;
  /** Optional width override. The hosted widget caps widths at 500px. */
  width?: WidgetWidth;
  /** Base URL of your LazyCaptcha instance. Defaults to 'https://lazycaptcha.com'. */
  baseUrl?: string;
  /** Called with the verification token when the user completes the challenge flow. */
  onVerify?: (token: string) => void;
  /** Called when the challenge expires (token no longer valid). */
  onExpire?: () => void;
  /** Called when an error occurs. */
  onError?: (err: Error) => void;
  /** Optional className forwarded to the outer wrapper. */
  className?: string;
  /** Optional inline styles. */
  style?: React.CSSProperties;
}

export interface LazyCaptchaHandle {
  /** Reset the widget and fetch a new challenge. */
  reset: () => void;
  /** Get the current verification token, if any. */
  getToken: () => string | null;
}

/** Shape of the global window.LazyCaptcha object injected by the widget script. */
export interface LazyCaptchaGlobal {
  render: (
    target: string | HTMLElement,
    options: {
      sitekey: string;
      type?: ChallengeType;
      theme?: Theme;
      widget?: WidgetPreset;
      width?: WidgetWidth;
      callback?: (token: string) => void;
      'expired-callback'?: () => void;
      'error-callback'?: (err: unknown) => void;
    }
  ) => unknown;
  reset: (target: string | HTMLElement) => void;
  getToken: (target: string | HTMLElement) => string | null;
}

declare global {
  interface Window {
    LazyCaptcha?: LazyCaptchaGlobal;
  }
}
