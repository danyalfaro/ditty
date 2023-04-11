import Head from "next/head";
import { useRouter } from "next/router";
import Spotify from "@/services/spotify";
import Layout from "@/components/Layout";

export default function Home() {
  const router = useRouter();
  const { code: spotifyTokenParam } = router.query;
  const spotify = new Spotify(spotifyTokenParam);

  const onSpotifyLogin = () => {
    const redirectURI: string | undefined =
      process.env.NEXT_PUBLIC_REDIRECT_TO_CREATE_GAME_URI;
    spotify.login(redirectURI);
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
        <div className="flex flex-col justify-between text-center h-max">
          <div className="text-6xl py-6">Ditty</div>
          <button
            className="bg-green-600 text-slate-100 p-4 border-solid rounded-md"
            onClick={onSpotifyLogin}
          >
            Create Game
          </button>
        </div>
      </Layout>
    </>
  );
}
