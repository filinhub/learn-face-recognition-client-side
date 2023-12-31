import * as React from 'react';
import { RiAlarmWarningFill } from 'react-icons/ri';

import Layout from '@/components/layout/Layout';
import ArrowLink from '@/components/links/ArrowLink';
import Seo from '@/components/Seo';
import Typography from '@/components/typography/Typography';

export default function NotFoundPage() {
  return (
    <Layout>
      <Seo templateTitle='Not Found' />

      <main>
        <section>
          <div className='layout flex min-h-screen flex-col items-center justify-center text-center text-black'>
            <RiAlarmWarningFill
              size={60}
              className='drop-shadow-glow animate-flicker text-red-500'
            />
            <Typography className='mt-4' as='h1' variant='d1'>
              Halaman tidak ditemukan
            </Typography>
            <Typography className='mt-4' variant='b1'>
              <ArrowLink href='/'>Kembali ke Halaman Utama</ArrowLink>
            </Typography>
          </div>
        </section>
      </main>
    </Layout>
  );
}
