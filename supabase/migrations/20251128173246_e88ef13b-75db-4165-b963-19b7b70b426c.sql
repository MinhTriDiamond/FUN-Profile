-- Create storage bucket for post media (images and videos)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('post_media', 'post_media', true);

-- RLS policies for post_media bucket
CREATE POLICY "Users can upload their own post media"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'post_media' 
  AND auth.uid() IS NOT NULL
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Anyone can view post media"
ON storage.objects FOR SELECT
USING (bucket_id = 'post_media');

CREATE POLICY "Users can delete their own post media"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'post_media' 
  AND auth.uid() IS NOT NULL
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Add RLS policy for users to delete their own posts
CREATE POLICY "Users can delete their own posts"
ON public.posts FOR DELETE
USING (auth.uid() = user_id);

-- Add RLS policy for users to update their own posts
CREATE POLICY "Users can update their own posts"
ON public.posts FOR UPDATE
USING (auth.uid() = user_id);