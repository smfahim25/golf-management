'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  BarChart2,
  Building2,
  Folder,
  Wallet,
  Receipt,
  CreditCard,
  Users2,
  Shield,
  MessagesSquare,
  Video,
  Settings,
  HelpCircle,
  Menu,
  ChevronLeft,
  ChevronDown,
  PieChart,
  LineChart,
  BarChart,
  DollarSign,
  CreditCardIcon,
  Clock,
  FileText,
  Bell,
  UserCog,
  Lock,
  Globe,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from '@/components/ui/tooltip';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

// Main navigation items with sublinks
const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  {
    name: 'Analytics',
    href: '/analytics',
    icon: BarChart2,
    subItems: [
      { name: 'Overview', href: '/analytics', icon: PieChart },
      { name: 'Revenue', href: '/analytics/revenue', icon: LineChart },
      { name: 'User Growth', href: '/analytics/users', icon: BarChart },
    ],
  },
  {
    name: 'Organization',
    href: '/organization',
    icon: Building2,
    subItems: [
      { name: 'Team', href: '/organization/team', icon: Users2 },
      { name: 'Departments', href: '/organization/departments', icon: Folder },
    ],
  },
  { name: 'Projects', href: '/projects', icon: Folder },
  {
    name: 'Finances',
    href: '/finances',
    icon: Wallet,
    subItems: [
      { name: 'Accounts', href: '/finances/accounts', icon: DollarSign },
      { name: 'Cards', href: '/finances/cards', icon: CreditCardIcon },
      { name: 'Transactions', href: '/finances/transactions', icon: Clock },
    ],
  },
  { name: 'Invoices', href: '/invoices', icon: Receipt },
  { name: 'Payments', href: '/payments', icon: CreditCard },
  { name: 'Members', href: '/members', icon: Users2 },
  { name: 'Permissions', href: '/permissions', icon: Shield },
  { name: 'Chat', href: '/chat', icon: MessagesSquare },
  { name: 'Meetings', href: '/meetings', icon: Video },
];

// Bottom navigation items with sublinks
const bottomNavigation = [
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
    subItems: [
      { name: 'Profile', href: '/settings', icon: UserCog },
      { name: 'Security', href: '/settings/security', icon: Lock },
      { name: 'Notifications', href: '/settings/notifications', icon: Bell },
      { name: 'Preferences', href: '/settings/preferences', icon: Globe },
    ],
  },
  {
    name: 'Help',
    href: '/help',
    icon: HelpCircle,
    subItems: [
      { name: 'Documentation', href: '/help/docs', icon: FileText },
      { name: 'Support', href: '/help/support', icon: MessagesSquare },
    ],
  },
];

