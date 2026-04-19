# @lazycaptcha/react

> React component for [LazyCaptcha](https://github.com/yourusername/lazycaptcha) — privacy-friendly CAPTCHA with four challenge types.

[![npm](https://img.shields.io/npm/v/@lazycaptcha/react.svg)](https://www.npmjs.com/package/@lazycaptcha/react)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Installation

```bash
npm install @lazycaptcha/react
# or
pnpm add @lazycaptcha/react
# or
yarn add @lazycaptcha/react
```

## Usage

### Basic

```tsx
import { LazyCaptcha } from '@lazycaptcha/react';

function ContactForm() {
  const [token, setToken] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Hello', 'lazycaptcha-token': token }),
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea name="message" required />

      <LazyCaptcha
        sitekey="YOUR_SITE_KEY"
        onVerify={setToken}
        onExpire={() => setToken(null)}
      />

      <button type="submit" disabled={!token}>Send</button>
    </form>
  );
}
```

### With the convenience hook

```tsx
import { LazyCaptcha, useLazyCaptcha } from '@lazycaptcha/react';

function ContactForm() {
  const { captchaRef, token, onVerify, onExpire, reset } = useLazyCaptcha();

  return (
    <form onSubmit={(e) => { e.preventDefault(); submit(token); reset(); }}>
      <LazyCaptcha
        ref={captchaRef}
        sitekey="YOUR_SITE_KEY"
        onVerify={onVerify}
        onExpire={onExpire}
      />
      <button disabled={!token}>Send</button>
    </form>
  );
}
```

### Self-hosted LazyCaptcha instance

```tsx
<LazyCaptcha
  sitekey="YOUR_SITE_KEY"
  baseUrl="https://captcha.yourdomain.com"
  onVerify={(token) => console.log(token)}
/>
```

### Dark theme / specific challenge type

```tsx
<LazyCaptcha
  sitekey="YOUR_SITE_KEY"
  type="image_puzzle"     // 'auto' | 'image_puzzle' | 'pow' | 'behavioral' | 'text_math' | 'press_hold' | 'rotate_align'
  theme="dark"            // 'light' | 'dark' | 'auto'
  onVerify={setToken}
/>
```

### Imperative reset

```tsx
import { useRef } from 'react';
import { LazyCaptcha, LazyCaptchaHandle } from '@lazycaptcha/react';

function Form() {
  const captchaRef = useRef<LazyCaptchaHandle>(null);

  const handleFailedSubmit = () => {
    // Force a new challenge after a failed server-side verification
    captchaRef.current?.reset();
  };

  return <LazyCaptcha ref={captchaRef} sitekey="..." onVerify={...} />;
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `sitekey` | `string` | — | **Required.** Your public site key. |
| `type` | `ChallengeType` | `'auto'` | Challenge type: `auto`, `image_puzzle`, `pow`, `behavioral`, `text_math`, `press_hold`, `rotate_align`. |
| `theme` | `'light' \| 'dark' \| 'auto'` | `'light'` | Widget theme. `'auto'` follows the host page's dark-mode class/attribute and the OS `prefers-color-scheme`. |
| `baseUrl` | `string` | `'https://lazycaptcha.com'` | Your LazyCaptcha instance URL. |
| `onVerify` | `(token: string) => void` | — | Called with the verification token. |
| `onExpire` | `() => void` | — | Called when the challenge expires. |
| `onError` | `(err: Error) => void` | — | Called on errors. |
| `className` | `string` | — | Forwarded to the wrapper `<div>`. |
| `style` | `React.CSSProperties` | — | Forwarded to the wrapper. |

## Ref API

```ts
interface LazyCaptchaHandle {
  reset: () => void;
  getToken: () => string | null;
}
```

## Server-side verification

After receiving the token, verify it from your backend:

```js
const res = await fetch('https://lazycaptcha.com/api/captcha/v1/verify', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    secret: process.env.LAZYCAPTCHA_SECRET,
    token,
    remote_ip: clientIp,
  }),
});
const { success, score } = await res.json();
```

## SSR / Next.js

The component mounts the widget in a browser-only `useEffect`, so it's safe to import in server-rendered apps. Nothing happens on the server — the widget only loads when it hits the client.

## License

[MIT](LICENSE)
