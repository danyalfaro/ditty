import TopBar from "./TopBar";

export default function Layout({
  children,
  showTopBar = true,
  showTitle = true,
}: any) {
  return (
    <div className="h-screen-dvh flex flex-col bg-[url('../assets/bg-light.svg')] dark:bg-[url('../assets/bg-dark.svg')] bg-no-repeat bg-cover">
      {showTopBar && <TopBar showTitle={showTitle} />}
      <div className="flex justify-center items-start flex-grow max-h-full">
        <main className="flex flex-col justify-between items-center mx-8 py-8 h-full w-full max-w-main min-w-main text-slate-700 dark:text-slate-300">
          {children}
        </main>
      </div>
    </div>
  );
}
