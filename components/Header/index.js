// Header.js
import { useState } from 'react';
import styles from './Header.module.css';

export default function Header() {
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [apiToken, setApiToken] = useState('');


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
