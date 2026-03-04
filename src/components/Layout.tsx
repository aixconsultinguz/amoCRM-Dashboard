import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex bg-background font-sans dark">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar />
        <main className="flex-1 overflow-y-auto px-6 py-6 scroll-smooth">
          <div className="max-w-[1600px] mx-auto space-y-8 animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

