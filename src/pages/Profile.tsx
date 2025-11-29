import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Edit, Upload, Medal, FileText, Users } from 'lucide-react';
import Header from '@/components/layout/Header';
import LeftSidebar from '@/components/layout/LeftSidebar';
import PostCard from '@/components/feed/PostCard';
import HonorBoardCard from '@/components/profile/HonorBoardCard';

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  
  const [editUsername, setEditUsername] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchUserPosts();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      toast({
        title: "Error loading profile",
        description: error.message,
        variant: "destructive"
      });
      return;
    }

    setProfile(data);
    setEditUsername(data.username || '');
  };

  const fetchUserPosts = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        profiles (
          username,
          avatar_url
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setPosts(data);
    }
  };

  const handleAvatarUpload = async (file: File) => {
    if (!user) return null;

    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const filePath = `${user.id}/avatar.${fileExt}`;

    // Delete old avatar if exists
    const { data: existingFiles } = await supabase.storage
      .from('avatars')
      .list(user.id);

    if (existingFiles && existingFiles.length > 0) {
      await supabase.storage
        .from('avatars')
        .remove([`${user.id}/${existingFiles[0].name}`]);
    }

    // Upload new avatar
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true });

    setUploading(false);

    if (uploadError) {
      toast({
        title: "Upload failed",
        description: uploadError.message,
        variant: "destructive"
      });
      return null;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    setLoading(true);

    let avatarUrl = profile?.avatar_url;

    // Upload avatar if new file selected
    if (avatarFile) {
      const uploadedUrl = await handleAvatarUpload(avatarFile);
      if (uploadedUrl) {
        avatarUrl = uploadedUrl;
      }
    }

    const { error } = await supabase
      .from('profiles')
      .update({
        username: editUsername,
        avatar_url: avatarUrl
      })
      .eq('id', user.id);

    setLoading(false);

    if (error) {
      toast({
        title: "Error updating profile",
        description: error.message,
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Success!",
      description: "Profile updated successfully"
    });

    setEditDialogOpen(false);
    setAvatarFile(null);
    fetchProfile();
  };

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-feed-bg">
      <Header />
      
      <div className="flex">
        <LeftSidebar />
        
        <main className="flex-1 ml-60 py-4 px-8">
          <div className="max-w-2xl mx-auto space-y-4">
            {/* Profile Header Card */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={profile.avatar_url || undefined} />
                      <AvatarFallback className="text-2xl">
                        {profile.username?.[0]?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div>
                      <h1 className="text-3xl font-bold">{profile.username || 'User'}</h1>
                      <p className="text-muted-foreground">{user?.email}</p>
                    </div>
                  </div>

                  <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="gap-2">
                        <Edit size={16} />
                        Edit Profile
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Profile</DialogTitle>
                        <DialogDescription>Update your profile information</DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="avatar">Avatar</Label>
                          <div className="flex items-center gap-4">
                            <Avatar className="h-16 w-16">
                              <AvatarImage src={
                                avatarFile 
                                  ? URL.createObjectURL(avatarFile) 
                                  : profile.avatar_url || undefined
                              } />
                              <AvatarFallback>
                                {editUsername?.[0]?.toUpperCase() || 'U'}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <Input
                                id="avatar"
                                type="file"
                                accept="image/*"
                                onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
                                className="cursor-pointer"
                              />
                              <p className="text-xs text-muted-foreground mt-1">
                                Upload a new profile picture
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="username">Username</Label>
                          <Input
                            id="username"
                            value={editUsername}
                            onChange={(e) => setEditUsername(e.target.value)}
                            placeholder="Enter username"
                          />
                        </div>
                      </div>

                      <Button 
                        onClick={handleSaveProfile} 
                        disabled={loading || uploading}
                        className="w-full"
                      >
                        {loading || uploading ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>

            {/* User's Posts */}
            <Card>
              <CardHeader>
                <CardTitle>Your Posts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {posts.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No posts yet. Share your first post!
                  </p>
                ) : (
                  posts.map((post) => (
                    <PostCard
                      key={post.id}
                      id={post.id}
                      author={post.profiles?.username || "Anonymous"}
                      authorId={post.user_id}
                      avatarUrl={post.profiles?.avatar_url}
                      time={new Date(post.created_at).toLocaleDateString()}
                      content={post.content || ""}
                      image={post.image_url}
                      mediaUrls={post.media_urls as string[] | null}
                      privacyLevel={post.privacy_level}
                      feelingType={post.feeling_type}
                      feelingText={post.feeling_text}
                      likes={post.reaction_count || 0}
                      comments={post.comment_count || 0}
                      shares={post.share_count || 0}
                      onDeleted={fetchUserPosts}
                      onUpdated={fetchUserPosts}
                    />
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </main>

        {/* Right Sidebar - Sticky Honor Board */}
        <aside className="hidden lg:block w-80 p-4 sticky top-20 self-start">
          <HonorBoardCard
            totalPosts={profile.total_posts || 0}
            totalCommentsReceived={profile.total_comments_received || 0}
            totalReactionsReceived={profile.total_reactions_received || 0}
            totalSharesReceived={profile.total_shares_received || 0}
            friendCount={profile.friend_count || 0}
            honorPointsBalance={profile.honor_points_balance || 0}
          />
        </aside>
      </div>
    </div>
  );
};

export default Profile;
