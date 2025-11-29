import { Trophy, Circle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const topUsers = [
  { name: "Alice Chen", points: 2450, initials: "AC" },
  { name: "Bob Smith", points: 2180, initials: "BS" },
  { name: "Carol Wang", points: 1920, initials: "CW" },
  { name: "David Lee", points: 1650, initials: "DL" },
  { name: "Emma Davis", points: 1420, initials: "ED" },
];

const contacts = [
  { name: "John Doe", online: true, initials: "JD" },
  { name: "Jane Wilson", online: true, initials: "JW" },
  { name: "Mike Brown", online: false, initials: "MB" },
  { name: "Sarah Johnson", online: true, initials: "SJ" },
  { name: "Tom Anderson", online: false, initials: "TA" },
];

const RightSidebar = () => {
  return (
    <aside className="fixed right-0 top-14 h-[calc(100vh-3.5rem)] w-72 overflow-y-auto p-4 space-y-4">
      {/* Honor Leaderboard */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Trophy className="h-4 w-4 text-primary" />
            Honor Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {topUsers.map((user, index) => (
            <div key={user.name} className="flex items-center gap-3">
              <span className="text-sm font-semibold text-muted-foreground w-5">
                #{index + 1}
              </span>
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs bg-primary/10 text-primary">
                  {user.initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.points} pts</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Contacts */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Contacts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {contacts.map((contact) => (
            <div key={contact.name} className="flex items-center gap-3">
              <div className="relative">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">
                    {contact.initials}
                  </AvatarFallback>
                </Avatar>
                <Circle
                  className={cn(
                    "absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-card",
                    contact.online ? "fill-green-500 text-green-500" : "fill-gray-400 text-gray-400"
                  )}
                />
              </div>
              <p className="text-sm font-medium truncate">{contact.name}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </aside>
  );
};

export default RightSidebar;