import { useState, useEffect } from 'react';
import styles from '../../styles/Pages.module.css';
import { UploadButton } from '@bytescale/upload-widget-react';
import { Uploader } from "uploader";
import { useRouter } from 'next/router';

const apiEndpoint = "https://api.replicate.com/v1/predictions";
const replicateApiToken = process.env.REPLICATE_API_TOKEN;
const replicateModelVersion = process.env.REPLICATE_MODEL_VERSION;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const uploader = Uploader({
  apiKey: process.env.NEXT_PUBLIC_UPLOAD_API_TOKEN
    ? process.env.NEXT_PUBLIC_UPLOAD_API_TOKEN
    : "free",
});

const options = {
  apiKey: "free", // Replace with your actual API key for @bytescale/upload-widget-react
  maxFileCount: 1
};

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
    // Retrieve API token from localStorage
    const token = localStorage.getItem('apiToken');
    setApiToken(token);
  
  }, []);

  const handleUploadComplete = async (imageUrl) => {
    console.log("file to be sent:", apiToken);
    const start = Date.now();
    setTimeOfRequest(undefined);
    setLoading(true);
    const response = await fetch("https://api.replicate.com/v1/predictions/api/remove", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({imageUrl }),
    });
    let result = await response.json();
    if (response.status !== 201) {
      setError(result.detail);
      setLoading(false);
      return;
    }
    setResult(result);

    while (result.status !== "succeeded" && result.status !== "failed") {
      // await sleep(1000);
      const response = await fetch("https://background-remover-chrome-extension.vercel.app/api/remove/" + result.id);
      result = await response.json();
      if (response.status !== 200) {
        setError(result.detail);
        setLoading(false);
        return;
      }

      setResult(result);
    }
    console.log("API Response:", result);
    if (result.status === "failed") {
      setError(true);
    }

    if (result.status === "succeeded" || result.status === "failed") {
      setLoading(false);
    }

    const end = Date.now();
    setTimeOfRequest((end - start) / 1000);
       // Save the result imageUrl to localStorage
       localStorage.setItem('resultImageUrl', result.output);

       // Navigate to the result page with the imageUrl as a query parameter
       router.push({
         pathname: '/New',
         query: { imageUrl: result.output },
       });
   
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
    // Logic to save token and handle API requests with this token
    console.log("Custom API Token:", token);
    setShowTokenModal(false); // Close token modal after saving
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Background Remover</h1>
        <p className={styles.description}>
            This is AI that removes the background any image for you!
          </p>
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
        </UploadButton>

    
        {error && <p className={styles.error}>{error}</p>}
        
   {/* Rate Us Section */}
   {showRatingWidget && (
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
