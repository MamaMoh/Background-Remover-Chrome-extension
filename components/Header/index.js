// Header.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import styles from './Header.module.css';

export default function Header() {
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [apiToken, setApiToken] = useState('');
  const router = useRouter();
  const currentPath = router.pathname;

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleTokenSave();
    }
  };

  const handleTokenSave = () => {
    localStorage.setItem('apiToken', apiToken);
    console.log("API Token saved:", apiToken);
    setShowTokenModal(false); // Close token modal after saving
  };

  const handleBackButtonClick = () => {
    if (currentPath === '/') {
      // Handle the "Close" action if on the first page
      setShowTokenModal(false);
    } else {
      // Redirect to the first page if not on the first page
      router.push('/');
    }
  };

  return (
    <>
      <div className={styles.header}>
        <span
          className={styles.settingsIcon}
          onClick={() => setShowTokenModal(true)}
          role="img"
          aria-label="Settings"
        >
          ⚙️
        </span>
        <button className={styles.backButton} onClick={handleBackButtonClick}>
          {currentPath === '/' ? 'Close' : 'Back'}
        </button>
      </div>

      {/* Token Modal */}
      <div className={`${styles.tokenModal} ${showTokenModal ? styles.active : ''}`}>
        <h2>Enter Your API Token</h2>
        <input
          type="text"
          placeholder="Enter API Token"
          className={styles.tokenInput}
          value={apiToken}
          onChange={(e) => setApiToken(e.target.value)}
          onKeyDown={handleKeyPress} 
        />
        <button className={styles.saveButton} onClick={handleTokenSave}>
          Save
        </button>
      </div>
    </>
  );
}
