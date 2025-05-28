import 'bootstrap/dist/css/bootstrap.min.css';
import type { AppProps } from 'next/app';
import { PaymentProvider } from '../contexts/PaymentContext';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <PaymentProvider>
      <Component {...pageProps} />
    </PaymentProvider>
  );
}
