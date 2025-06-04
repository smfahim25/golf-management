import BenefitSection from '../components/BenefitSection';
import ContactSection from '../components/ContactSection';
import HeroSection from '../components/HeroSection';
import SimulatorEnclosures from '../components/SimulatorEnclosures';
import YearRound from '../components/YearRound';

function Home() {
  return (
    <>
      <HeroSection />
      <YearRound />
      <BenefitSection />
      <SimulatorEnclosures />
      <ContactSection />
    </>
  );
}

export default Home;
