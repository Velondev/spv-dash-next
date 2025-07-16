// pages/_app.tsx
import '../styles/globals.css' // <-- DAS ist wichtig

import type { AppProps } from 'next/app'

export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
