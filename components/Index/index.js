import { useState, useEffect } from 'react';
import styles from '../../styles/Pages.module.css';
import { UploadButton } from '@bytescale/upload-widget-react';
import { Uploader } from "uploader";
import { useRouter } from 'next/router';
import DownloadButton from '../../components/DownloadButton';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const uploader = Uploader({
  apiKey: process.env.NEXT_PUBLIC_UPLOAD_API_TOKEN
    ? process.env.NEXT_PUBLIC_UPLOAD_API_TOKEN : "free",});

const options = { apiKey: "free",   maxFileCount: 1};

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
  const router = useRouter();
  useEffect(() => {
    // Function to retrieve API token from localStorage
    const getTokenFromStorage = () => {
      const token = localStorage.getItem('apiToken');
      if (token) {
        setApiToken(token); // Set the apiToken state if it exists in localStorage
      }
    };
  
    getTokenFromStorage(); // Call the function when component mounts
  
  }, []);

  const handleUploadComplete = async (imageUrl) => {
    const start = Date.now();
    setTimeOfRequest(undefined);
 
    setUploading(false);
    console.log(apiToken);
    const response = await fetch("https://mama-api.vercel.app/api/predictions/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({apiToken: apiToken, 
        imageUrl: imageUrl }),
    });
    let result = await response.json();
    if (response.status !== 200) {
      setError(result.message);
      setLoading(false);
      return;
    }
    setLoading(true);
    setResult(result);

    while (result?.prediction?.status !== "succeeded" ) {
       await sleep(10000);
      const response = await fetch("https://mama-api.vercel.app/api/predictions/" + result.prediction.id, {
        method: "POST", // Change to POST to send data in body
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          apiToken: apiToken,
        }),
      });
      result = await response.json();

      setResult(result);
    }
    if (result?.prediction?.status === "failed") {
      setError("error occured");
    }

    if (result?.prediction?.status === "succeeded" || result?.prediction?.status === "failed") {
      setLoading(false);
    }

    const end = Date.now();
    setTimeOfRequest((end - start) / 1000);
    setResult(result); // Set the processed image URL in state
    setLoading(false);
   
  };
  const handleRatingClick = (rating) => {
    setShowRatingWidget(false); // Hide widget after user clicks
    if (rating >= 4) {
      window.open("https://www.google.com", "_blank");
    } else {
      window.open("https://www.youtube.com/hashtag/funnyvideo", "_blank");
    }
  };

  const handleTokenSave = (token) => {
    setShowTokenModal(false); // Close token modal after saving
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
      {!result && <h1 className={styles.title}>Background Remover</h1>}
        {!result && (
          <p className={styles.description}>
            AI-powered tool to remove the background from any image!
          </p>
        )}
        {!result && (
          <div className={styles.steps}>
            <p className={styles.step}>1. Insert your Replicate API Token by clicking ⚙️.</p>
            <p className={styles.step}>2. Click the "Click to remove" button to upload an image.</p>
            <p className={styles.step}>3. Confirm the upload and wait for the result.</p>
          </div>
        )}
          {!result && ( 
        <UploadButton 
          uploader={uploader} 
          options={options} 
          onComplete={(file) => {
            if (file.length !== 0) {
              setPhotoName(file[0].originalFile.originalFileName);
              setOriginalPhoto(
                file[0].fileUrl.replace("raw", "thumbnail")
              );
              handleUploadComplete(file[0].fileUrl.replace("raw", "thumbnail"));
            }
          }}
        >
          {({ onClick }) => (
            <button 
              className={styles.uploadButton} 
              onClick={onClick} 
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "click to remove"}
            </button>
          )}
        </UploadButton>)}
  {/* Loading indicator */}
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
       <button className={styles.fullScreenButton} onClick={() => window.open(result?.prediction?.output, '_blank')}>
         View Full Screen
       </button>
       <DownloadButton imageUrl={result?.prediction?.output} />
     </div>
   )}
   {/* Rate Us Section */}
   {showRatingWidget && !result && (
        <div className={styles.rateUs}>
          <h2 className={styles.rateUsTitle}>Rate Us:</h2>
          <div className={styles.stars}>
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                onClick={() => handleRatingClick(star)}
                className={styles.star}
              >
                ⭐️
              </span>
            ))}
          </div>
        </div>
      )}
      </main>
    </div>


  );
}

export default Index;
