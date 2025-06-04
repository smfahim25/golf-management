import { ChevronLeft, ChevronRight } from 'lucide-react';
import React from 'react';

const GameSection = () => {
  return (
      <section className="bg-primary py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-right mb-8">
            <h2 className="text-4xl md:text-6xl font-bold text-white">90+</h2>
            <h3 className="text-2xl md:text-3xl font-bold text-white uppercase tracking-wider">GAMES AND COURSES</h3>
          </div>
          <div className="relative">
            {/* <img src="/images/courses-logos.png" alt="Golf Courses and Games" className="w-full h-auto" /> */}
            <button className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2 transition-all">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2 transition-all">
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </section>
  );
};

export default GameSection;