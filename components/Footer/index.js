import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <a
        href="#"
      >
        Background Remover V.1.0.0
        <span className={styles.logo}>
          <img
            src="icons/icon16.png"
            alt="Logo"
            width={16}
            height={16}
          />
        </span>
      </a>
    </footer>
  );
}
