import React from 'react';
import AboutSection from '../components/AboutSection';
import TechnologySection from '../components/TechnologySection';
import AppSection from '../components/AppSection';
import GameSection from '../components/GameSection';

const AboutPage = () => {
  return (
    <div>
      <AboutSection />
      <TechnologySection />
      <AppSection />
      <GameSection/>
    </div>
  );
};

export default AboutPage;
