
CREATE TABLE public.gallery_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  image_url TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view gallery images"
ON public.gallery_images
FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can insert gallery images"
ON public.gallery_images
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update gallery images"
ON public.gallery_images
FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete gallery images"
ON public.gallery_images
FOR DELETE
TO authenticated
USING (true);
