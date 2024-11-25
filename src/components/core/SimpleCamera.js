import React, { useState, useRef, useCallback } from 'react';
import { Camera, Loader, ImageOff, RefreshCw } from 'lucide-react';
import { IMAGE_STORE } from '../../context/Constants'

const SimpleCamera = () => {
  const [stream, setStream] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const startCamera = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Request camera permissions with fallbacks
      const constraints = {
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        // Wait for video to be ready
        await new Promise((resolve) => {
          videoRef.current.onloadedmetadata = resolve;
        });
        
        // Ensure video is playing
        await videoRef.current.play();
      }

      setStream(mediaStream);
      setIsCapturing(true);
      setLoading(false);
    } catch (err) {
      console.error("Camera error:", err);
      setError("Failed to access camera. Please ensure you've granted camera permissions.");
      setLoading(false);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setIsCapturing(false);
    }
  }, [stream]);

  const takePicture = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      try {
        const canvas = canvasRef.current;
        const video = videoRef.current;
        
        // Match canvas size to video feed
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Draw the current video frame
        const context = canvas.getContext('2d');
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert to data URL
        const imageDataURL = canvas.toDataURL('image/jpeg', 0.8);
        setCapturedImage(imageDataURL);
        localStorage.setItem(IMAGE_STORE + "dodid", JSON.stringify(updatedImages));
        // Stop the camera
        stopCamera();
      } catch (err) {
        console.error("Error capturing image:", err);
        setError("Failed to capture image. Please try again.");
      }
    }
  }, [stopCamera]);

  const retake = useCallback(() => {
    setCapturedImage(null);
    setError(null);
    startCamera();
  }, [startCamera]);

  const downloadImage = useCallback(() => {
    if (capturedImage) {
      const link = document.createElement('a');
      link.href = capturedImage;
      link.download = `photo-${new Date().toISOString()}.jpg`;
      link.click();
    }
  }, [capturedImage]);

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  return (
    <div className="flex flex-col items-center space-y-4 w-full max-w-md mx-auto p-4">
      {/* Camera/Image Display */}
      <div className="relative w-full aspect-[4/3] bg-gray-900 rounded-lg overflow-hidden">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader className="w-8 h-8 text-white animate-spin" />
          </div>
        ) : isCapturing ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
        ) : capturedImage ? (
          <img
            src={capturedImage}
            alt="Captured"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-gray-800">
            <ImageOff className="w-16 h-16 text-gray-400" />
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="w-full p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Hidden canvas for image processing */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Controls */}
      <div className="flex justify-center space-x-4">
        {!isCapturing && !capturedImage && !loading && (
          <button
            onClick={startCamera}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center space-x-2 disabled:opacity-50"
            disabled={loading}
          >
            <Camera className="w-5 h-5" />
            <span>Start Camera</span>
          </button>
        )}

        {isCapturing && (
          <button
            onClick={takePicture}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
            disabled={loading}
          >
            Take Picture
          </button>
        )}

        {capturedImage && (
          <>
            <button
              onClick={retake}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 flex items-center space-x-2"
            >
              <RefreshCw className="w-5 h-5" />
              <span>Retake</span>
            </button>
            <button
              onClick={downloadImage}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              Download
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default SimpleCamera;