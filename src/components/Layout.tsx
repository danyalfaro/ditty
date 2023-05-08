import TopBar from "./TopBar";

export default function Layout({ children, showTopBar = true }: any) {
  return (
    <div className="h-screen flex flex-col">
      {showTopBar && <TopBar />}
      <div className="flex justify-center items-start flex-grow max-h-full">
        <main className="flex flex-col justify-between items-center mx-8 py-8 h-full w-full max-w-main min-w-main">
          {children}
        </main>
      </div>
    </div>
  );
}
