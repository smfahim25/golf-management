export function MarqueeDetails() {
  return (
    <div className='bg-[#1F2822] text-white'>
      <div className='marquee-wrapper text-white w-full'>
        <div className='pointer-events-none absolute left-0 top-0 h-full w-16 bg-gradient-to-r from-[#1f2823] via-[#1f2823]/70 to-transparent z-10'></div>
        <div className='pointer-events-none absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-[#1f2823] via-[#1f2823]/70 to-transparent z-10'></div>

        <div className='marquee-content-2 py-5'>
          {/* Duplicate the content for smooth loop */}
          {[...Array(50)].map((_, repeatIdx) => (
            <div
              key={repeatIdx}
              className='flex space-x-2'
            >
              {Array.from({ length: 3 }).map((_, idx) => (
                <div
                  key={`${repeatIdx}-${idx}`}
                  className='flex text-7xl text-white items-center'
                >
                  <p>League Announcement Fall 2024</p>
                  <p className='px-2 pt-1'>...</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className='w-full p-10 md:w-[768px] mx-auto pb-20'>
        <p className='text-2xl font-bold font-tions'>Fall 2024 Gregor Indoor Golf League</p>

        <p className='text-xl ml-16 my-6'>Details:</p>

        <p className='text-xl '>Teams will consist of 2 players (1 Gregor member required). Each team will play 9 rounds of league play. League matches consist of 9 holes at one of our simulated courses each week. Teams will be able to choose their own day and time during each week to complete their 9-hole round. Tee times will be in 2-hour blocks per two-man team. </p>

        <p className='text-xl ml-16 my-6'>League Play:</p>

        <ul className='text-xl list-disc space-y-5'>
          <li>21 October thru 20 December 2024</li>
          <li>Call Jay Rice (248) 705-4386 to register your team</li>
          <li>League Fee’s: GPC Golf Members - $50 and Non-Members - $240</li>
        </ul>
      </div>
    </div>
  );
}
