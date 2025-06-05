'use client';
// import { ThemeToggle } from "./theme-toggle"
// import { Notifications } from "./notifications"
import Link from 'next/link';
import { usePathname } from 'next/navigation';
// import { useSettings } from "@/contexts/settings-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import React from 'react';
import { LogOut, Settings, UserRound } from 'lucide-react';
// import { useDispatch, useSelector } from 'react-redux';
// import { logout } from '@/store/slices/authSlice';
// import useAdmin from '@/hooks/useAdmin';
import logo from '@/assets/full_logo_white.webp';
import Image from 'next/image';

export function TopNav() {
  const pathname = usePathname();
  const pathSegments = pathname.split('/').filter(Boolean);

  // const user = useSelector((state) => state?.auth?.user);
  // const dispatch = useDispatch();
  // const handleLogout = () => {
  //   dispatch(logout());
  //   window.location.href = '/login';
  // };

  const user = {
    name: 'John Doe',
    username: 'johndoe',
    email: 'john@gmail.com',
  };
  // const { isAdmin, isAdminLoading } = useAdmin();
  const isAdmin = false;
  const isAdminLoading = false;
  return (
    <header className='sticky top-0 z-40 border-b border-gray-100 custom-shadow bg-primary-dark text-white w-full'>
      <div className='mx-auto px-6 flex h-16 items-center w-[100vw] justify-between'>
        <div className='pl-10'>
          {/* <nav className="flex items-center space-x-2">
            <Link
              rel="nofollow"
              href="/"
              className="text-sm pl-10 lg:pl-0 font-medium"
            >
              Home
            </Link>
            {pathSegments
              .filter((segment) => segment !== "settings" && segment !== "edit")
              .map((segment, index) => (
                <React.Fragment key={segment}>
                  <span className="text-muted-foreground">/</span>
                  <Link
                    rel="nofollow"
                    href={`/${pathSegments
                      .filter((seg) => seg !== "edit")
                      .slice(0, index + 1)
                      .join("/")}`}
                    className="text-sm font-medium"
                  >
                    {segment.charAt(0).toUpperCase() + segment.slice(1)}
                  </Link>
                </React.Fragment>
              ))}
          </nav> */}
          <Link
            href='/'
            className='flex items-center gap-2'
          >
            <Image
              src={logo}
              alt='Logo'
              className='h-16 w-auto'
            />
          </Link>
        </div>
        <div className='flex flex-1 w-full justify-end items-center gap-4'>
          {/* <Notifications /> */}
          {/* <ThemeToggle /> */}
          {/* <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full cursor-pointer">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    className="object-cover object-center"
                    src={user?.image}
                    alt={user?.name}
                  />
                  <AvatarFallback>
                    {user?.name && user?.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user?.name ? user?.name : user?.username}
                  </p>
                  {user?.email && (
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                  )}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {isAdmin && !isAdminLoading ? (
                <>
                  <DropdownMenuItem asChild>
                    <Link rel="nofollow" href="/dashboard/settings/profile">
                      <UserRound className="w-4 h-4 text-gray-700" /> Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link rel="nofollow" href="/dashboard/settings/site">
                      <Settings className="w-4 h-4 text-gray-700" /> Settings
                    </Link>
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem asChild>
                  <Link rel="nofollow" href="/dashboard/profile">
                    <UserRound className="w-4 h-4 text-gray-700" /> Profile
                  </Link>
                </DropdownMenuItem>
              )}

              <DropdownMenuItem>
                <button
                  // onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 text-red-600 font-medium cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-red-600" /> Log out
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> */}
          <p className='text-xl'>
            Call{' '}
            <span className='text-primary ml-1 italic'>(248) 690-7370</span>
          </p>
        </div>
      </div>
    </header>
  );
}
