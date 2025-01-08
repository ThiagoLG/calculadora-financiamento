import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Selecione a ferramenta que deseja</h1>
        <ul>
          <li>
            <Link href="/financiamento">Calculadora de juros compostos</Link>
          </li>
          <li>Calculadora de financiamento</li>
        </ul>
      </main>
      <footer className={styles.footer}>
        <span>Thiago Lourençon Ghebra</span>
      </footer>
    </div>
  );
}
