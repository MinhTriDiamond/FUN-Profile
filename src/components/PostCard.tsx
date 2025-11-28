import { Heart, MessageCircle, Share2, MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

interface PostCardProps {
  id: string;
  author: string;
  avatarUrl?: string | null;
  time: string;
  content: string;
  image?: string | null;
  likes: number;
  comments: number;
  shares: number;
}

const PostCard = ({
  id,
  author,
  avatarUrl,
  time,
  content,
  image,
  likes,
  comments,
  shares,
}: PostCardProps) => {
  const navigate = useNavigate();
  const { user, isGuest } = useAuth();

  const handleInteraction = (action: string) => {
    if (!user || isGuest) {
      toast({
        title: "Login Required",
        description: `Please log in to ${action}`,
        action: (
          <Button variant="default" size="sm" onClick={() => navigate('/auth')}>
            Log In
          </Button>
        ),
      });
      return;
    }
    // TODO: Implement actual interaction logic
    toast({
      title: "Coming soon",
      description: `${action} functionality will be available soon!`,
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              {avatarUrl ? (
                <img src={avatarUrl} alt={author} className="w-full h-full object-cover" />
              ) : (
                <AvatarFallback className="bg-primary/10 text-primary">
                  {getInitials(author)}
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <p className="font-semibold text-primary">{author}</p>
              <p className="text-xs text-muted-foreground">{time}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm">{content}</p>
        {image && (
          <div className="rounded-lg overflow-hidden">
            <img
              src={image}
              alt="Post content"
              className="w-full h-auto object-cover"
            />
          </div>
        )}
        
        {/* Engagement Stats */}
        <div className="flex items-center justify-between text-sm text-muted-foreground pt-2">
          <span>{likes} loves</span>
          <div className="flex gap-3">
            <span>{comments} comments</span>
            <span>{shares} shares</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0 border-t">
        <div className="flex w-full gap-1">
          <Button 
            variant="ghost" 
            className="flex-1 gap-2 text-primary hover:bg-primary hover:text-white group"
            onClick={() => handleInteraction("love this post")}
          >
            <Heart className="h-4 w-4 text-primary group-hover:!text-white" />
            Love
          </Button>
          <Button 
            variant="ghost" 
            className="flex-1 gap-2 text-primary hover:bg-primary hover:text-white group"
            onClick={() => handleInteraction("comment on this post")}
          >
            <MessageCircle className="h-4 w-4 text-primary group-hover:!text-white" />
            Comment
          </Button>
          <Button 
            variant="ghost" 
            className="flex-1 gap-2 text-primary hover:bg-primary hover:text-white group"
            onClick={() => handleInteraction("share this post")}
          >
            <Share2 className="h-4 w-4 text-primary group-hover:!text-white" />
            Share
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PostCard;
