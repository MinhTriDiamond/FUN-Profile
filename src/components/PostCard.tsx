import { ThumbsUp, MessageCircle, Share2, MoreHorizontal } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface PostCardProps {
  author: string;
  initials: string;
  time: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  shares: number;
}

const PostCard = ({
  author,
  initials,
  time,
  content,
  image,
  likes,
  comments,
  shares,
}: PostCardProps) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback className="bg-primary/10 text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{author}</p>
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
          <span>{likes} likes</span>
          <div className="flex gap-3">
            <span>{comments} comments</span>
            <span>{shares} shares</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0 border-t">
        <div className="flex w-full gap-1">
          <Button variant="ghost" className="flex-1 gap-2 hover:bg-nav-hover">
            <ThumbsUp className="h-4 w-4" />
            Like
          </Button>
          <Button variant="ghost" className="flex-1 gap-2 hover:bg-nav-hover">
            <MessageCircle className="h-4 w-4" />
            Comment
          </Button>
          <Button variant="ghost" className="flex-1 gap-2 hover:bg-nav-hover">
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PostCard;
