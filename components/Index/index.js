import { useState, useEffect, useRef } from 'react';
import styles from '../../styles/Pages.module.css';
import DownloadButton from '../../components/DownloadButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const MAX_FILE_SIZE_MB = 64;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

const Index = ({ navigateToPage }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [photoName, setPhotoName] = useState(null);
  const [originalPhoto, setOriginalPhoto] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [timeOfRequest, setTimeOfRequest] = useState(undefined);
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [showRatingWidget, setShowRatingWidget] = useState(true);
  const [apiToken, setApiToken] = useState('');
  const [rating, setRating] = useState(0);
  const [ratingClicked, setRatingClicked] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(null);

  const fileInputRef = useRef(null);

  useEffect(() => {
    const getTokenFromStorage = () => {
      const token = localStorage.getItem('apiToken');
      if (token) {
        setApiToken(token);
      }
    };

    getTokenFromStorage();
  }, []);

  useEffect(() => {
    const getRatingClickedFromStorage = () => {
      chrome.storage.sync.get(['ratingClicked'], (result) => {
        if (result.ratingClicked) {
          setRatingClicked(result.ratingClicked);
          setShowRatingWidget(false);
        }
      });
    };

    getRatingClickedFromStorage();
  }, []);

  const handleUploadComplete = async (imageUrl) => {
    const start = Date.now();
    setTimeOfRequest(undefined);
    setUploading(false);

    const body = apiToken ? { apiToken: apiToken, imageUrl: imageUrl } : { imageUrl: imageUrl };

    const response = await fetch('https://mama-api.vercel.app/api/predictions/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    let result = await response.json();
    if (response.status !== 200) {
      setError(result.message);
      setLoading(false);
      return;
    }

    setLoading(true);
    setResult(result);

    while (result?.prediction?.status !== 'succeeded') {
      await sleep(10000);

      const body = apiToken ? { apiToken: apiToken } : {};

      const response = await fetch('https://mama-api.vercel.app/api/predictions/' + result.prediction.id, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      result = await response.json();
      setResult(result);
    }

    if (result?.prediction?.status === 'failed') {
      setError('An error occurred');
    }

    if (result?.prediction?.status === 'succeeded' || result?.prediction?.status === 'failed') {
      setLoading(false);
    }

    const end = Date.now();
    setTimeOfRequest((end - start) / 1000);
    setResult(result);
    setLoading(false);
  };

  const handleFileUpload = async (file) => {
    if (!file.type.startsWith('image/')) {
      setError('Only image files are allowed.');
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setError(`File size exceeds ${MAX_FILE_SIZE_MB}MB.`);
      return;
    }

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('https://mama-api.vercel.app/api/image', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.imageUrl) {
        setPhotoName(file.name);
        setOriginalPhoto(data.imageUrl);
        handleUploadComplete(data.imageUrl);
      } else {
        setError('Failed to upload image.');
        setUploading(false);
      }
    } catch (error) {
      setError('Failed to upload image.');
      setUploading(false);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleRatingClick = (clickedRating) => {
    setRating(clickedRating);
    setRatingClicked(true);
    setShowRatingWidget(false);

    chrome.storage.sync.set({ ratingClicked: true }, () => {});

    if (clickedRating >= 4) {
      chrome.tabs.create({ url: 'https://www.google.com' });
    } else {
      chrome.tabs.create({ url: 'https://www.youtube.com/hashtag/funnyvideo' });
    }
  };

  const handleUploadMore = () => {
    setResult(null);
    setPhotoName(null);
    setOriginalPhoto(null);
    setError(null);
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        {!result && <h1 className={styles.title}>Background Remover</h1>}
        {!result && (
          <p className={styles.description}>AI-powered tool to remove the background from any image!</p>
        )}
        {!result && (
          <div className={styles.steps}>
            <p className={styles.step}>1. Insert your Replicate API Token by clicking ⚙️.</p>
            <p className={styles.step}>2. Upload Image and wait for the result.</p>
          </div>
        )}
        {!result && (
          <div
            className={styles.dropArea}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current.click()}
          >
            <button className={styles.uploadButton} disabled={uploading}>
              {uploading ? 'Uploading...' : 'Upload Image'}
            </button>
            <p className={styles.uploadP}>Drag & drop an image here, or click to select one</p>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              accept="image/*"
              onChange={(e) => handleFileUpload(e.target.files[0])}
            />
          </div>
        )}
        {loading && (
          <div className={styles.loadingOverlay}>
            <div className={styles.spinner}></div>
          </div>
        )}
        {error && <div className={styles.error}>{error}</div>}
        {result?.prediction?.output && (
          <div className={styles.resultContainer}>
            <h2 className={styles.resultTitle}>Result:</h2>
            <img src={result?.prediction?.output} alt="Background Removed" className={styles.resultImage} />
            <button
              className={styles.fullScreenButton}
              onClick={() => chrome.tabs.create({ url: result?.prediction?.output })}
            >
              View Full Screen
            </button>
            <DownloadButton imageUrl={result?.prediction?.output} />
            <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current.click()}
          >
            <button className={styles.uploadButton2} disabled={uploading}>
              {uploading ? 'Uploading...' : 'Upload Image'}
            </button>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              accept="image/*"
              onChange={(e) => handleFileUpload(e.target.files[0])}
            />
          </div>

          </div>
        )}
        {!ratingClicked && !result && (
          <div className={styles.rateUs}>
            <h2 className={styles.rateUsTitle}>Rate Us:</h2>
            <div className={styles.stars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => handleRatingClick(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(null)}
                  className={`${styles.star} ${star > (hoveredRating) ? styles.active : ''}`}
                >
                  <FontAwesomeIcon icon={faStar} />
                </span>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
