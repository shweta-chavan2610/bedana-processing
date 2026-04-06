import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const GallerySection = () => {
  const { data: images } = useQuery({
    queryKey: ["gallery-images"],
    queryFn: async () => {
      const { data } = await supabase
        .from("gallery_images")
        .select("title, image_url, sort_order")
        .order("sort_order", { ascending: true });
      return data || [];
    },
  });

  if (!images || images.length === 0) return null;

  return (
    <section id="gallery" className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-4">
          Our Processing Journey
        </h2>
        <p className="text-center text-muted-foreground font-body mb-12 max-w-xl mx-auto">
          From vineyard to finished product — a glimpse into our quality-driven process
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {images.map((img, i) => (
            <div
              key={i}
              className="group relative aspect-square rounded-lg overflow-hidden bg-card shadow-card"
            >
              <img
                src={img.image_url}
                alt={img.title}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                <span className="text-primary-foreground text-sm font-body font-semibold">
                  {img.title}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
