import { Image, Video, Smile } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const CreatePost = () => {
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
          <Button size="sm">Post</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreatePost;
