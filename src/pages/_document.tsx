import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className="bg-gradient-to-b from-[#D6DBDC] to-white dark:from-gray-800 dark:to-gray-700">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
