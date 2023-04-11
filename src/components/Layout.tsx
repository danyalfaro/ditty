import TopBar from "./TopBar";

export default function Layout({ children, showTopBar = true }: any) {
  return (
    <>
      {showTopBar && <TopBar />}
      <div className="flex justify-center items-start">
        <main className="main">{children}</main>
      </div>
    </>
  );
}
