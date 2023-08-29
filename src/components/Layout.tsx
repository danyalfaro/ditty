import TopBar from "./TopBar";

export default function Layout({ children }: any) {
  return (
    <div className="h-screen flex flex-col">
      <TopBar />
      <div className="flex justify-center items-start flex-grow max-h-full">
        <main className="flex flex-col justify-between items-center mx-8 py-8 h-full w-full max-w-main min-w-main text-slate-700 dark:text-slate-300">
          {children}
        </main>
      </div>
    </div>
  );
}
