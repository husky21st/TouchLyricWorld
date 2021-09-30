import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document';

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html lang="ja">
        <Head>
          <meta charSet="UTF-8" />
          <link rel="icon" href="/flower.ico" />
          <meta name="theme-color" content="#039393" />
          <meta httpEquiv="Pragma" content="no-cache" />
          <meta httpEquiv="Cache-Control" content="no-store" />
          <meta httpEquiv="Expires" content="0" />
          <link
            href="https://fonts.googleapis.com/css2?family=RocknRoll+One&display=swap"
            rel="stylesheet"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
          <script></script>
        </body>
      </Html>
    );
  }
}

export default MyDocument;
