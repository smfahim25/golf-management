"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  MessagesSquare,
  Menu,
  ChevronDown,
  ChevronsLeft,
  ChevronsRight,
  FileText,
  LandPlot,
  CalendarMinus2,
  UserRoundSearch,
  LayoutList,
  Users,
  LogOut,
  Boxes,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useClientPathname } from "@/hooks/useClientPathName";
import useAuthStore from "@/stores/AuthStore";

const navigation = [
  { name: "Booking Calendar", href: "/dashboard", icon: LandPlot },
  { name: "My Bookings", href: "/dashboard/my-bookings", icon: CalendarMinus2 },
  {
    name: "Discussion Forum",
    href: "https://links.geneva.com/invite/34716fa4-0b17-4bf8-9b96-309b20600f2f",
    target: "_blank",
    icon: MessagesSquare,
  },
  {
    name: "Guest waiver",
    href: "https://app.waiversign.com/e/64276294da72d0001966df71/doc/64276312da72d0001966e00f?event=none",
    icon: UserRoundSearch,
    target: "_blank",
  },
];

const adminNavigation = [
  {
    name: "Clubs",
    href: "/dashboard/clubs",
    icon: Boxes,
  },
  {
    name: "Manage Bookings",
    href: "/dashboard/all-bookings",
    icon: LayoutList,
  },
  {
    name: "Manage Users",
    href: "/dashboard/users",
    icon: Users,
  },
];

const bottomNavigation = [
  { name: "Edit Profile", href: "/dashboard/account/profile", icon: FileText },
];

