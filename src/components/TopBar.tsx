import { useI18n } from "../i18n";
import { RefreshCw, Bell, Search, Globe } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { cn } from "../lib/utils";

export function TopBar() {
  const { t, lang, setLang } = useI18n();

  return (
    <header className="h-16 border-b border-border flex items-center justify-between px-6 bg-background/50 backdrop-blur-xl sticky top-0 z-30">
      <div className="flex items-center gap-8">
        <div>
          <h1 className="text-sm font-bold text-foreground">Dashboard</h1>
          <p className="text-[11px] text-muted-foreground">{t("topbar.subtitle")}</p>
        </div>
        
        <div className="hidden md:flex items-center bg-muted/50 border border-border px-3 py-1.5 rounded-xl gap-2 w-64">
          <Search className="w-3.5 h-3.5 text-muted-foreground" />
          <input 
            placeholder="Quick search..." 
            className="bg-transparent border-none text-xs outline-none w-full placeholder:text-muted-foreground/50"
          />
          <kbd className="pointer-events-none hidden h-4 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center p-1 bg-muted/50 border border-border rounded-xl">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLang("ru")}
            className={cn(
              "h-7 px-3 text-[10px] font-bold rounded-lg transition-all",
              lang === "ru" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            RU
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLang("uz")}
            className={cn(
              "h-7 px-3 text-[10px] font-bold rounded-lg transition-all",
              lang === "uz" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            UZ
          </Button>
        </div>

        <div className="h-6 w-[1px] bg-border mx-1" />

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-9 px-4 gap-2 border-border/60 hover:border-primary/50 group rounded-xl">
            <RefreshCw className="w-3.5 h-3.5 transition-transform group-active:rotate-180" />
            <span className="text-xs font-semibold">Refresh</span>
          </Button>
          
          <Button variant="ghost" size="icon" className="relative rounded-xl h-9 w-9 border border-border/40">
            <Bell className="w-4 h-4 text-muted-foreground" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-background" />
          </Button>
        </div>

        <div className="flex items-center gap-3 pl-2">
          <div className="text-right hidden sm:block">
            <div className="text-xs font-bold leading-none">AIX Consulting</div>
            <div className="text-[10px] text-muted-foreground font-medium mt-1">Admin Account</div>
          </div>
          <Avatar className="h-9 w-9 border border-primary/20 p-0.5 rounded-xl">
            <AvatarImage src="https://github.com/shadcn.png" className="rounded-lg" />
            <AvatarFallback className="rounded-lg">CEO</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}

