import { useLanguage } from "@/hooks/useLanguage";

const GallerySection = () => {
  const { t } = useLanguage();

  const galleryItems = [
    { name: t("gall_step1"), url: "/gallery/img3.jpg", type: "image" }, // Harvesting
    { name: t("gall_step2"), url: "/gallery/img1.mp4", type: "video" }, // Washing
    { name: t("gall_step3"), url: "/gallery/img4.jpg", type: "image" }, // Sorting
    { name: t("gall_step4"), url: "/gallery/img5.jpg", type: "image" }, // Drying
    { name: t("gall_step5"), url: "/gallery/img2.mp4", type: "video" }, // Crushing
    { name: t("gall_step6"), url: "/gallery/img6.jpg", type: "image" }, // Packaging
    { name: t("gall_step7"), url: "/gallery/img7.jpg", type: "image" }, // QC
  ];

  return (
    <section id="gallery" className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-4">
          {t("gall_title")}
        </h2>
        <p className="text-center text-muted-foreground font-body mb-12 max-w-xl mx-auto">
          {t("gall_subtitle")}
        </p>
        
        {/* Row 1: 4 items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {galleryItems.slice(0, 4).map((item, i) => (
            <GalleryItem key={i} item={item} />
          ))}
        </div>
        
        {/* Row 2: 3 items centered */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {galleryItems.slice(4, 7).map((item, i) => (
            <GalleryItem key={i} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
};

const GalleryItem = ({ item }: { item: any }) => (
  <div className="group relative aspect-video sm:aspect-square rounded-lg overflow-hidden bg-card shadow-card">
    {item.type === "video" ? (
      <video
        src={item.url}
        autoPlay
        muted
        loop
        playsInline
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
    ) : (
      <img
        src={item.url}
        alt={item.name}
        loading="lazy"
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
    )}
    <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
      <span className="text-primary-foreground text-sm font-body font-semibold">
        {item.name}
      </span>
    </div>
  </div>
);

export default GallerySection;


