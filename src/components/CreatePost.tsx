import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import CreatePostDialog from "./CreatePostDialog";

interface CreatePostProps {
  onPostCreated?: () => void;
}

const CreatePost = ({ onPostCreated }: CreatePostProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('avatar_url, username')
          .eq('id', user.id)
          .single();
        
        if (data) {
          setAvatarUrl(data.avatar_url || "");
          setUsername(data.username || "User");
        }
      }
    };
    fetchUserData();
  }, []);


  return (
    <>
      <Card className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => setDialogOpen(true)}>
        <CardContent className="pt-6">
          <div className="flex gap-3 items-center">
            <Avatar>
              <AvatarImage src={avatarUrl} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {username[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 bg-muted rounded-full px-4 py-3 text-muted-foreground">
              What's on your mind, {username}?
            </div>
          </div>
        </CardContent>
      </Card>

      <CreatePostDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onPostCreated={onPostCreated}
        avatarUrl={avatarUrl}
        username={username}
      />
    </>
  );
};

export default CreatePost;
