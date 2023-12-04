/* eslint-disable no-console */
// pages/index.tsx
// Adjust the import path as necessary
import React from 'react';

import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';
import Typography from '@/components/typography/Typography';

import FaceRegister from '@/pages/face_register_v2/components/FaceRegister';

export default function Home() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleVideoSubmit = (videoBlob: any) => {
    // Handle the video submission logic here
    console.log('Video submitted:', videoBlob);
    // You might want to send this to a server or handle it as per your application's logic
  };

  return (
    <Layout>
      <Seo templateTitle='Home' />

      <main>
        <section className='text-center'>
          <div className='layout min-h-screen py-20'>
            <Typography variant='h1' color='primary'>
              Face Recognition v1
            </Typography>
            <p className='mt-4 text-lg'>
              Follow the instructions to register your face.
            </p>

            {/* Face Recognition Component */}
            <FaceRegister onVideoSubmit={handleVideoSubmit} />
          </div>
        </section>
      </main>
    </Layout>
  );
}
