import Head from "next/head";
import Layout from "@/components/Layout";
import { login } from "@/services/useSpotify";

export default function Home() {
  const onSpotifyLogin = () => {
    const redirectURI: string | undefined =
      process.env.NEXT_PUBLIC_REDIRECT_TO_CHALLENGE_URI;
    login(redirectURI);
  };

  const onHowToPlay = () => {
    console.log("How to play...");
  };

  return (
    <>
      <Head>
        <title>Spotify Ranks</title>
        <meta name="description" content="Guess the top." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout showTopBar={false}>
        <div className="text-6xl py-6 w-full text-center">DITTY</div>
        <div className="w-full">
          <button
            type="button"
            onClick={onSpotifyLogin}
            className="bg-green-600 text-slate-100 p-4 border-solid rounded-md w-full"
          >
            Login With Spotify
          </button>
          <button
            className="text-slate-500 p-4 border-solid rounded-md w-full"
            onClick={onHowToPlay}
          >
            How to Play
          </button>
        </div>
      </Layout>
    </>
  );
}
