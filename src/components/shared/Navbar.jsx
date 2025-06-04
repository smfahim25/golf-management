"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import logo from "@/assets/navbar-logo.png";
import { cn } from "@/lib/utils";

const links = [
  { name: "Home", link: "/home" },
  { name: "About", link: "/about" },
  { name: "Become a Member", link: "/become-a-member" },
  { name: "Golf Instruction", link: "/contact" },
  { name: "Blog", link: "/blog" },
  { name: "Login", link: "/login" },
];

const Navbar = () => {
  const pathname = usePathname();

  return (
    <header className="flex justify-between py-5 z-20 relative bg-[#1f2823]">
      <div className="h-fit">
        <Link href="/home">
          <Image
            src={logo}
            alt="Logo"
            className="w-10 md:w-36 h-10 md:h-36"
          />
        </Link>
      </div>

      <input className="menu-btn" type="checkbox" id="menu-btn" name="menu-btn" />
      <label className="menu-icon" htmlFor="menu-btn">
        <span className="navicon" aria-label="Hamburger menu 'icon'" />
      </label>

      <nav className="menu">
        {links.map((link, index) => (
          <Link
            key={index}
            href={link.link}
            className={cn(
              "text-white md:text-primary text-[30px] md:text-[20px] text-nowrap",
              pathname === link.link && "border-b border-primary"
            )}
          >
            {link.name}
          </Link>
        ))}
      </nav>
    </header>
  );
};

export default Navbar;
