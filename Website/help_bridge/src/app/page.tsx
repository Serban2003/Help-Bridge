import styles from "./page.module.css";
import MainNavbar from "./components/MainNavbar";

import 'bootstrap/dist/css/bootstrap.min.css';

export default function Home() {
  return (
    <div className={styles.page}>
      <MainNavbar />
      <main className={styles.main}>
      </main>
    </div>
  );
}
