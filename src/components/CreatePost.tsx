import { useState } from "react";
import { Image, Video, Smile } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface CreatePostProps {
  onPostCreated?: () => void;
}

const CreatePost = ({ onPostCreated }: CreatePostProps) => {
  const [content, setContent] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const { toast } = useToast();

  const handlePost = async () => {
    if (!content.trim()) {
      toast({
        title: "Error",
        description: "Please write something to post",
        variant: "destructive",
      });
      return;
    }

    setIsPosting(true);
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to post",
        variant: "destructive",
      });
      setIsPosting(false);
      return;
    }

    const { error } = await supabase
      .from("posts")
      .insert({
        content: content.trim(),
        user_id: user.id,
      });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to create post: " + error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Post created successfully!",
      });
      setContent("");
      onPostCreated?.();
    }

    setIsPosting(false);
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex gap-3">
          <Avatar>
            <AvatarFallback className="bg-primary/10 text-primary">
              YU
            </AvatarFallback>
          </Avatar>
          <Textarea
            placeholder="What's on your mind?"
            className="min-h-[60px] resize-none"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        
        <div className="flex items-center justify-between mt-4 pt-4 border-t">
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
              <Image className="h-5 w-5 text-green-500" />
              Photo
            </Button>
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
              <Video className="h-5 w-5 text-red-500" />
              Video
            </Button>
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
              <Smile className="h-5 w-5 text-yellow-500" />
              Feeling
            </Button>
          </div>
          <Button size="sm" onClick={handlePost} disabled={isPosting}>
            {isPosting ? "Posting..." : "Post"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreatePost;