const Sidebar = () => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const hoverTimeoutRef = useRef(null);

  // Instead of storing open/closed state as an object, we'll use a single string
  // to track which item is currently open (if any)
  const [openItem, setOpenItem] = useState(() => {
    const allNavItems = [...navigation, ...bottomNavigation];

    for (const item of allNavItems) {
      if (item.subItems) {
        const hasActiveChild = item.subItems.some(
          (subItem) =>
            pathname === subItem.href || pathname.startsWith(`${subItem.href}/`)
        );
        if (hasActiveChild) {
          return item.name;
        }
      }
    }

    return null;
  });

  // Handle mouse enter - expand the sidebar
  const handleMouseEnter = () => {
    // Only trigger hover expand if the sidebar is collapsed
    if (isCollapsed) {
      // Clear any existing timeout
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
        hoverTimeoutRef.current = null;
      }
      setIsHovering(true);
    }
  };

  // Handle mouse leave - collapse the sidebar after a short delay
  const handleMouseLeave = () => {
    // Only trigger hover collapse if the sidebar was expanded due to hover
    if (isCollapsed && isHovering) {
      // Add a small delay before collapsing to prevent flickering
      hoverTimeoutRef.current = setTimeout(() => {
        setIsHovering(false);
      }, 300);
    }
  };

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  // Toggle a specific nav item's expanded state
  const toggleItem = (name) => {
    setOpenItem((prev) => (prev === name ? null : name));
  };

  // Check if a path is active (exact match or starts with path for parent items)
  const isActive = (href) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  // Determine if the sidebar should appear expanded
  // It's visually expanded if it's not collapsed OR if it's being hovered over
  const isVisuallyExpanded = !isCollapsed || isHovering;

  // Render a navigation item with potential sublinks
  const NavItem = ({ item, isBottom = false }) => {
    const hasSubItems = item.subItems && item.subItems.length > 0;
    const isItemActive = isActive(item.href);
    const isOpen = openItem === item.name;

    // If the item has sublinks, we'll render a collapsible section
    if (hasSubItems) {
      return (
        <div className='w-full'>
          <Collapsible
            open={isVisuallyExpanded && isOpen}
            onOpenChange={() => toggleItem(item.name)}
            className='w-full transition-all duration-300 ease-in-out'
          >
            <CollapsibleTrigger asChild>
              <button
                className={cn(
                  'flex w-full items-center rounded-md px-3 py-3 text-sm cursor-pointer font-semibold transition-colors',
                  isItemActive || isOpen
                    ? 'bg-secondary text-secondary-foreground'
                    : 'hover:bg-secondary hover:text-secondary-foreground',
                  !isVisuallyExpanded && 'justify-center px-2'
                )}
                onClick={(e) => {
                  // Prevent the default behavior to ensure our toggle works
                  e.preventDefault();
                  toggleItem(item.name);
                }}
              >
                <item.icon
                  className={cn('h-4 w-4', isVisuallyExpanded && 'mr-3')}
                />
                {isVisuallyExpanded && (
                  <>
                    <span className='flex-1 text-left'>{item.name}</span>
                    <ChevronDown
                      className={cn(
                        'h-4 w-4 transition-transform duration-200',
                        isOpen && 'rotate-180'
                      )}
                    />
                  </>
                )}
              </button>
            </CollapsibleTrigger>
            {isVisuallyExpanded && (
              <CollapsibleContent className='pl-4 pt-1 overflow-hidden transition-all duration-300 ease-in-out'>
                <div className='flex flex-col space-y-1 animate-in slide-in-from-left-5 duration-300'>
                  {item.subItems?.map((subItem) => (
                    <Link
                      key={subItem.href}
                      href={subItem.href}
                      className={cn(
                        'flex items-center rounded-md px-3 py-2 text-sm transition-colors font-medium',
                        isActive(subItem.href)
                          ? 'bg-secondary'
                          : ' hover:bg-secondary/50 hover:text-secondary-foreground'
                      )}
                    >
                      <subItem.icon className='mr-2 h-4 w-4' />
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
            href={item.href}
            className={cn(
              'flex items-center rounded-md px-3 py-3 text-sm font-semibold transition-colors',
              isActive(item.href)
                ? 'bg-secondary text-secondary-foreground'
                : 'hover:bg-secondary hover:text-secondary-foreground',
              !isVisuallyExpanded && 'justify-center px-2'
            )}
          >
            <item.icon
              className={cn('h-4 w-4', isVisuallyExpanded && 'mr-3')}
            />
            {isVisuallyExpanded && <span>{item.name}</span>}
          </Link>
        </TooltipTrigger>
        {!isVisuallyExpanded && (
          <TooltipContent side='right' className='flex items-center gap-4'>
            {item.name}
          </TooltipContent>
        )}
      </Tooltip>
    );
  };

  return (
    <TooltipProvider>
      <>
        <button
          className='lg:hidden fixed top-4 left-4 z-50 p-2 bg-background rounded-md'
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          aria-label='Toggle sidebar'
        >
          <Menu className='h-6 w-6' />
        </button>
        <div
          className={cn(
            'fixed inset-y-0 z-20 flex flex-col bg-background transition-all max-h-screen duration-300 ease-in-out lg:static',
            isVisuallyExpanded ? 'w-72' : 'w-[72px]',
            isMobileOpen
              ? 'translate-x-0'
              : '-translate-x-full lg:translate-x-0'
          )}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className='border-b border-border'>
            <div
              className={cn(
                'flex h-16 items-center gap-2 px-5',
                !isVisuallyExpanded && 'justify-center px-2'
              )}
            >
              {isVisuallyExpanded && (
                <Link href='/' className='flex items-center font-semibold'>
                  <span className='text-lg font-bold'>Dashboard</span>
                </Link>
              )}
              <Button
                variant='ghost'
                size='sm'
                className={cn(
                  'ml-auto h-8 w-8 rounded-full',
                  !isVisuallyExpanded && 'ml-0',
                  !isCollapsed && 'bg-gray-50 border-border border'
                )}
                onClick={() => {
                  setIsCollapsed(!isCollapsed);
                  // If we're expanding manually, make sure hover state is reset
                  if (!isCollapsed) {
                    setIsHovering(false);
                  }
                }}
              >
                {isCollapsed ? (
                  <ChevronLeft
                    className={cn(
                      'h-4 w-4 transition-transform',
                      !isVisuallyExpanded && 'rotate-180'
                    )}
                  />
                ) : (
                  <X />
                )}
                <span className='sr-only'>
                  {isCollapsed ? 'Expand' : 'Collapse'} Sidebar
                </span>
              </Button>
            </div>
          </div>
          <div className='flex-1 overflow-auto border-r border-border'>
            <nav className='flex-1 space-y-1 px-5 py-4'>
              {navigation.map((item) => (
                <NavItem key={item.name} item={item} />
              ))}
            </nav>
          </div>
          <div className='border-t border-r border-border py-3 px-3'>
            <nav className='space-y-1'>
              {bottomNavigation.map((item) => (
                <NavItem key={item.name} item={item} isBottom />
              ))}
            </nav>
          </div>
        </div>
      </>
    </TooltipProvider>
  );
};
export default Sidebar;
