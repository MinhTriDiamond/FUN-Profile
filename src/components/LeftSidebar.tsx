import { Home, User, Wallet, Users, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navigationItems = [
  { icon: Home, label: "Home", active: true },
  { icon: User, label: "Profile", active: false },
  { icon: Wallet, label: "Wallet", active: false },
  { icon: Users, label: "Friends", active: false },
  { icon: Settings, label: "Settings", active: false },
];

const LeftSidebar = () => {
  return (
    <aside className="fixed left-0 top-14 h-[calc(100vh-3.5rem)] w-60 overflow-y-auto border-r bg-nav p-2">
      <nav className="space-y-1">
        {navigationItems.map((item) => (
          <Button
            key={item.label}
            variant="ghost"
            className={cn(
              "w-full justify-start gap-3 px-3 hover:bg-nav-hover",
              item.active && "bg-nav-active text-primary font-semibold"
            )}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </Button>
        ))}
      </nav>
    </aside>
  );
};

export default LeftSidebar;
