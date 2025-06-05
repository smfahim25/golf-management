export function HeroSection() {
  return (
    <>
      <div className='bg-[#D7FEC4]'>
        {/* container  */}
        <div className='max-w-6xl px-5 py-12 mx-auto'>
          <h1 className='text-3xl md:text-5xl font-bold mb-10'>Distinction</h1>
          <div>
            <p className='md:text-2xl text-center mx-auto mb-5 font-tions font-medium'>Join us at Gregor private golf and club. </p>
            <p className='md:text-2xl text-center font-tions font-medium'>The Gregor is devoted to its members, retention, and prestige. Our advantages are only as strong as our commitment to satisfy these three things. Aside from ensuring our venue is extensively maintained, we provide an environment that is never limited by the weather and is available to members on their time.</p>
          </div>
        </div>
      </div>
      <div
        style={{ clipPath: 'polygon(0 0, 100% 0, 100% 25%, 50% 100%, 0 25%)' }}
        className='h-20 sm:h-60 bg-[#D7FEC4]'
      ></div>
      <div className='bg-primary h-[400px]  md:h-[500px] -mt-20 sm:-mt-48 flex justify-center items-end pb-24 md:pb-32'>
        <div className='flex items-center flex-col'>
          <h1 className='mb-20 text-3xl md:text-6xl font-bold text-white italic'>Schedule a Tour</h1>
          <button className=' bg-white text-xl md:text-2xl font-tions text-primary px-12 py-6 font-semibold cursor-pointer transition-colors'>CLICK HERE</button>
        </div>
      </div>
    </>
  );
}
