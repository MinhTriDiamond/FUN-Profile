import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/layout/Header";
import LeftSidebar from "@/components/layout/LeftSidebar";
import RightSidebar from "@/components/layout/RightSidebar";
import CreatePost from "@/components/feed/CreatePost";
import PostCard from "@/components/feed/PostCard";

const Index = () => {
  const navigate = useNavigate();
  const { user, isGuest, session } = useAuth();

  useEffect(() => {
    if (session) {
      navigate('/');
    }
  }, [session, navigate]);

  const { data: posts, isLoading, refetch } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select(`
          *,
          profiles (
            username,
            avatar_url
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-feed">
      <Header />
      
      <div className="flex">
        <LeftSidebar />
        
        {/* Center Feed */}
        <main className="flex-1 ml-60 mr-72 py-4 px-8">
          <div className="max-w-2xl mx-auto space-y-4">
            {user && !isGuest && <CreatePost onPostCreated={refetch} />}
            
            {isLoading && (
              <div className="text-center py-8 text-muted-foreground">
                Loading posts...
              </div>
            )}
            
            {posts?.map((post) => (
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
                onDeleted={refetch}
                onUpdated={refetch}
              />
            ))}
            
            {!isLoading && posts?.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No posts yet. Be the first to post!
              </div>
            )}
          </div>
        </main>
        
        <RightSidebar />
      </div>
    </div>
  );
};

export default Index;
