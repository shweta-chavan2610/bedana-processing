import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Globe } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { t, language, setLanguage } = useLanguage();
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  const navLinks = [
    { label: t("nav_home"), href: "#home" },
    { label: t("nav_products"), href: "#products" },
    { label: t("nav_gallery"), href: "#gallery" },
    { label: t("nav_contact"), href: "#contact" },
    { label: t("nav_payment"), href: "/payment", isRoute: true },
  ];

  if (isAdmin) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <a href="#home" className="font-display text-lg md:text-xl font-bold text-primary truncate max-w-[200px] md:max-w-none">
          {t("hero_title")}
        </a>
        
        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-6 border-r pr-6 mr-6">
            {navLinks.map((l) => (
              l.isRoute ? (
                <Link key={l.href} to={l.href} className="text-sm font-body font-medium text-foreground/70 hover:text-primary transition-colors">
                  {l.label}
                </Link>
              ) : (
                <a key={l.href} href={l.href} className="text-sm font-body font-medium text-foreground/70 hover:text-primary transition-colors">
                  {l.label}
                </a>
              )
            ))}
            <Link to="/admin" className="text-xs font-body text-muted-foreground hover:text-primary transition-colors">
              {t("nav_owner")}
            </Link>
          </div>
          
          <div className="flex items-center gap-2">
            <Globe size={14} className="text-muted-foreground" />
            <div className="flex bg-muted rounded-md p-0.5">
              <button 
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 text-[10px] font-bold rounded ${language === 'en' ? 'bg-primary text-primary-foreground' : 'hover:bg-background/50 text-muted-foreground'}`}
              >
                EN
              </button>
              <button 
                onClick={() => setLanguage('mr')}
                className={`px-2 py-1 text-[10px] font-bold rounded ${language === 'mr' ? 'bg-primary text-primary-foreground' : 'hover:bg-background/50 text-muted-foreground'}`}
              >
                मराठी
              </button>
              <button 
                onClick={() => setLanguage('hi')}
                className={`px-2 py-1 text-[10px] font-bold rounded ${language === 'hi' ? 'bg-primary text-primary-foreground' : 'hover:bg-background/50 text-muted-foreground'}`}
              >
                हिंदी
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 md:hidden">
          <div className="flex bg-muted rounded-md p-0.5 text-[10px]">
            <button onClick={() => setLanguage('en')} className={`px-1.5 py-0.5 rounded ${language === 'en' ? 'bg-primary text-primary-foreground' : ''}`}>EN</button>
            <button onClick={() => setLanguage('mr')} className={`px-1.5 py-0.5 rounded ${language === 'mr' ? 'bg-primary text-primary-foreground' : ''}`}>मराठी</button>
            <button onClick={() => setLanguage('hi')} className={`px-1.5 py-0.5 rounded ${language === 'hi' ? 'bg-primary text-primary-foreground' : ''}`}>हिंदी</button>
          </div>
          <button onClick={() => setOpen(!open)} className="text-foreground" aria-label="Menu">
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-background border-b px-4 pb-4 space-y-3">
          {navLinks.map((l) => (
            l.isRoute ? (
              <Link key={l.href} to={l.href} onClick={() => setOpen(false)} className="block text-sm font-body font-medium text-foreground/70 hover:text-primary">
                {l.label}
              </Link>
            ) : (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="block text-sm font-body font-medium text-foreground/70 hover:text-primary">
                {l.label}
              </a>
            )
          ))}
          <Link to="/admin" onClick={() => setOpen(false)} className="block text-xs font-body text-muted-foreground hover:text-primary">
            {t("nav_owner")}
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
