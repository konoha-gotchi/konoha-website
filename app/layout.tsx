
import "./globals.css";
import styles from "./page.module.css"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body >
        {children}
        <section className={styles.emptyBox}></section>
      </body>
    </html>
  );
}
