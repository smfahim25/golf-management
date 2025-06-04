import React from 'react';
import logo from '@/assets/gregor-logo.png';
import Image from 'next/image';

const Footer = () => {
  return (
    <footer className='bg-black py-12 lg:py-24 px-4'>
      <div className='max-w-7xl mx-auto'>
        <div className='max-w-[200px] mx-auto mb-8'>
          <Image
            src={logo}
            className='px-10 md:px-0 lg:w-[580px]'
            alt='Gregor Logo'
            width={200}
            height={200}
          />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-xl'>
          <div>
            <h4 className='text-xl font-medium text-white mb-4 lg:mb-8'>Location</h4>
            <p className='text-white'>1690w. Clarkston Rd.</p>
            <p className='text-white'>Lake Orion, MI 48362</p>
          </div>

          <div>
            <h4 className='text-xl font-medium text-white mb-4 lg:mb-8'>Hours</h4>
            <p className='text-white font-semibold'>Member Access</p>
            <p className='text-white'>24 hours a day 7 days a week</p>
          </div>

          <div>
            <h4 className='text-xl font-medium text-white mb-4 lg:mb-8'>Contact</h4>
            <a
              href='mailto:access@gpcgolf.com'
              className='text-primary underline'
            >
              access@gpcgolf.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
