// components/DownloadButton.js

import React from 'react';
import styles from '/styles/Pages.module.css'; // Adjust path as per your actual structure

const DownloadButton = ({ imageUrl }) => {
  const handleDownload = async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(new Blob([blob]));

      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'background_removed_image.png'); // Adjust filename as needed
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading image:', error);
      // Handle error as needed
    }
  };

  return (
    <button className={styles.downloadButton} onClick={handleDownload}>
      Download Result
    </button>
  );
};

export default DownloadButton;
