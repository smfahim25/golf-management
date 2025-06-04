import React from "react";
import logo from "@/assets/gregor-logo.png";
import boxLogo from "@/assets/box-logo.png";
import Link from "next/link";
import Image from "next/image";

const Landing = () => {
  return (
    <div className="h-screen bg-[#1f2823] flex items-center justify-center flex-col">
      <div className="mb-26">
        <Image
          src={logo}
          className="px-10 md:px-0 lg:w-[580px]"
          alt="Gregor Logo"
          width={580}
          height={200}
        />
      </div>
      <Link href="/home">
      
        <div className="marquee-wrapper text-white max-w-[360px]">
          <div className="pointer-events-none absolute left-0 top-0 h-full w-16 bg-gradient-to-r from-[#1f2823] via-[#1f2823]/70 to-transparent z-10"></div>
          <div className="pointer-events-none absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-[#1f2823] via-[#1f2823]/70 to-transparent z-10"></div>

          <div className="marquee-content">
            {/* Duplicate the content for smooth loop */}
            {[...Array(50)].map((_, repeatIdx) => (
              <div
                key={repeatIdx}
                className="flex space-x-2"
              >
                {Array.from({ length: 3 }).map((_, idx) => (
                  <div
                    key={`${repeatIdx}-${idx}`}
                    className="flex text-[30px] text-primary items-center"
                  >
                    <p>click to enter</p>
                    <p className="px-2 pt-1">〰️</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </Link>
      <div className="mt-10">
        <Image
          src={boxLogo}
          className="max-w-[180px]"
          alt="Box Logo"
          width={180}
          height={60}
        />
      </div>
    </div>
  );
};

export default Landing;
