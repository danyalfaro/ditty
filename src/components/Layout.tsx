import TopBar from "./TopBar";

export default function Layout({ children, showTopBar = true }: any) {
  return (
    <div className="h-screen flex flex-col">
      {showTopBar && <TopBar />}
      <div className="flex justify-center items-start flex-grow">
        <main className="flex flex-col justify-between items-center p-8 h-full w-full max-w-main">
          {children}
        </main>
      </div>
    </div>
  );
}
