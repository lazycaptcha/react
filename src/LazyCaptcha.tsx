import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { loadLazyCaptchaScript } from './loader';
import type { LazyCaptchaHandle, LazyCaptchaProps } from './types';

export const LazyCaptcha = forwardRef<LazyCaptchaHandle, LazyCaptchaProps>(function LazyCaptcha(
  {
    sitekey,
    type = 'auto',
    theme = 'light',
    baseUrl,
    onVerify,
    onExpire,
    onError,
    className,
    style,
  },
  ref
) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const tokenRef = useRef<string | null>(null);
  // Keep latest callbacks in refs so we don't tear down/rebuild the widget on every render
  const onVerifyRef = useRef(onVerify);
  const onExpireRef = useRef(onExpire);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    onVerifyRef.current = onVerify;
  }, [onVerify]);

  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);

  useEffect(() => {
    if (!sitekey) {
      console.error('[LazyCaptcha] Missing sitekey prop');
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;

    loadLazyCaptchaScript(baseUrl)
      .then(() => {
        if (cancelled || !window.LazyCaptcha || !containerRef.current) return;

        window.LazyCaptcha.render(containerRef.current, {
          sitekey,
          type,
          theme,
          callback: (token: string) => {
            tokenRef.current = token;
            onVerifyRef.current?.(token);
          },
          'expired-callback': () => {
            tokenRef.current = null;
            onExpireRef.current?.();
          },
          'error-callback': (err: unknown) => {
            const error = err instanceof Error ? err : new Error(String(err));
            onErrorRef.current?.(error);
          },
        });
      })
      .catch((err: Error) => {
        if (!cancelled) {
          onErrorRef.current?.(err);
        }
      });

    return () => {
      cancelled = true;
      // Clear the container; the widget's Shadow DOM content lives inside it
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [sitekey, type, theme, baseUrl]);

  useImperativeHandle(
    ref,
    () => ({
      reset: () => {
        tokenRef.current = null;
        if (window.LazyCaptcha && containerRef.current) {
          try {
            window.LazyCaptcha.reset(containerRef.current);
          } catch {
            // If reset isn't supported by the loaded widget, clear and re-init
            containerRef.current.innerHTML = '';
          }
        }
      },
      getToken: () => tokenRef.current,
    }),
    []
  );

  return <div ref={containerRef} className={className} style={style} />;
});
