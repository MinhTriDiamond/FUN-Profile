import { Heart, MessageCircle, Share2, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import EditPostDialog from "../EditPostDialog";
import MediaGrid from "../MediaGrid";

interface PostCardProps {
  id: string;
  author: string;
  authorId: string;
  avatarUrl?: string | null;
  time: string;
  content: string;
  image?: string | null;
  mediaUrls?: string[] | null;
  privacyLevel?: string | null;
  feelingType?: string | null;
  feelingText?: string | null;
  likes: number;
  comments: number;
  shares: number;
  onDeleted?: () => void;
  onUpdated?: () => void;
}

const PostCard = ({
  id,
  author,
  authorId,
  avatarUrl,
  time,
  content,
  image,
  mediaUrls,
  privacyLevel,
  feelingType,
  feelingText,
  likes,
  comments,
  shares,
  onDeleted,
  onUpdated,
}: PostCardProps) => {
  const navigate = useNavigate();
  const { user, isGuest } = useAuth();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isOwnPost = user?.id === authorId;

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

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from("posts")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Post deleted successfully",
      });

      setDeleteDialogOpen(false);
      onDeleted?.();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Display media URLs or fallback to single image
  const displayMedia = mediaUrls && mediaUrls.length > 0 ? mediaUrls : (image ? [image] : []);
  const mediaFiles = displayMedia.map(url => ({
    file: undefined as any,
    preview: url,
    type: url.match(/\.(mp4|webm|mov)$/i) ? "video" as const : "image" as const,
  }));

  return (
    <>
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
              <div className="flex items-center gap-2">
                <p className="font-semibold text-primary">{author}</p>
                {feelingType && feelingText && (
                  <span className="text-sm text-muted-foreground">
                    is feeling {feelingType} {feelingText}
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">{time}</p>
            </div>
          </div>
          
          {isOwnPost && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setEditDialogOpen(true)}>
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit Post
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setDeleteDialogOpen(true)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Post
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {content && <p className="text-sm whitespace-pre-wrap">{content}</p>}
        
        {mediaFiles.length > 0 && (
          <MediaGrid mediaFiles={mediaFiles} />
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

    <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Post</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this post? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

    <EditPostDialog
      open={editDialogOpen}
      onOpenChange={setEditDialogOpen}
      onPostUpdated={onUpdated}
      post={{
        id,
        content,
        media_urls: displayMedia,
        privacy_level: privacyLevel,
        feeling_type: feelingType,
        feeling_text: feelingText,
      }}
      avatarUrl={avatarUrl || undefined}
      username={author}
    />
  </>
  );
};

export default PostCard;