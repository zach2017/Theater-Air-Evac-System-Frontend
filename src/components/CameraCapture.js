import React, { useState, useRef, useEffect } from 'react';
import { Camera, Download, RotateCcw, Save, Trash2, List, X } from 'lucide-react';

const IMAGE_STORE = 'Saved_Images_'
const CameraCapture = (props) => {
  const [capturedImage, setCapturedImage] = useState(null);
  const [savedImages, setSavedImages] = useState([]);
  const [showGallery, setShowGallery] = useState(true);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [isStreamActive, setIsStreamActive] = useState(false);

  const currentDodId = props.dodid
  // Load saved images from localStorage on component mount
  useEffect(() => {
      const stored = localStorage.getItem('savedImages-' + currentDodId);
      if (stored) {
        setSavedImages(JSON.parse(stored));
      }
  }, [currentDodId]);

  // Cleanup camera stream when component unmounts
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      videoRef.current.srcObject = stream;
      streamRef.current = stream;
      setIsStreamActive(true);
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      setIsStreamActive(false);
    }
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    const imageDataUrl = canvas.toDataURL('image/jpeg');
    setCapturedImage(imageDataUrl);
    stopCamera();
  };

  const saveToLocalStorage = (dodid) => {
    if (capturedImage) {
      const timestamp = new Date().toISOString();
      const newImage = {
        id: timestamp,
        imgData: capturedImage,
        timestamp,
        dodid: props.dodid
      };

      const updatedImages = [...savedImages, newImage];
      setSavedImages(updatedImages);
      localStorage.setItem(IMAGE_STORE+ props.dodid, JSON.stringify(updatedImages));

      setCapturedImage(null);
      startCamera();
    }
  };

  const downloadPhoto = (imageData, timestamp) => {
    const link = document.createElement('a');
    link.href = imageData;
    link.download = `photo-${timestamp}.jpg`;
    link.click();
  };

  const deleteFromStorage = (id) => {
    const updatedImages = savedImages.filter(img => img.id !== id);
    setSavedImages(updatedImages);
    localStorage.setItem(IMAGE_STORE + props.dodid, JSON.stringify(updatedImages));
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    startCamera();
  };


  /*const ImageResize = () => {
    const [isLarge, setIsLarge] = useState(false);
  
    const toggleSize = () => {
      setIsLarge(!isLarge);
    };
  }*/
  
  if (showGallery) {

    
    return (
      <div>
      {/* Thumbnail Grid */}
      <div>

          <h2 className="text-xl font-bold">Saved Photos</h2>
          <button
            onClick={() => setShowGallery(false)}
  
          >
            Back to Camera
          </button>
        </div>
    
          {savedImages.map((img) => (
            <div key={img.id} className="relative">
              <img
                src={img.imgData}
                style={{ height: '150px' }}
                alt={`Captured on ${new Date(img.timestamp).toLocaleString()}`}
              />
              <div>
                <button
                  onClick={() => downloadPhoto(img.data, img.timestamp)}
                >
                  <Download size={16} />
                </button>
                <button
                  onClick={() => deleteFromStorage(img.id)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 p-4 max-w-md mx-auto">
      <div className="w-full flex justify-between items-center">
        <h2 className="text-xl font-bold">Camera</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowGallery(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          >
            <List size={20} />
            Gallery ({savedImages.length})
          </button>
          {isStreamActive && (
            <button
              onClick={stopCamera}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              <X size={20} />
              Close Camera
            </button>
          )}
        </div>
      </div>

      {capturedImage ? (
        <div className="w-full">
          <img
            src={capturedImage}
            alt="Captured"
            className="w-full h-auto rounded-lg shadow-lg"
          />
          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={saveToLocalStorage(props.dodid)}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              <Save size={20} />
              Save to Gallery
            </button>
            <button
              onClick={retakePhoto}
              className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              <RotateCcw size={20} />
              Retake
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-auto rounded-lg shadow-lg"
          />
          <div className="flex justify-center mt-4">
            {!isStreamActive ? (
              <button
                onClick={startCamera}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                <Camera size={20} />
                Start Camera -
              </button>
            ) : (
              <button
                onClick={capturePhoto}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                <Camera size={20} />
                Take Photo
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CameraCapture;