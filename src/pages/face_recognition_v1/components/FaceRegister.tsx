/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
// components/FaceRegister.tsx

import React, { useRef, useState } from 'react';

import Button from '@/components/buttons/Button';

interface FaceRegisterProps {
  onVideoSubmit: (videoBlob: Blob) => void;
}

const FaceRegister = ({ onVideoSubmit }: FaceRegisterProps) => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordedVideo, setRecordedVideo] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );

  const recordedChunks: BlobPart[] = [];

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current!.srcObject = stream;
    videoRef.current!.play();

    const localMediaRecorder = new MediaRecorder(stream);

    localMediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunks.push(event.data);
      }
    };

    localMediaRecorder.onstop = () => {
      const videoBlob = new Blob(recordedChunks, {
        type: 'video/webm',
      });
      setRecordedVideo(URL.createObjectURL(videoBlob));
      onVideoSubmit(videoBlob);
    };

    localMediaRecorder.start();
    setMediaRecorder(localMediaRecorder);
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      videoRef.current!.srcObject &&
        (videoRef.current!.srcObject as MediaStream)
          .getTracks()
          .forEach((track) => track.stop());
      setIsRecording(false);
    }
  };

  const handleSubmit = () => {
    if (recordedVideo) {
      // Convert the recorded video URL to a Blob for submission
      fetch(recordedVideo)
        .then((response) => response.blob())
        .then((videoBlob) => {
          onVideoSubmit(videoBlob);
          setRecordedVideo(null); // Clear the preview after submission
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error('Error fetching and submitting video:', error);
        });
    }
  };

  return (
    <div className='flex flex-col items-center gap-y-8'>
      <video ref={videoRef} width='384' height='384' className='rounded-full' />

      {recordedVideo && (
        <div className='flex flex-col items-center gap-y-4'>
          <h2>Recorded Video Preview</h2>
          <video controls width='320' height='240' src={recordedVideo} />
          <Button onClick={handleSubmit}>Submit</Button>
        </div>
      )}

      {!isRecording ? (
        <Button variant='danger' onClick={startRecording}>
          Start Recording
        </Button>
      ) : (
        <Button variant='danger' onClick={stopRecording}>
          Stop Recording
        </Button>
      )}
    </div>
  );
};

export default FaceRegister;
