import { 
  Home, User, Wallet, Users, MessageCircle, Settings, 
  Info, Youtube, Gamepad, MessageSquare, Heart, 
  GraduationCap, Scale, TrendingUp, Sun, 
  Briefcase, Globe, HomeIcon, Sparkles 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/NavLink";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const mainNavigation = [
  { icon: Home, label: "Home", path: "/", active: true },
  { icon: User, label: "Profile", path: "/profile", active: false },
  { icon: Wallet, label: "Wallet", path: "/wallet", active: false },
  { icon: Users, label: "Friends", path: "/friends", active: false },
  { icon: MessageCircle, label: "Chat", path: "/chat", active: false },
  { icon: Settings, label: "Settings", path: "/settings", active: false },
];

const funEcosystem = [
  { icon: Info, label: "About FUN Profile", path: "/about" },
  { icon: Youtube, label: "FUN Play", path: "/fun-play" },
  { icon: Gamepad, label: "FUN Planet", path: "/fun-planet" },
  { icon: MessageSquare, label: "FUN Chat", path: "/fun-chat" },
  { icon: Heart, label: "FUN Charity", path: "/fun-charity" },
  { icon: GraduationCap, label: "FUN Academy", path: "/fun-academy" },
  { icon: Scale, label: "FUN Legal", path: "/fun-legal" },
  { icon: TrendingUp, label: "FUN Trading", path: "/fun-trading" },
  { icon: Sun, label: "FUN Life", path: "/fun-life" },
  { icon: Briefcase, label: "FUN Invest", path: "/fun-invest" },
  { icon: Globe, label: "FUN Earth", path: "/fun-earth" },
  { icon: HomeIcon, label: "FUN Love House", path: "/fun-love-house" },
  { icon: Sparkles, label: "FUN Cosmic Coach", path: "/fun-cosmic-coach" },
];

const LeftSidebar = () => {
  return (
    <aside className="fixed left-0 top-14 h-[calc(100vh-3.5rem)] w-60 border-r bg-nav">
      <ScrollArea className="h-full">
        <nav className="space-y-1 p-2">
          {/* Group A: Main Features */}
          {mainNavigation.map((item) => (
            <NavLink 
              key={item.label} 
              to={item.path}
              className="block"
            >
              {({ isActive }) => (
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-3 px-3 bg-transparent text-primary",
                    "hover:bg-primary hover:text-primary-foreground",
                    "[&>svg]:text-primary hover:[&>svg]:text-primary-foreground",
                    isActive && "bg-primary text-primary-foreground [&>svg]:text-primary-foreground font-semibold"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Button>
              )}
            </NavLink>
          ))}

          <Separator className="my-3" />

          {/* Group B: FUN Ecosystem */}
          <div className="pt-2">
            <p className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              FUN Ecosystem
            </p>
            {funEcosystem.map((item) => (
              <NavLink 
                key={item.label} 
                to={item.path}
                className="block"
              >
                {({ isActive }) => (
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start gap-3 px-3 bg-transparent text-primary",
                      "hover:bg-primary hover:text-primary-foreground",
                      "[&>svg]:text-primary hover:[&>svg]:text-primary-foreground",
                      isActive && "bg-primary text-primary-foreground [&>svg]:text-primary-foreground font-semibold"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Button>
                )}
              </NavLink>
            ))}
          </div>
        </nav>
      </ScrollArea>
    </aside>
  );
};

export default LeftSidebar;
