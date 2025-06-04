// import { ThemeProvider } from '@/components/theme-provider';
import { TooltipProvider } from '@/components/ui/tooltip';
import Sidebar from './components/sidebar';
import { TopNav } from './components/top-nav';
// import { SettingsProvider } from "@/contexts/settings-context"

export default function RootLayout({ children }) {
  return (
    <>
      {/* <ThemeProvider attribute="class" defaultTheme="system" enableSystem> */}
      {/* <SettingsProvider> */}
      <TooltipProvider delayDuration={0}>
        <div className='min-h-screen flex'>
          <Sidebar />
          <div className='flex-1'>
            <TopNav />
            <div className='container mx-auto p-6 max-w-7xl'>
              <main className='w-full'>{children}</main>
            </div>
          </div>
        </div>
      </TooltipProvider>
      {/* </SettingsProvider> */}
      {/* </ThemeProvider> */}
    </>
  );
}
