import type { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'
import theme from '../utils/theme'
import NavBar from '../components/NavBar'
import Footer from '../components/Footer'
import { SessionProvider } from "next-auth/react"
import React from 'react'

import 'react-responsive-carousel/lib/styles/carousel.min.css'

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <ChakraProvider theme={theme}>
        <NavBar />
        <Component {...pageProps} />
        <Footer />
      </ChakraProvider>
    </SessionProvider>
  )
}
