import { useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProductsSection from "@/components/ProductsSection";
import GallerySection from "@/components/GallerySection";
import InterestForm from "@/components/InterestForm";
import { useMostPopular } from "@/hooks/useMostPopular";

import { useLanguage } from "@/hooks/useLanguage";

const Index = () => {
  const { t } = useLanguage();
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const { data: mostPopular } = useMostPopular();

  const handleProductClick = (name: string) => {
    setSelectedProduct(name);
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <ProductsSection onProductClick={handleProductClick} mostPopular={mostPopular ?? null} />
      <GallerySection />
      <InterestForm prefilledProduct={selectedProduct} />
      <footer className="py-8 text-center text-sm text-muted-foreground font-body border-t">
        {t("footer_rights")}
      </footer>
    </div>
  );
};

export default Index;
