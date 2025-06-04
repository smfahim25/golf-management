import React from 'react';
import bioImg from '@/assets/bio-logo.jpg';
import Image from 'next/image';

const InstructionSection = () => {
  return (
    <>
      <section className='bg-primary py-16 px-4'>
        <div className='container mx-auto'>
          <div className='text-center max-w-7xl mx-auto mb-8 tinos-bold-italic'>
            <p className='text-white text-xl leading-relaxed mb-4 '>
              We are so excited to announce our new Director of Instruction,
              Charlie Starrs. Charlie brings a wealth of experience and
              expertise to the The Gregor. His dedication to educational
              excellence and passion for the game of golf aligns perfectly with
              our mission and values. We can't wait to see the positive impact
              he will have on our members and all those in search of an
              exceptional educational program.
            </p>
            <p className='text-white text-xl font-semibold italic'>
              Welcome, Charlie!
            </p>
          </div>

          <div className='grid grid-cols-1 max-w-7xl mx-auto lg:grid-cols-3 gap-8 items-start font-tinos'>
            <div className='lg:col-span-2 bg-primary-dark text-white p-10 py-16 order-2 lg:order-1'>
              <h3 className='text-3xl font-bold mb-6'>Charlie Starrs, PGA</h3>
              <div className='space-y-4 text-lg leading-relaxed'>
                <p>
                  Director of Instruction at The Gregor, state-of-the-art indoor
                  golf studio located in Lake Orion, Michigan. Charlie has been
                  a Teaching Professional for over 30 years. He is certified in
                  ADM (The American Development Model) through the PGA of
                  America. He prides himself on mentoring young teaching
                  professionals and helping them create their own teaching
                  styles and philosophies.
                </p>
                <p>
                  Charlie's teaching philosophy is simple, "you hit the shot you
                  set up for." With the proper grip, posture, and alignment you
                  will play golf the way you want to. "There's no "bad shot" in
                  golf, you hit the shots you prepared for... prepare well, play
                  well!"
                </p>
                <p>
                  Charlie has a passion for teaching golf to golfers with all
                  skill levels. He teaches Junior Golfers, Beginners, Ladies,
                  Men & Groups.
                </p>
                <p>
                  Providing above & beyond customer service is a very important
                  goal to Charlie. The word NO does not exist.
                </p>
              </div>
            </div>

            <div className='order-1 lg:order-2'>
              <Image
                src={bioImg}
                alt='Charlie Starrs Bio'
                className='w-full max-h-[440px] object-contain'
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default InstructionSection;
