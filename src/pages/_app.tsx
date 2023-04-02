import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import {useEffect, useState} from 'react';

export default function App({ Component, pageProps }: AppProps) {
  const [isServer, setIsServer] = useState(true);
  useEffect(() => {
    setIsServer(false);
  }, []);
  if (isServer) return null;

  return (
    <div suppressHydrationWarning>
      {typeof window === 'undefined' ? null : <Component {...pageProps} />}
    </div>
  );
}
