export default function Layout({ children }: any) {
  return (
    <>
      <div className="flex justify-center items-start">
        <main className="main">{children}</main>
      </div>
    </>
  );
}
