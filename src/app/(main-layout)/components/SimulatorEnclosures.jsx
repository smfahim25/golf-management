import React from 'react';
import businessImage from '../../../assets/business.jpg';
import Image from 'next/image';
import { Dot } from 'lucide-react';

const enclosures = [
  {
    id: 1,
    title: '24/7/365 Golf Simulator Access',
  },
  {
    id: 2,
    title: 'Indoor Member Golf Leagues',
  },
  {
    id: 3,
    title: 'Easy-to-use Ag Clubhouse Interface',
  },
  {
    id: 4,
    title: 'Available Private Lockers',
  },
  {
    id: 5,
    title: 'Private Member Access To Website For Scheduling',
  },
  {
    id: 6,
    title: 'Relaxed Seating',
  },
  {
    id: 7,
    title: 'Football Table',
  },
  {
    id: 8,
    title: 'Sports Watch Events',
  },
  {
    id: 9,
    title: 'Refreshment And Wet Bar Area W/ Fridge, Ice Machine And Glassware',
  },
  {
    id: 10,
    title: '**Private Golf Lessons',
  },
  {
    id: 11,
    title: '**Club Fittings',
  },
];

const SimulatorEnclosures = () => {
  return (
    <section className='relative py-16 lg:py-60 px-4'>
      <Image
        src={businessImage}
        alt='Business Image'
        className='absolute inset-0 w-full h-full object-cover opacity-86'
      />
      <div className='absolute inset-0 bg-gradient-to-b from-primary-dark/60 to-primary-dark/60 ' />
      <div className='relative text-center container'>
        <h2 className='text-4xl md:text-5xl font-bold text-primary mb-12'>
          About Golf™ Premium Simulator Enclosures
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-2 text-left max-w-4xl mx-auto'>
          <div>
            {enclosures.slice(0, 6).map((enclosure) => (
              <div
                key={enclosure.id}
                className='flex items-center'
              >
                <Dot className='text-white w-12 h-10' />
                <p className='text-white md:text-xl'>{enclosure.title}</p>
              </div>
            ))}
          </div>
          <div>
            {enclosures.slice(6, 11).map((enclosure) => (
              <div
                key={enclosure.id}
                className='flex items-center'
              >
                <div>
                  <Dot className='text-white w-12 h-10' />
                </div>
                <p className='text-white md:text-xl'>{enclosure.title}</p>
              </div>
            ))}
          </div>
        </div>
        <p className='text-xl mt-10 text-white'>**Additional fees apply</p>
      </div>
    </section>
  );
};

export default SimulatorEnclosures;
