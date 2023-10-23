/* eslint-disable no-console */
import * as React from 'react';
import toast from 'react-hot-toast';

import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';
import Typography from '@/components/typography/Typography';

import FaceRegister from '@/pages/face_recognition_v1/components/FaceRegister';

export default function FaceRecognition() {
  const handleVideoSubmit = (videoBlob: Blob) => {
    const formData = new FormData();
    formData.append('video', videoBlob, 'video.webm');

    //TODO: needs to test on real API
    fetch('/api/uploadVideo', {
      method: 'POST',
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          toast.success('Testing');
        } else {
          toast.success('Should received response!');
          console.log('videoBlob', videoBlob);
        }
      })
      .catch(() => {
        toast.error('Oops! Something went wrong');
      });
  };

  return (
    <Layout>
      <Seo templateTitle='Alert' />

      <main>
        <section className=''>
          <div className='layout min-h-screen space-y-4 py-20'>
            <Typography variant='h1' color='primary'>
              Face Recognition v1
            </Typography>
            <div>
              <h1>Register Your Face</h1>
              <FaceRegister onVideoSubmit={handleVideoSubmit} />
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
