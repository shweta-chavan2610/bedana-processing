import heroImage from "@/assets/hero-vineyard.jpg";

const HeroSection = () => {
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
      <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold font-display text-primary-foreground mb-4 animate-fade-in">
          Riddhi Siddhi
        </h1>
        <p className="text-xl md:text-2xl font-body text-primary-foreground/90 mb-2 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          Smart Agro Advertisement Platform
        </p>
        <p className="text-lg text-primary-foreground/70 font-body mb-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          Premium grape processing products — from vineyard to table
        </p>
        <a
          href="#products"
          className="inline-block px-8 py-3 rounded-lg bg-secondary text-secondary-foreground font-semibold font-body hover:opacity-90 transition-opacity animate-fade-in"
          style={{ animationDelay: '0.6s' }}
        >
          Explore Products
        </a>
      </div>
    </section>
  );
};

export default HeroSection;
