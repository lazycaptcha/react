import { useCallback, useRef, useState } from 'react';
import type { LazyCaptchaHandle } from './types';

/**
 * Convenience hook that provides a ref and current token state.
 *
 * @example
 * const { captchaRef, token, onVerify, onExpire, reset } = useLazyCaptcha();
 *
 * return (
 *   <form onSubmit={(e) => { e.preventDefault(); submit(token); }}>
 *     <LazyCaptcha
 *       ref={captchaRef}
 *       sitekey="..."
 *       onVerify={onVerify}
 *       onExpire={onExpire}
 *     />
 *     <button disabled={!token}>Submit</button>
 *   </form>
 * );
 */
export function useLazyCaptcha() {
  const captchaRef = useRef<LazyCaptchaHandle | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const onVerify = useCallback((t: string) => {
    setToken(t);
  }, []);

  const onExpire = useCallback(() => {
    setToken(null);
  }, []);

  const reset = useCallback(() => {
    captchaRef.current?.reset();
    setToken(null);
  }, []);

  return { captchaRef, token, onVerify, onExpire, reset };
}
