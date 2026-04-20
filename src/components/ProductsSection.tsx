import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Flame } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

interface Props {
  onProductClick: (productName: string) => void;
  mostPopular: string | null;
}

const ProductsSection = ({ onProductClick, mostPopular }: Props) => {
  const { t } = useLanguage();
  const { data: products, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const handleClick = async (name: string) => {
    onProductClick(name);
    await supabase.from("views").insert({ product_name: name });
  };

  return (
    <section id="products" className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-4">{t("prod_title")}</h2>
        <p className="text-center text-muted-foreground font-body mb-12 max-w-xl mx-auto">
          {t("prod_subtitle")}
        </p>
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card rounded-lg h-72 animate-pulse" />
            ))}
          </div>
        ) : products && products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p) => (
              <button
                key={p.id}
                onClick={() => handleClick(p.name)}
                className="group bg-card rounded-lg overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 text-left relative"
              >
                {mostPopular === p.name && (
                  <span className="absolute top-3 right-3 z-10 bg-secondary text-secondary-foreground text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1">
                    <Flame size={12} /> {t("prod_popular")}
                  </span>
                )}
                <div className="h-48 bg-muted overflow-hidden">
                  {p.image_url ? (
                    <img src={p.image_url} alt={p.name} loading="lazy" className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm font-body">{t("prod_no_image")}</div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-display text-lg font-semibold text-card-foreground mb-1">{p.name}</h3>
                  <p className="text-sm text-muted-foreground font-body line-clamp-2 mb-3">{p.description}</p>
                  <p className="font-body font-bold text-primary text-lg">₹{p.price}</p>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground font-body">{t("prod_none")}</p>
        )}
      </div>
    </section>
  );
};

export default ProductsSection;
