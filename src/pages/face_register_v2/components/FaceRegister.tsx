/* eslint-disable no-console */
// components/FaceRegister.tsx
import React, { useEffect, useRef, useState } from 'react';

import Button from '@/components/buttons/Button';

interface FaceRegisterProps {
  onVideoSubmit: (videoBlob: Blob) => void;
}

// eslint-disable-next-line unused-imports/no-unused-vars
const FaceRegister = ({ onVideoSubmit }: FaceRegisterProps) => {
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [orientation, setOrientation] = useState('front'); // 'front', 'left', 'right', 'up', 'down'
  const [isFinished, setIsFinished] = useState(false); // New state for finished status
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (isCameraOn) {
      navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      });
    }
  }, [isCameraOn]);

  useEffect(() => {
    if (isRecording) {
      // Start checking for face orientations every 3-5 seconds
      const orientationInterval = setInterval(() => {
        checkFaceOrientation();
      }, Math.floor(Math.random() * 3000) + 2000); // Random interval between 2-5 seconds

      return () => {
        // Clear the interval when the component unmounts or recording stops
        clearInterval(orientationInterval);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orientation, isRecording]);

  const startCamera = () => {
    setIsCameraOn(true);
  };

  const startRecording = () => {
    setIsRecording(true);
  };

  const checkFaceOrientation = async () => {
    // Simulate sending video frame to the API for face orientation check
    // In a real scenario, you would send the actual video frame
    const response = await fetch('/api/mock/faceRegister', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ orientation }),
    }).catch((error) => {
      console.error('Error fetching API:', error);
      throw error;
    });

    const data = await response.json();

    // Logic to determine the next orientation to check
    // and update UI with instructions for the user
    if (data[orientation]) {
      setSuccessMessage(`${orientation} face acquired`);
      setTimeout(() => setSuccessMessage(''), 1500); // Clear message after 1.5 seconds

      switch (orientation) {
        case 'front':
          setOrientation('left');
          break;
        case 'left':
          setOrientation('right');
          break;
        case 'right':
          setOrientation('up');
          break;
        case 'up':
          setOrientation('down');
          break;
        case 'down':
          // All orientations satisfied, stop recording
          setIsRecording(false);
          setIsCameraOn(false);
          setIsFinished(true); // Set finished status
          // Further logic to handle the recorded video
          break;
        default:
          break;
      }
    }
  };

  return (
    <div className='flex flex-col items-center gap-y-8'>
      {!isFinished && (
        <div
          className={`rounded-full ${
            successMessage
              ? 'border-4 border-green-500'
              : isRecording
              ? 'animate-pulse border-4 border-red-500'
              : ''
          }`}
        >
          <video
            ref={videoRef}
            width='384'
            height='384'
            className='rounded-full'
            autoPlay
          />
        </div>
      )}

      {!isCameraOn && !isFinished && (
        <Button variant='success' onClick={startCamera}>
          Open Camera
        </Button>
      )}

      {isCameraOn && !isRecording && !isFinished && (
        <Button variant='danger' onClick={startRecording}>
          Start Face Check
        </Button>
      )}

      {isRecording && !isFinished && (
        <div>
          <p>
            {successMessage || (
              <>
                Please turn your face <strong>{orientation}</strong>
              </>
            )}
          </p>
        </div>
      )}

      {isFinished && ( // Conditional rendering for the "Thank you" message
        <div className='mt-20 flex flex-col items-center justify-center'>
          <p>Thank you!</p>
          <p>Your Face is registered</p>
        </div>
      )}
    </div>
  );
};

export default FaceRegister;
