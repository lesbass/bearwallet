import Document, { Head, Html, Main, NextScript } from 'next/document'
import React from 'react'

type Props = { env: string; lang: string }

class MyDocument extends Document<Props> {
  render() {
    return (
      <Html lang={'it'}>
        <Head>
          <meta charSet="utf-8" />
          <meta content="initial-scale=1, width=device-width" name="viewport" />
          <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" rel="stylesheet" />

          <link href="/apple-icon-57x57.png" rel="apple-touch-icon" sizes="57x57" />
          <link href="/apple-icon-60x60.png" rel="apple-touch-icon" sizes="60x60" />
          <link href="/apple-icon-72x72.png" rel="apple-touch-icon" sizes="72x72" />
          <link href="/apple-icon-76x76.png" rel="apple-touch-icon" sizes="76x76" />
          <link href="/apple-icon-114x114.png" rel="apple-touch-icon" sizes="114x114" />
          <link href="/apple-icon-120x120.png" rel="apple-touch-icon" sizes="120x120" />
          <link href="/apple-icon-144x144.png" rel="apple-touch-icon" sizes="144x144" />
          <link href="/apple-icon-152x152.png" rel="apple-touch-icon" sizes="152x152" />
          <link href="/apple-icon-180x180.png" rel="apple-touch-icon" sizes="180x180" />
          <link href="/android-icon-192x192.png" rel="icon" sizes="192x192" type="image/png" />
          <link href="/favicon-32x32.png" rel="icon" sizes="32x32" type="image/png" />
          <link href="/favicon-96x96.png" rel="icon" sizes="96x96" type="image/png" />
          <link href="/favicon-16x16.png" rel="icon" sizes="16x16" type="image/png" />
          <link href="/manifest.json" rel="manifest" />
          <meta content="#000000" name="msapplication-TileColor" />
          <meta content="/ms-icon-144x144.png" name="msapplication-TileImage" />
          <meta content="#000000" name="theme-color" />

          <meta content="width" name="MobileOptimized" />
          <meta content="true" name="HandheldFriendly" />

          <link href="/apple-icon-180x180.png" rel="apple-touch-startup-image" />
          <meta content="BearWallet" name="apple-mobile-web-app-title" />
          <meta content="yes" name="mobile-web-app-capable" />
          <meta content="yes" name="apple-mobile-web-app-capable" />
          <meta content="black" name="apple-mobile-web-app-status-bar-style" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
