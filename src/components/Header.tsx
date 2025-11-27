import { Search, Bell, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
      <div className="flex h-14 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center">
          <img 
            src="/FUN Profile.jpg" 
            alt="FUN Profile Logo" 
            className="h-10 object-contain"
          />
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-xl mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search FUN Profile"
              className="w-full pl-10 bg-background"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button variant="default" size="sm" className="gap-2">
            <Wallet className="h-4 w-4" />
            Connect Wallet
          </Button>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-destructive rounded-full" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
