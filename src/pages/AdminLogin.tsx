import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useLanguage } from "@/hooks/useLanguage";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t, language, setLanguage } = useLanguage();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate("/admin/dashboard");
    });
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      navigate("/admin/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-sm bg-card rounded-lg shadow-card p-8">
        <h1 className="text-2xl font-display font-bold text-center mb-6">{t("admin_panel")}</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("admin_login_email")}
            className="w-full px-4 py-2.5 rounded-md border bg-background text-foreground font-body text-sm focus:ring-2 focus:ring-ring outline-none"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t("admin_login_password")}
            className="w-full px-4 py-2.5 rounded-md border bg-background text-foreground font-body text-sm focus:ring-2 focus:ring-ring outline-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-md bg-primary text-primary-foreground font-body font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? t("admin_login_signing") : t("admin_login_signin")}
          </button>
        </form>

        <div className="mt-8 flex justify-center bg-muted rounded-md p-0.5 w-fit mx-auto">
          <button 
            onClick={() => setLanguage('en')}
            className={`px-3 py-1 text-[10px] font-bold rounded ${language === 'en' ? 'bg-primary text-primary-foreground' : 'hover:bg-background/50 text-muted-foreground'}`}
          >
            EN
          </button>
          <button 
            onClick={() => setLanguage('mr')}
            className={`px-3 py-1 text-[10px] font-bold rounded ${language === 'mr' ? 'bg-primary text-primary-foreground' : 'hover:bg-background/50 text-muted-foreground'}`}
          >
            मराठी
          </button>
          <button 
            onClick={() => setLanguage('hi')}
            className={`px-3 py-1 text-[10px] font-bold rounded ${language === 'hi' ? 'bg-primary text-primary-foreground' : 'hover:bg-background/50 text-muted-foreground'}`}
          >
            हिंदी
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
