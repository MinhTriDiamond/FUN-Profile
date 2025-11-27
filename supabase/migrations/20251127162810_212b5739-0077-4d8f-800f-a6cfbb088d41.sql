-- Fix Function Search Path Mutable issue
-- Add SET search_path = public to all database functions for security

-- 1. Update handle_new_user (SECURITY DEFINER - most critical)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  INSERT INTO public.profiles (id, username, wallet_address)
  VALUES (new.id, new.raw_user_meta_data->>'username', new.raw_user_meta_data->>'wallet_address');
  RETURN new;
END;
$function$;

-- 2. Update reward_new_post
CREATE OR REPLACE FUNCTION public.reward_new_post()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
BEGIN
  UPDATE public.profiles SET honor_points_balance = honor_points_balance + 10000 WHERE id = NEW.user_id;
  RETURN NEW;
END;
$function$;

-- 3. Update handle_reaction_reward
CREATE OR REPLACE FUNCTION public.handle_reaction_reward()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
DECLARE
    current_count INTEGER;
    post_owner UUID;
BEGIN
    -- Lấy thông tin bài viết
    SELECT reaction_count, user_id INTO current_count, post_owner FROM public.posts WHERE id = NEW.post_id;
    
    -- Cập nhật số lượng reaction vào bảng posts
    UPDATE public.posts SET reaction_count = current_count + 1 WHERE id = NEW.post_id;
    
    -- Logic thưởng:
    -- Nếu reaction này làm tổng số lên 3 -> Thưởng 30,000
    IF (current_count + 1) = 3 THEN
        UPDATE public.profiles SET honor_points_balance = honor_points_balance + 30000 WHERE id = post_owner;
    -- Nếu reaction này là thứ 4 trở lên -> Thưởng 1,000
    ELSIF (current_count + 1) > 3 THEN
        UPDATE public.profiles SET honor_points_balance = honor_points_balance + 1000 WHERE id = post_owner;
    END IF;
    
    RETURN NEW;
END;
$function$;

-- 4. Update handle_comment_reward
CREATE OR REPLACE FUNCTION public.handle_comment_reward()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
DECLARE
    post_owner UUID;
BEGIN
    SELECT user_id INTO post_owner FROM public.posts WHERE id = NEW.post_id;
    UPDATE public.posts SET comment_count = comment_count + 1 WHERE id = NEW.post_id;
    UPDATE public.profiles SET honor_points_balance = honor_points_balance + 5000 WHERE id = post_owner;
    RETURN NEW;
END;
$function$;

-- 5. Update handle_share_reward
CREATE OR REPLACE FUNCTION public.handle_share_reward()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
DECLARE
    post_owner UUID;
BEGIN
    SELECT user_id INTO post_owner FROM public.posts WHERE id = NEW.post_id;
    UPDATE public.posts SET share_count = share_count + 1 WHERE id = NEW.post_id;
    UPDATE public.profiles SET honor_points_balance = honor_points_balance + 20000 WHERE id = post_owner;
    RETURN NEW;
END;
$function$;

-- 6. Update handle_friend_reward
CREATE OR REPLACE FUNCTION public.handle_friend_reward()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
BEGIN
    UPDATE public.profiles SET honor_points_balance = honor_points_balance + 50000, friend_count = friend_count + 1 WHERE id = NEW.user_id_1;
    UPDATE public.profiles SET honor_points_balance = honor_points_balance + 50000, friend_count = friend_count + 1 WHERE id = NEW.user_id_2;
    RETURN NEW;
END;
$function$;