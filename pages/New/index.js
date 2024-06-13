// pages/result.js

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import styles from '/styles/Pages.module.css';
import DownloadButton from '../../components/DownloadButton';

const Result = () => {
  const router = useRouter();
  const { imageUrl } = router.query;
  const [url, setUrl] = useState('');

  useEffect(() => {
    // Retrieve the imageUrl from the query parameter
    if (imageUrl) {
      setUrl(imageUrl);
    } else {
      // If no imageUrl in query, try to get from localStorage
      const savedUrl = localStorage.getItem('resultImageUrl');
      if (savedUrl) {
        setUrl(savedUrl);
      }
    }
  }, [imageUrl]);

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.ResultMaintitle}>Background Removed</h1>
        {url && (
          <div className={styles.resultContainer}>
            <h2 className={styles.resultTitle}>Result:</h2>
            <img src={url} alt="Background Removed" className={styles.resultImage} />
            <button className={styles.fullScreenButton} onClick={() => window.open(url, '_blank')}>
              View Full Screen
            </button>
            <DownloadButton imageUrl={url} />
          </div>
        )}
        {!url && <p className={styles.error}>No image available.</p>}
      </main>
    </div>
  );
};

export default Result;
