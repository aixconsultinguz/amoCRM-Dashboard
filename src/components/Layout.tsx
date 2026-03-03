import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex bg-bg text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopBar />
        <main className="flex-1 px-6 py-5 bg-gradient-to-br from-bg via-[#050815] to-black">
          {children}
        </main>
      </div>
    </div>
  );
}

