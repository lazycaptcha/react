const DEFAULT_BASE_URL = 'https://lazycaptcha.com';

type LoaderState = {
  promise: Promise<void> | null;
  loadedFrom: string | null;
};

const state: LoaderState = { promise: null, loadedFrom: null };

export function loadLazyCaptchaScript(baseUrl = DEFAULT_BASE_URL): Promise<void> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('LazyCaptcha can only be loaded in a browser environment.'));
  }

  const normalizedBase = baseUrl.replace(/\/+$/, '');
  const scriptUrl = `${normalizedBase}/api/captcha/v1/lazycaptcha.js`;

  if (window.LazyCaptcha && state.loadedFrom === normalizedBase) {
    return Promise.resolve();
  }

  if (state.promise && state.loadedFrom === normalizedBase) {
    return state.promise;
  }

  state.loadedFrom = normalizedBase;
  state.promise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${scriptUrl}"]`
    );
    if (existing) {
      if (window.LazyCaptcha) {
        resolve();
        return;
      }
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error(`Failed to load ${scriptUrl}`)));
      return;
    }

    const script = document.createElement('script');
    script.src = scriptUrl;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load ${scriptUrl}`));
    document.head.appendChild(script);
  });

  return state.promise;
}

export function resetLoader(): void {
  state.promise = null;
  state.loadedFrom = null;
}
