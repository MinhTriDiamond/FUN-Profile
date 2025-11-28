import { useState, useRef, useEffect } from "react";
import { X, Image as ImageIcon, Video, Smile, Globe, Users, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import EmojiPicker from "./EmojiPicker";
import MediaGrid from "./MediaGrid";
import { Progress } from "@/components/ui/progress";

interface EditPostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPostUpdated?: () => void;
  post: {
    id: string;
    content: string | null;
    media_urls: string[] | null;
    privacy_level: string | null;
    feeling_type: string | null;
    feeling_text: string | null;
  };
  avatarUrl?: string;
  username?: string;
}

interface MediaFile {
  file?: File;
  preview: string;
  type: "image" | "video";
  isExisting?: boolean;
  url?: string;
}

const EditPostDialog = ({ open, onOpenChange, onPostUpdated, post, avatarUrl, username }: EditPostDialogProps) => {
  const [content, setContent] = useState(post.content || "");
  const [privacy, setPrivacy] = useState<"public" | "friends">((post.privacy_level as any) || "public");
  const [feeling, setFeeling] = useState<{ emoji: string; text: string } | null>(
    post.feeling_type && post.feeling_text 
      ? { emoji: post.feeling_type, text: post.feeling_text }
      : null
  );
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [isPosting, setIsPosting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Load existing media
    if (post.media_urls && Array.isArray(post.media_urls)) {
      const existing: MediaFile[] = post.media_urls.map(url => ({
        preview: url,
        url,
        type: url.match(/\.(mp4|webm|mov)$/i) ? "video" : "image",
        isExisting: true,
      }));
      setMediaFiles(existing);
    }
  }, [post.media_urls]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (mediaFiles.length + files.length > 10) {
      toast({
        title: "Too many files",
        description: "You can only upload up to 10 files per post",
        variant: "destructive",
      });
      return;
    }

    const newMediaFiles: MediaFile[] = [];

    for (const file of files) {
      if (file.type.startsWith("video/") && file.size > 50 * 1024 * 1024) {
        toast({
          title: "Video too large",
          description: `${file.name} exceeds 50MB limit`,
          variant: "destructive",
        });
        continue;
      }

      if (file.type.startsWith("image/")) {
        const optimizedFile = await optimizeImage(file);
        newMediaFiles.push({
          file: optimizedFile,
          preview: URL.createObjectURL(optimizedFile),
          type: "image",
          isExisting: false,
        });
      } else if (file.type.startsWith("video/")) {
        newMediaFiles.push({
          file,
          preview: URL.createObjectURL(file),
          type: "video",
          isExisting: false,
        });
      }
    }

    setMediaFiles([...mediaFiles, ...newMediaFiles]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const optimizeImage = async (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const img = new window.Image();
      img.src = URL.createObjectURL(file);
      
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d")!;
        
        let width = img.width;
        let height = img.height;
        
        if (width > 1920) {
          height = (height * 1920) / width;
          width = 1920;
        }
        
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(new File([blob], file.name, { type: file.type }));
          } else {
            resolve(file);
          }
        }, file.type, 0.85);
      };
      
      img.onerror = () => resolve(file);
    });
  };

  const removeMedia = (index: number) => {
    const newFiles = [...mediaFiles];
    if (!newFiles[index].isExisting) {
      URL.revokeObjectURL(newFiles[index].preview);
    }
    newFiles.splice(index, 1);
    setMediaFiles(newFiles);
  };

  const uploadMediaFiles = async (userId: string): Promise<string[]> => {
    const urls: string[] = [];
    let uploadCount = 0;
    const newFilesCount = mediaFiles.filter(m => !m.isExisting).length;

    for (const media of mediaFiles) {
      if (media.isExisting && media.url) {
        urls.push(media.url);
      } else if (media.file) {
        const fileExt = media.file.name.split(".").pop();
        const fileName = `${Date.now()}_${uploadCount}.${fileExt}`;
        const filePath = `${userId}/${fileName}`;

        const { data, error } = await supabase.storage
          .from("post_media")
          .upload(filePath, media.file);

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
          .from("post_media")
          .getPublicUrl(filePath);

        urls.push(publicUrl);
        uploadCount++;
        setUploadProgress((uploadCount / newFilesCount) * 100);
      }
    }

    return urls;
  };

  const handleUpdate = async () => {
    if (!content.trim() && mediaFiles.length === 0) {
      toast({
        title: "Empty post",
        description: "Please write something or add media",
        variant: "destructive",
      });
      return;
    }

    setIsPosting(true);
    setUploadProgress(0);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const mediaUrls = await uploadMediaFiles(user.id);

      const { error } = await supabase
        .from("posts")
        .update({
          content: content.trim() || null,
          media_urls: mediaUrls,
          privacy_level: privacy,
          feeling_type: feeling?.emoji || null,
          feeling_text: feeling?.text || null,
        })
        .eq("id", post.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Post updated successfully!",
      });

      onOpenChange(false);
      onPostUpdated?.();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Edit Post</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onOpenChange(false)}
                disabled={isPosting}
              >
                <X className="h-5 w-5" />
              </Button>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={avatarUrl} />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {username?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold">{username || "User"}</p>
                  {feeling && (
                    <span className="text-sm text-muted-foreground">
                      is feeling {feeling.emoji} {feeling.text}
                    </span>
                  )}
                </div>
                <Select value={privacy} onValueChange={(v: any) => setPrivacy(v)}>
                  <SelectTrigger className="w-32 h-7 text-xs border-0 bg-muted">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">
                      <div className="flex items-center gap-2">
                        <Globe className="h-3 w-3" />
                        Public
                      </div>
                    </SelectItem>
                    <SelectItem value="friends">
                      <div className="flex items-center gap-2">
                        <Users className="h-3 w-3" />
                        Friends
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Textarea
              placeholder={`What's on your mind, ${username || "User"}?`}
              className="min-h-[120px] resize-none border-0 focus-visible:ring-0 text-lg"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={isPosting}
            />

            {mediaFiles.length > 0 && (
              <MediaGrid mediaFiles={mediaFiles} onRemove={removeMedia} disabled={isPosting} />
            )}

            {isPosting && uploadProgress > 0 && (
              <div className="space-y-2">
                <Progress value={uploadProgress} />
                <p className="text-xs text-muted-foreground text-center">
                  Uploading media... {Math.round(uploadProgress)}%
                </p>
              </div>
            )}

            <div className="border rounded-lg p-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Add to your post</p>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isPosting || mediaFiles.length >= 10}
                  >
                    <ImageIcon className="h-5 w-5 text-green-500" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isPosting || mediaFiles.length >= 10}
                  >
                    <Video className="h-5 w-5 text-red-500" />
                  </Button>
                  <EmojiPicker onSelect={setFeeling} disabled={isPosting}>
                    <Button variant="ghost" size="sm" disabled={isPosting}>
                      <Smile className="h-5 w-5 text-yellow-500" />
                    </Button>
                  </EmojiPicker>
                </div>
              </div>
            </div>

            <Button
              className="w-full"
              onClick={handleUpdate}
              disabled={isPosting || (!content.trim() && mediaFiles.length === 0)}
            >
              {isPosting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        multiple
        className="hidden"
        onChange={handleFileSelect}
      />
    </>
  );
};

export default EditPostDialog;
