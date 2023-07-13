import 'bootstrap/dist/css/bootstrap.min.css';
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { Inter } from 'next/font/google'
import Head from 'next/head'
import { Container } from 'react-bootstrap'
import styles from '@/styles/App.module.css'
const inter = Inter({ subsets: ['latin'] })
export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={inter.className}>
      <Head>
        <title key='title'>Sehop</title>
        <meta  name='desccription' key='description' content='Hello'/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      </Head>
      <Container className={styles.pageContainer}>
        <Component {...pageProps} />
      </Container>
       
    </div>
  )
}
