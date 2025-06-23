// import { ThemeProvider } from '@/components/theme-provider';
import { TooltipProvider } from "@/components/ui/tooltip";
import Sidebar from "./components/sidebar";
import { TopNav } from "./components/top-nav";
import { Toaster } from "react-hot-toast";
// import { SettingsProvider } from "@/contexts/settings-context"

export default function RootLayout({ children }) {
  return (
    <>
      {/* <ThemeProvider attribute="class" defaultTheme="system" enableSystem> */}
      {/* <SettingsProvider> */}
      <TooltipProvider delayDuration={0}>
        <div className="h-screen flex">
          <div className="h-screen">
            <Sidebar />
          </div>

          <div className="flex-1 flex flex-col h-full overflow-hidden">
            <div className="h-16 flex-shrink-0 border-b">
              <TopNav />
            </div>

            <div className="flex-1 overflow-y-auto py-2">
              <main className="w-full">{children}</main>
            </div>
          </div>
        </div>
      </TooltipProvider>
      <Toaster position="top-right" />
      {/* </SettingsProvider> */}
      {/* </ThemeProvider> */}
    </>
  );
}
