import styles from "@/styles/Home.module.css";

export default function Layout({ children }: any) {
  return (
    <>
      <div className="flex justify-center items-start">
        <main className={styles.main}>{children}</main>
      </div>
    </>
  );
}
