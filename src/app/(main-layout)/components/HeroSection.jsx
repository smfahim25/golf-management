import heroBg from '@/assets/box-logo.png'
import Image from 'next/image';
export default function HeroSection() {
  return (
    <section className="relative w-full h-[95vh] max-h-[800px]  flex items-center justify-center overflow-hidden -mt-20 z-0">
      {/* Image Layer with Blend */}
      <Image
        src={heroBg} // Replace with your actual path
        alt="Background Design"
        className="absolute inset-0 w-full  h-full object-cover object-[65%_0%] sm:object-center z-10 opacity-45"
      />

      {/* Overlay gradient (optional) */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary-dark/100 to-primary-dark/100" />

      {/* Content Layer */}
      <div className="relative z-10 text-center text-white px-4 space-y-18">
        <h2 className="text-xl md:text-5xl font-bold">Welcome To The</h2>
        <h1 className="text-5xl md:text-9xl font-bold">GREGOR</h1>
        <h2 className="text-xl md:text-5xl font-bold">Private Indoor Golf & Club</h2>
      </div>
    </section>
  );
}
