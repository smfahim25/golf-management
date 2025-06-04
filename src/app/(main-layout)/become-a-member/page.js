import { Benefits } from './components/benefits';
import { HeroSection } from './components/hero-section';
import { MarqueeDetails } from './components/marquee-details';
import { AskQuestionForm } from './components/question-form';
import { SimulatorEnclosures } from './components/simulator-enclosures';

export default function BecomeAMember() {
  return (
    <>
      <HeroSection />
      <MarqueeDetails />
      <AskQuestionForm />
      <Benefits />
      <SimulatorEnclosures />
    </>
  );
}
