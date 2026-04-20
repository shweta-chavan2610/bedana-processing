import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const GallerySection = () => {
  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data } = await supabase.from("products").select("name, image_url").not("image_url", "is", null);
      return data || [];
    },
  });

  if (!products || products.length === 0) return null;

  return (
    <section id="gallery" className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-12">Gallery</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((p, i) => (
            <div key={i} className="aspect-square rounded-lg overflow-hidden bg-card shadow-card">
              <img src={p.image_url!} alt={p.name} loading="lazy" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
