"use client";
// import { ThemeToggle } from "./theme-toggle"
// import { Notifications } from "./notifications"
import Link from "next/link";
import { usePathname } from "next/navigation";
// import { useSettings } from "@/contexts/settings-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import React from "react";
import { LogOut, Settings, UserRound } from "lucide-react";
// import { useDispatch, useSelector } from 'react-redux';
// import { logout } from '@/store/slices/authSlice';
// import useAdmin from '@/hooks/useAdmin';
import logo from "@/assets/logo_white.webp";
import Image from "next/image";

export function TopNav() {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(Boolean);

  // const user = useSelector((state) => state?.auth?.user);
  // const dispatch = useDispatch();
  // const handleLogout = () => {
  //   dispatch(logout());
  //   window.location.href = '/login';
  // };

  const user = {
    name: "John Doe",
    username: "johndoe",
    email: "john@gmail.com",
  };
  // const { isAdmin, isAdminLoading } = useAdmin();
  const isAdmin = false;
  const isAdminLoading = false;
  return (
    <header className="sticky top-0 z-40 border-b border-gray-100 custom-shadow bg-primary-dark text-white w-full">
      <div className="mx-auto px-6 flex h-16 items-center w-[100vw] justify-between">
        <div className="flex-1"></div>
        <div className="flex justify-center">
          <Link href="/" className="flex justify-center items-center gap-2">
            <Image src={logo} alt="Logo" className="h-16 w-auto" />
          </Link>
        </div>
        <div className="flex flex-1 justify-end items-center gap-4">
          <p className="text-xl">
            Call{" "}
            <span className="text-primary ml-1 italic">(248) 690-7370</span>
          </p>
        </div>
      </div>
    </header>
  );
}
