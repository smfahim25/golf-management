import ReusableCarousel from '@/components/ui/reusable-carousel';

const GameSection = () => {
  return (
    <section className='bg-primary pb-16 pt-5 px-4'>
      <div className='max-w-7xl mx-auto'>
        <div className='text-right mb-8 space-y-10 opacity-80'>
          <h2 className='text-4xl md:text-6xl font-bold text-white'>90+</h2>
          <h3 className='text-2xl md:text-3xl font-bold text-white uppercase tracking-wider'>GAMES AND COURSES</h3>
        </div>
      </div>
      <div className='mt-20'>
        <ReusableCarousel
          images={gamesCourse}
          duration={800}
          columns={6}
          showTitles={false}
          direction='ltr'
        />
      </div>
      <div className='mt-20'>
        <ReusableCarousel
          images={gamesCourse.reverse()}
          duration={800}
          columns={6}
          showTitles={false}
          direction='rtl'
        />
      </div>
    </section>
  );
};

export default GameSection;

const gamesCourse = [
  'https://images.squarespace-cdn.com/content/v1/63c98798ac6dea3c55862c66/d5820f5b-371e-44fb-ba4e-31ca2b0b116b/bethpage_logo_dark.png',
  'https://images.squarespace-cdn.com/content/v1/63c98798ac6dea3c55862c66/305d9b83-d4b5-4aa6-b87f-75e701d28c6f/divider.png',
  'https://images.squarespace-cdn.com/content/v1/63c98798ac6dea3c55862c66/50870c32-ef4e-46b8-8834-71ade371a818/brooklawn%2Blogo.png',
  'https://images.squarespace-cdn.com/content/v1/63c98798ac6dea3c55862c66/9d16fdd4-4112-42d1-a793-6880025a0398/divider.png',
  'https://images.squarespace-cdn.com/content/v1/63c98798ac6dea3c55862c66/ed2b902a-867a-4b3a-bc50-03bbe5ce4dc8/coloradogolfclub.png',
  'https://images.squarespace-cdn.com/content/v1/63c98798ac6dea3c55862c66/1860bc72-4fdf-41f3-8e90-f341dfa7fef2/divider.png',
  'https://images.squarespace-cdn.com/content/v1/63c98798ac6dea3c55862c66/62fbe3fe-40c4-46b8-9ed9-aca2c4f63e26/couerdalane-logo.png',
  'https://images.squarespace-cdn.com/content/v1/63c98798ac6dea3c55862c66/ca369d88-522b-447d-bf05-ee77a4be6669/divider.png',
  'https://images.squarespace-cdn.com/content/v1/63c98798ac6dea3c55862c66/a285060b-1a04-4540-8b3c-4bdb9b593dcd/gleneagles-logo.png',
  'https://images.squarespace-cdn.com/content/v1/63c98798ac6dea3c55862c66/4e9a0d2c-35b9-44dd-a356-4dad7128674f/divider.png',
  'https://images.squarespace-cdn.com/content/v1/63c98798ac6dea3c55862c66/1b860221-84a9-46ef-a9c1-ff5822a91cf2/hazeltine-logo.png',
  'https://images.squarespace-cdn.com/content/v1/63c98798ac6dea3c55862c66/94d96807-1fa8-486e-bf86-03ffbfbd15cf/divider.png',
  'https://images.squarespace-cdn.com/content/v1/63c98798ac6dea3c55862c66/a26c4c80-b0b1-48ba-a4c2-818d07e75290/htgl-logo.png',
  'https://images.squarespace-cdn.com/content/v1/63c98798ac6dea3c55862c66/93882f52-a255-45ce-8a25-9244654633ff/divider.png',
  'https://images.squarespace-cdn.com/content/v1/63c98798ac6dea3c55862c66/4121507e-5e29-412e-96f6-da5713b5698e/kiawah.png',
  'https://images.squarespace-cdn.com/content/v1/63c98798ac6dea3c55862c66/3d94eed9-7599-475e-af90-9f6e7c9c195b/divider.png',
  'https://images.squarespace-cdn.com/content/v1/63c98798ac6dea3c55862c66/6e26df27-e464-4843-883d-0769570a1e24/legolf-logo.png',
  'https://images.squarespace-cdn.com/content/v1/63c98798ac6dea3c55862c66/6e8fee48-c23c-448b-975b-d3881d91cb31/divider.png',
  'https://images.squarespace-cdn.com/content/v1/63c98798ac6dea3c55862c66/7617f933-ffdd-447e-8623-cd47a5a7cddb/oldcourse-logo.png',
  'https://images.squarespace-cdn.com/content/v1/63c98798ac6dea3c55862c66/59eef40a-1664-4364-90f4-e98beae17c3a/divider.png',
  'https://images.squarespace-cdn.com/content/v1/63c98798ac6dea3c55862c66/0fb10df9-91e2-4a6c-9182-8c0ad3bfa7dd/pebble-logo.png',
  'https://images.squarespace-cdn.com/content/v1/63c98798ac6dea3c55862c66/06e50b7c-4a9a-4e9d-9a09-6210659e44d5/divider.png',
  'https://images.squarespace-cdn.com/content/v1/63c98798ac6dea3c55862c66/1027a45f-e76c-4252-a675-3d4c7bc900f9/SahaleeCircleLogo.png',
  'https://images.squarespace-cdn.com/content/v1/63c98798ac6dea3c55862c66/35ecf54e-9be8-461a-80aa-7b0c24ccd072/divider.png',
  'https://images.squarespace-cdn.com/content/v1/63c98798ac6dea3c55862c66/c9cf4fc6-b672-4993-91b9-28484321f6c4/spanishbay-logo.png',
  'https://images.squarespace-cdn.com/content/v1/63c98798ac6dea3c55862c66/321caac0-00bb-48da-86e6-896281fe8ab7/divider.png',
  'https://images.squarespace-cdn.com/content/v1/63c98798ac6dea3c55862c66/85205907-085c-4820-848b-3bfb0b61ef01/spyglass.png',
  'https://images.squarespace-cdn.com/content/v1/63c98798ac6dea3c55862c66/2923721a-d690-4bd8-aab5-674206696b9d/divider.png',
  'https://images.squarespace-cdn.com/content/v1/63c98798ac6dea3c55862c66/bb8ecf6a-8c70-4597-9c09-c3e65ba636f5/TheHeather_CMYK.png',
  'https://images.squarespace-cdn.com/content/v1/63c98798ac6dea3c55862c66/112bfba7-c024-4424-816d-71a8eed8b411/divider.png',
  'https://images.squarespace-cdn.com/content/v1/63c98798ac6dea3c55862c66/19c107b2-f7b1-4cba-93e9-9a6d9dbaf1dc/The-Wilderness-Golf.png',
  'https://images.squarespace-cdn.com/content/v1/63c98798ac6dea3c55862c66/07cec3fb-34f4-45b1-917d-e6a1818ccae2/divider.png',
  'https://images.squarespace-cdn.com/content/v1/63c98798ac6dea3c55862c66/5ce0e397-a35c-4193-ae81-f6f0fc5b996e/whistlingstraits-logo.png',
];
