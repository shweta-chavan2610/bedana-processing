import heroImage from "@/assets/hero-vineyard.jpg";
import { useLanguage } from "@/hooks/useLanguage";

const HeroSection = () => {
  const { t } = useLanguage();

  return (
    <section id="home" className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      <img
        src={heroImage}
        alt="Vineyard at golden hour"
        className="absolute inset-0 w-full h-full object-cover"
        width={1920}
        height={1080}
      />
      <div className="absolute inset-0" style={{ background: 'var(--gradient-hero)' }} />
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-display text-primary-foreground mb-4 animate-fade-in line-clamp-2">
          {t("hero_title")}
        </h1>
        <p className="text-xl md:text-2xl font-body text-primary-foreground/90 mb-2 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          {t("hero_subtitle")}
        </p>
        <p className="text-lg text-primary-foreground/70 font-body mb-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          {t("hero_description")}
        </p>
        <a
          href="#products"
          className="inline-block px-8 py-3 rounded-lg bg-secondary text-secondary-foreground font-semibold font-body hover:opacity-90 transition-opacity animate-fade-in"
          style={{ animationDelay: '0.6s' }}
        >
          {t("hero_cta")}
        </a>
      </div>
    </section>
  );
};

export default HeroSection;
