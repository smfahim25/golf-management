import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import appStore from '@/assets/AppStore.svg';
import playStore from '@/assets/GooglePlay.svg';

const AppSection = () => {
  return (
    <section className='relative py-16 lg:py-24 bg-primary-dark'>
      <div className='relative container'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
          <div>
            <p className='text-sm text-gray-400 mb-4 underline'>
              Know your game
            </p>
            <h2 className='text-4xl md:text-5xl font-bold text-primary mb-8 leading-tight'>
              IMPROVE YOUR GAME WITH
              <br />
              THE aG LOCKER APP
            </h2>
            <p className='text-lg text-white mb-8 leading-relaxed font-tinos'>
              aG Locker lets you walk away from any aboutGOLF simulator with all
              your golf stats, removing lingering questions about club
              distances, spin, ball speed, launch angle, and more.
            </p>
            <div className='flex flex-col sm:flex-row gap-6'>
              <Link href='#'>
                <Image
                  src={appStore}
                  alt='Apple store'
                  className='w-full h-16'
                  height={40}
                />
              </Link>
              <Link href='#'>
                <Image
                  src={playStore}
                  alt='Google store'
                  className='w-full h-16'
                  height={40}
                />
              </Link>

            </div>
          </div>
          <div className='relative'>
            <iframe
              src='https://player.vimeo.com/video/497458443?h=242641dc34&amp;app_id=122963'
              width='426'
              height='240'
              frameBorder='0'
              allow='autoplay; fullscreen; picture-in-picture'
              allowFullScreen
              title='aG Locker 2021'
              id='yui_3_17_2_1_1749030710309_79'
              __idm_id__='6356994'
            ></iframe>
          </div>
        </div>
      </div>

    </section>
  );
};

export default AppSection;
