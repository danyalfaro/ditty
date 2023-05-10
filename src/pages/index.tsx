import Head from "next/head";
import { useRouter } from "next/router";
import Spotify from "@/services/spotify";
import Layout from "@/components/Layout";

export default function Home() {
  const router = useRouter();
  const { code: spotifyTokenParam } = router.query;
  const spotify = new Spotify({ spotifyTokenParam });

  const onSpotifyLogin = () => {
    const redirectURI: string | undefined =
      process.env.NEXT_PUBLIC_REDIRECT_TO_CREATE_GAME_URI;
    spotify.login(redirectURI);
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
            Start Game
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
