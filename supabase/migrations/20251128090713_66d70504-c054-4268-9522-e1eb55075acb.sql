-- Fix function search_path mutable security issue
-- Add SET search_path to functions that are missing it

-- Fix reward_new_post function
CREATE OR REPLACE FUNCTION public.reward_new_post()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Cộng 10k điểm VÀ tăng số lượng bài viết
  UPDATE public.profiles 
  SET honor_points_balance = honor_points_balance + 10000,
      total_posts = total_posts + 1
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$function$;

-- Fix handle_reaction_reward function
CREATE OR REPLACE FUNCTION public.handle_reaction_reward()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
    current_count INTEGER;
    post_owner UUID;
BEGIN
    SELECT reaction_count, user_id INTO current_count, post_owner FROM public.posts WHERE id = NEW.post_id;
    UPDATE public.posts SET reaction_count = current_count + 1 WHERE id = NEW.post_id;
    
    -- Tăng tổng số reaction nhận được trong Profile
    UPDATE public.profiles SET total_reactions_received = total_reactions_received + 1 WHERE id = post_owner;

    -- Logic thưởng tiền (như cũ)
    IF (current_count + 1) = 3 THEN
        UPDATE public.profiles SET honor_points_balance = honor_points_balance + 30000 WHERE id = post_owner;
    ELSIF (current_count + 1) > 3 THEN
        UPDATE public.profiles SET honor_points_balance = honor_points_balance + 1000 WHERE id = post_owner;
    END IF;
    RETURN NEW;
END;
$function$;

-- Fix handle_comment_reward function
CREATE OR REPLACE FUNCTION public.handle_comment_reward()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
    post_owner UUID;
BEGIN
    SELECT user_id INTO post_owner FROM public.posts WHERE id = NEW.post_id;
    UPDATE public.posts SET comment_count = comment_count + 1 WHERE id = NEW.post_id;
    
    -- Tăng tổng số comment nhận được VÀ cộng tiền
    UPDATE public.profiles 
    SET honor_points_balance = honor_points_balance + 5000,
        total_comments_received = total_comments_received + 1
    WHERE id = post_owner;
    RETURN NEW;
END;
$function$;

-- Fix handle_share_reward function
CREATE OR REPLACE FUNCTION public.handle_share_reward()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
    post_owner UUID;
BEGIN
    SELECT user_id INTO post_owner FROM public.posts WHERE id = NEW.post_id;
    UPDATE public.posts SET share_count = share_count + 1 WHERE id = NEW.post_id;
    
    -- Tăng tổng số share nhận được VÀ cộng tiền
    UPDATE public.profiles 
    SET honor_points_balance = honor_points_balance + 20000,
        total_shares_received = total_shares_received + 1
    WHERE id = post_owner;
    RETURN NEW;
END;
$function$;