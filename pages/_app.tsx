import "@/styles/globals.css";
import PlausibleProvider from "next-plausible";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <PlausibleProvider domain="hasanabitv.com" trackOutboundLinks={true}>
      <Component {...pageProps} />
    </PlausibleProvider>
  );
}
