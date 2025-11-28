import { Search, Bell, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import AnimatedLogo from "@/components/AnimatedLogo";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

const Header = () => {
  const navigate = useNavigate();
  const { user, isGuest, signOut } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState<string>("");

  useEffect(() => {
    if (user && !isGuest) {
      const fetchProfile = async () => {
        const { data } = await supabase
          .from('profiles')
          .select('avatar_url')
          .eq('id', user.id)
          .single();
        
        if (data?.avatar_url) {
          setAvatarUrl(data.avatar_url);
        }
      };
      fetchProfile();
    }
  }, [user, isGuest]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
      <div className="flex h-14 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
          <AnimatedLogo size={60} />
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
          {user && !isGuest ? (
            <>
              <Button variant="ghost" size="icon" className="relative group hover:bg-primary">
                <Bell className="h-5 w-5 text-yellow-500 group-hover:text-white" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-destructive rounded-full" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="cursor-pointer h-10 w-10">
                    <AvatarImage src={avatarUrl} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {user.email?.[0]?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-card border-border">
                  <DropdownMenuItem 
                    onClick={() => navigate('/profile')}
                    className="text-primary hover:!bg-primary hover:!text-white cursor-pointer focus:bg-primary focus:text-white"
                  >
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={handleSignOut}
                    className="text-primary hover:!bg-primary hover:!text-white cursor-pointer focus:bg-primary focus:text-white"
                  >
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button variant="default" size="sm" className="gap-2" onClick={() => navigate('/auth')}>
              <LogIn className="h-4 w-4" />
              Log In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
