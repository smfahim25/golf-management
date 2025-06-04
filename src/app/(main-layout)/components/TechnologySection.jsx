import React from 'react';
import businessImage from '../../../assets/business.jpg';
import Image from 'next/image';

const TechnologySection = () => {
  return (
    <section className='relative py-16 lg:py-40 font-tions'>
      <Image
        src={businessImage}
        alt='Business Image'
        className='absolute inset-0 w-full h-full object-cover opacity-86'
      />
      <div className='absolute inset-0 bg-black/60'></div>
      <div className='relative container'>
        <div className='text-center mb-12'>
          <h2 className='text-4xl md:text-5xl font-bold text-primary mb-8 font-minerva'>
            The Technology
          </h2>
          <p className='text-lg md:text-xl lg:text-2xl text-white max-w-6xl mx-auto leading-relaxed'>
            Every ag sim has 3trak® technology that measures the 3d location of
            a golf ball with stereo vision (multiple cameras) in the first few
            feet of flight. these high-performance cameras use proprietary
            technology for tracking golf balls traveling in excess of 220 mph
            just as well as short putts rolling at 2 mph.
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          {/* 3Trak Technology */}
          <div className='bg-white text-black p-8 rounded-lg'>
            <h3 className='text-2xl font-bold text-primary mb-6'>
              3Trak® Technology
            </h3>
            <ul className='space-y-4'>
              <li className='flex items-start space-x-3'>
                <div className='w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0'></div>
                <span className='text-sm'>
                  Eclipses Any Launch Monitor Packaged For An Indoor Hitting
                  Area.
                </span>
              </li>
              <li className='flex items-start space-x-3'>
                <div className='w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0'></div>
                <span className='text-sm'>
                  Machine Vision Technology In Every 3trak® Records The Point Of
                  Impact In A Series Of Images Captured With High-speed Cameras.
                </span>
              </li>
              <li className='flex items-start space-x-3'>
                <div className='w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0'></div>
                <span className='text-sm'>Captures 3d Vector Of The Ball</span>
              </li>
              <li className='flex items-start space-x-3'>
                <div className='w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0'></div>
                <span className='text-sm'>
                  Projects A Precise Shot Shape Even With Unusual Combinations
                  Such As High Launch Angle And Low Ball Velocity.
                </span>
              </li>
            </ul>
          </div>

          {/* Ag Locker Mobile App */}
          <div className='bg-white text-black p-8 rounded-lg'>
            <h3 className='text-2xl font-bold text-primary mb-6'>
              Ag Locker Mobile App:
            </h3>
            <ul className='space-y-4'>
              <li className='flex items-start space-x-3'>
                <div className='w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0'></div>
                <span className='text-sm'>
                  Log-in To Any Aboutgolfsimulator
                </span>
              </li>
              <li className='flex items-start space-x-3'>
                <div className='w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0'></div>
                <span className='text-sm'>Cutting-edge Competitions,</span>
              </li>
              <li className='flex items-start space-x-3'>
                <div className='w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0'></div>
                <span className='text-sm'>Event Leaderboards</span>
              </li>
              <li className='flex items-start space-x-3'>
                <div className='w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0'></div>
                <span className='text-sm'>Your Greatest Achievements</span>
              </li>
              <li className='flex items-start space-x-3'>
                <div className='w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0'></div>
                <span className='text-sm'>Recordings Of Your Best Shots</span>
              </li>
              <li className='flex items-start space-x-3'>
                <div className='w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0'></div>
                <span className='text-sm'>Community Based</span>
              </li>
            </ul>
          </div>

          {/* Extraordinary Accuracy */}
          <div className='bg-white text-black p-8 rounded-lg'>
            <h3 className='text-2xl font-bold text-primary mb-6'>
              Extraordinary Accuracy
            </h3>
            <ul className='space-y-4'>
              <li className='flex items-start space-x-3'>
                <div className='w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0'></div>
                <span className='text-sm'>
                  Ag Sims Proprietary Confetti Pattern
                </span>
              </li>
              <li className='flex items-start space-x-3'>
                <div className='w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0'></div>
                <span className='text-sm'>
                  3trak® Unambiguously Sees Rotation Of The Ball's Surface.
                </span>
              </li>
              <li className='flex items-start space-x-3'>
                <div className='w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0'></div>
                <span className='text-sm'>Non-repeating Pattern</span>
              </li>
              <li className='flex items-start space-x-3'>
                <div className='w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0'></div>
                <span className='text-sm'>
                  No Matter What Portion Of The Pattern Is Seen By The Cameras,
                  The Marks Uniquely Describe The Orientation Of The Ball.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

    </section>
  );
};

export default TechnologySection;
