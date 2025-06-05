import Link from 'next/link';
import React from 'react';

const AboutSection = () => {
  return (
    <div className='bg-primary py-16 lg:py-28 font-tions'>
      <div className='container text-white'>
        <h2 className='text-3xl lg:text-4xl font-semibold mb-10'>About</h2>
        <div className='space-y-4 text-xl md:text-2xl leading-relaxed mb-10 lg:mb-16'>
          <p>
            The Gregor, is a premium indoor golf and private member club
            experience. The club offers two exceptional AboutGOLF™ (aG) curved
            enclosures accessible to members 24 hours a day 7 days a week.
          </p>
          <p>
            It is our goal to enhance member lifestyle and encourage social
            interaction. We do this by providing a reserved relaxed setting,
            while promoting physical activity in our cutting-edge indoor golf
            simulators.
          </p>
        </div>
        <div className='relative'>
          <iframe
            height='350px'
            width='100%'
            allowFullScreen
            src='https://momento360.com/e/u/567b86657a844c8385446eace4988b3e?utm_campaign=embed&amp;utm_source=other&amp;heading=370.31&amp;pitch=-1.74&amp;field-of-view=92&amp;size=medium&amp;display-plan=true'
          ></iframe>
          <div className='absolute inset-0 flex items-center justify-center'>
            <h3 className='text-2xl md:text-3xl font-bold text-white text-center leading-loose'>
              CHECK OUT AN <br/> INTERACTIVE 3D RENDER <br /> EXAMPLE HERE:
            </h3>
          </div>
        </div>
        <div className='flex justify-center'>
          <Link href='/become-a-member'>
            <button className='bg-white py-5 px-12 text-primary mt-10 lg:mt-24 mx-auto text-xl'>
              become a member
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;