const Sidebar = () => {
  const pathname = useClientPathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [openItem, setOpenItem] = useState(null);
  const sidebarRef = useRef(null);
  const { user, logout } = useAuthStore();

  const loggedIn = true;
  const isLoading = false;

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 1024 && width < 1280) {
        setIsCollapsed(true);
      } else if (width >= 1280) {
        setIsCollapsed(false);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (window.innerWidth >= 1024) return;

      if (
        isMobileOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        !event.target.closest(".sidebar-toggle")
      ) {
        setIsMobileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileOpen]);

  useEffect(() => {
    if (!pathname) return;

    const allNavItems = [
      ...navigation,
      ...adminNavigation,
      ...bottomNavigation,
    ];
    for (const item of allNavItems) {
      if (item.subItems) {
        const hasActiveChild = item.subItems.some((subItem) => {
          if (!subItem.href) return false;

          if (
            pathname === subItem.href ||
            pathname.startsWith(`${subItem.href}/`)
          ) {
            return true;
          }

          if (pathname.startsWith(`${subItem.href}/create`)) {
            return createAllowList.some(
              (allowedPath) => subItem.href === allowedPath
            );
          }

          if (pathname.includes(`${subItem.href}/edit`)) {
            return true;
          }

          return false;
        });
        if (hasActiveChild) {
          setOpenItem(item.name);
          break;
        }
      }
    }
  }, [pathname]);

  const toggleItem = (name) => {
    setOpenItem((prev) => (prev === name ? null : name));
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const createAllowList = ["/dashboard/customization/practice-areas"];

  const isActive = (href) => {
    if (!pathname || !href) return false;

    if (pathname === href) return true;

    if (pathname.startsWith(href + "/create")) {
      return createAllowList.some((allowedPath) => href === allowedPath);
    }

    if (pathname.includes(href + "/edit")) {
      return true;
    }

    if (
      href === "/dashboard/blogs" &&
      pathname.startsWith("/dashboard/blogs") &&
      pathname.split("/").length === 3
    ) {
      return true;
    }

    return false;
  };

  const NavItem = ({ item, isBottom = false, target = "self" }) => {
    const hasSubItems = item.subItems && item.subItems.length > 0;
    const isItemActive = item.subItems
      ? item.subItems.some((subItem) => {
          if (!subItem.href || !pathname) return false;

          if (pathname === subItem.href) {
            return true;
          }

          if (pathname.startsWith(`${subItem.href}/create`)) {
            return createAllowList.some(
              (allowedPath) => subItem.href === allowedPath
            );
          }

          // For edit path, always match
          if (pathname.includes(`${subItem.href}/edit`)) {
            return true;
          }

          return false;
        })
      : isActive(item.href);

    const isOpen = openItem === item.name;

    // If the item has sublinks, we'll render a collapsible section
    if (hasSubItems) {
      return (
        <div className="w-full">
          <Collapsible
            open={!isCollapsed && isOpen}
            onOpenChange={() => toggleItem(item.name)}
            className="w-full transition-all duration-300 ease-in-out"
          >
            <CollapsibleTrigger asChild>
              <button
                className={cn(
                  "flex w-full items-center rounded-md px-3 py-3 text-sm cursor-pointer font-medium transition-colors",
                  isItemActive || isOpen
                    ? "bg-secondary text-secondary-foreground"
                    : "hover:bg-secondary hover:text-secondary-foreground",
                  isCollapsed && "justify-center px-2"
                )}
                onClick={(e) => {
                  e.preventDefault();
                  toggleItem(item.name);
                }}
              >
                <item.icon className={cn("h-4 w-4", !isCollapsed && "mr-3")} />
                {!isCollapsed && (
                  <>
                    <span className="flex-1 text-left">{item.name}</span>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform duration-200",
                        isOpen && "rotate-180"
                      )}
                    />
                  </>
                )}
              </button>
            </CollapsibleTrigger>
            {!isCollapsed && (
              <CollapsibleContent className="pl-4 pt-1 overflow-hidden transition-all duration-300 ease-in-out">
                <div className="flex flex-col space-y-1 animate-in slide-in-from-left-5 duration-300">
                  {item.subItems?.map((subItem) => (
                    <Link
                      rel="nofollow"
                      key={subItem.href}
                      href={subItem.href}
                      className={cn(
                        "flex items-center rounded-md px-3 py-2 text-sm transition-colors font-medium",
                        isActive(subItem.href, true)
                          ? "bg-secondary"
                          : " hover:bg-secondary/50 hover:text-secondary-foreground"
                      )}
                    >
                      <subItem.icon className="mr-2 h-4 w-4" />
                      <span>{subItem.name}</span>
                    </Link>
                  ))}
                </div>
              </CollapsibleContent>
            )}
          </Collapsible>
        </div>
      );
    }

    // For items without sublinks, render a simple link
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <Link
            rel="nofollow"
            href={item.href}
            className={cn(
              "flex items-center rounded-md px-3 py-3 text-sm font-medium transition-colors",
              isActive(item.href)
                ? "bg-primary text-secondary-foreground"
                : "hover:bg-secondary hover:text-secondary-foreground",
              isCollapsed && "justify-center px-2"
            )}
          >
            <item.icon className={cn("h-4 w-4", !isCollapsed && "mr-3")} />
            {!isCollapsed && <span>{item.name}</span>}
          </Link>
        </TooltipTrigger>
        {isCollapsed && (
          <TooltipContent side="right" className="flex items-center gap-4">
            {item.name}
          </TooltipContent>
        )}
      </Tooltip>
    );
  };

  return (
    <TooltipProvider>
      <>
        {/* Mobile overlay that appears when sidebar is open */}
        {isMobileOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-10 lg:hidden transition-opacity duration-300 ease-in-out"
            onClick={() => setIsMobileOpen(false)}
            aria-hidden="true"
          />
        )}
        <button
          className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-background rounded-md sidebar-toggle"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          aria-label="Toggle sidebar"
        >
          <Menu className="h-6 w-6" />
        </button>

        <div
          ref={sidebarRef}
          className={cn(
            "fixed inset-y-0 z-20 flex flex-col transition-all min-h-screen bg-primary-dark text-white duration-300 ease-in-out lg:static custom-shadow",
            isCollapsed ? "w-[72px]" : "w-72",
            isMobileOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          )}
        >
          <div className="border-b border-gray-100">
            <div
              className={cn(
                "flex h-16 items-center gap-2 px-5",
                isCollapsed && "justify-center px-2"
              )}
            >
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "ml-auto h-8 w-8 rounded-full cursor-pointer",
                  isCollapsed ? "ml-0" : "bg-primary border-border border"
                )}
                onClick={toggleSidebar}
              >
                {isCollapsed ? (
                  <ChevronsRight className="h-4 w-4" />
                ) : (
                  <ChevronsLeft className="h-4 w-4" />
                )}
                <span className="sr-only">
                  {isCollapsed ? "Expand" : "Collapse"} Sidebar
                </span>
              </Button>
            </div>
          </div>
          <div className="flex-1 overflow-auto border-r border-gray-100">
            <nav className="flex-1 space-y-1 px-5 py-4">
              {/* Main Dashboard Section */}
              {!isCollapsed && (
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Dashboard
                  </h3>
                </div>
              )}
              {navigation.map((item) => (
                <NavItem key={item.name} item={item} target={item.target} />
              ))}

              {/* Admin Section */}
              {loggedIn && !isLoading && (
                <>
                  {!isCollapsed && (
                    <div className="mt-6 mb-4">
                      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">
                        Admin
                      </h3>
                    </div>
                  )}
                  {adminNavigation.map((item) => (
                    <NavItem key={item.name} item={item} />
                  ))}
                </>
              )}
            </nav>
          </div>
          {loggedIn && !isLoading && (
            <div className="border-t border-r border-gray-100 py-3 px-3">
              <nav className="space-y-1 px-2">
                {bottomNavigation.map((item) => (
                  <NavItem key={item.name} item={item} isBottom />
                ))}
                <button
                  onClick={logout}
                  className="text-sm flex items-center gap-3 px-3 py-2.5 hover:bg-secondary hover:text-secondary-foreground w-full rounded-md"
                >
                  <LogOut className="w-4 h-4" />
                  {!isCollapsed && "Logout"}
                </button>
              </nav>
            </div>
          )}
        </div>
      </>
    </TooltipProvider>
  );
};

export default Sidebar;
