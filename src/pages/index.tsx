import type { NextPage } from "next";
import dynamic from "next/dynamic";
import Head from "next/Head";
import WebFontPreloading from "components/WebFontPreloading";

const MyCanvasWithNoSSR = dynamic(
  () => import("../components/MyCanvas"),
  { ssr: false }
)

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, minimum-scale=1.0,initial-scale=1" />
      </Head>
      <WebFontPreloading />
      <MyCanvasWithNoSSR />
    </>
  );
};

export default Home;