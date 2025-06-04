import Image from 'next/image';
import React from 'react';
import slide2 from '@/assets/Slide2.jpeg';
import slide4 from '@/assets/Slide4.jpeg';
import slide6 from '@/assets/Slide6.jpeg';
import slide8 from '@/assets/Slide8.jpeg';

const BenefitSection = () => {
  return (
    <div>
      <section className='relative bg-black py-16 lg:py-32 px-4'>
        <div className='container'>
          <div className='grid grid-cols-1 lg:grid-cols-4 items-center gap-6'>
            {/* Left Images */}
            <div className='order-2 lg:order-1'>
              <div className='flex flex-col sm:flex-row lg:flex-col gap-6 lg:gap-12'>
                <div className='flex-1 overflow-hidden'>
                  <Image
                    src={slide2}
                    height='200'
                    width='120'
                    alt='Golf Simulator'
                    className='w-full h-60 object-contain'
                  />
                </div>
                <div className='flex-1 overflow-hidden'>
                  <Image
                    src={slide4}
                    height='200'
                    width='200'
                    alt='Club Interior'
                    className='w-full h-60 object-contain'
                  />
                </div>
              </div>
            </div>

            {/* Center Content */}
            <div className='text-center lg:col-span-2 lg:order-2'>
              <h2 className='text-4xl md:text-5xl xl:text-6xl font-bold text-primary mb-8'>
                The Benefits
              </h2>
              <div className='space-y-6 mb-8 text-lg md:text-xl xl:text-3xl'>
                <p className=' text-gray-300'>
                  Limited Memberships For Greater Accessibility
                </p>
                <p className=' text-gray-300'>
                  Refined Gregor Club Environment
                </p>
                <p className=' text-gray-300'>
                  Dedicated Locker
                </p>
              </div>
              <button className='bg-primary hover:bg-green-600 text-white px-12 py-4 text-lg font-semibold rounded transition-colors'>
                Become Member
              </button>
            </div>

            {/* Right Images */}
            <div className='order-3'>
              <div className='flex flex-col sm:flex-row lg:flex-col gap-6 lg:gap-12'>
                <div className='flex-1 overflow-hidden'>
                  <Image
                    src={slide6}
                    height='200'
                    width='200'
                    alt='Golf Simulator'
                    className='w-full h-60 object-contain'
                  />
                </div>
                <div className='flex-1 overflow-hidden'>
                  <Image
                    src={slide8}
                    height='200'
                    width='200'
                    alt='Club Interior'
                    className='w-full h-60 object-contain'
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BenefitSection;
