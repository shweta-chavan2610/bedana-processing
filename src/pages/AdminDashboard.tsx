import { useEffect, useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { LogOut, Plus, Trash2, Edit2, Users, Eye, TrendingUp, ArrowLeft, Globe } from "lucide-react";
import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useLanguage } from "@/hooks/useLanguage";
import type { Tables } from "@/integrations/supabase/types";
type Product = Tables<"products">;

const AdminDashboard = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { t, language, setLanguage } = useLanguage();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", price: "", description: "", image_url: "" });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [tab, setTab] = useState<"products" | "customers" | "analytics">("products");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) navigate("/admin");
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      if (!session) navigate("/admin");
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const { data: products = [] } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: customers = [] } = useQuery({
    queryKey: ["admin-customers"],
    queryFn: async () => {
      const { data, error } = await supabase.from("customers").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: views = [] } = useQuery({
    queryKey: ["admin-views"],
    queryFn: async () => {
      const { data, error } = await supabase.from("views").select("*");
      if (error) throw error;
      return data;
    },
  });

  const viewCounts = views.reduce<Record<string, number>>((acc, v) => {
    acc[v.product_name] = (acc[v.product_name] || 0) + 1;
    return acc;
  }, {});

  const mostPopular = Object.entries(viewCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

  const chartData = Object.entries(viewCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({ name, count }));

  const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  const uploadImage = async (file: File): Promise<string> => {
    const ext = file.name.split(".").pop();
    const path = `${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("product-images").upload(path, file);
    if (error) throw error;
    const { data: urlData } = supabase.storage.from("product-images").getPublicUrl(path);
    return urlData.publicUrl;
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      const numericPrice = parseFloat(form.price);
      if (isNaN(numericPrice) || numericPrice <= 0) {
        toast.error(t("admin_toast_price_err"));
        throw new Error("Invalid price");
      }
      
      if (!form.name.trim()) {
        toast.error(t("admin_toast_name_err"));
        throw new Error("Missing name");
      }

      let imageUrl = form.image_url;
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }
      const payload = { name: form.name, price: numericPrice, description: form.description, image_url: imageUrl || null };
      if (editingId) {
        const { error } = await supabase.from("products").update(payload).eq("id", editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("products").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      toast.success(editingId ? t("admin_toast_updated") : t("admin_toast_added"));
      resetForm();
    },
    onError: (error: any) => {
      if (error.message !== "Invalid price" && error.message !== "Missing name") {
        toast.error(t("admin_toast_save_err"));
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      toast.success(t("admin_toast_deleted"));
    },
  });

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm({ name: "", price: "", description: "", image_url: "" });
    setImageFile(null);
  };

  const startEdit = (p: Product) => {
    setEditingId(p.id);
    setForm({ name: p.name, price: String(p.price), description: p.description || "", image_url: p.image_url || "" });
    setShowForm(true);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin");
  };

  const tabs = useMemo(() => [
    { key: "products" as const, label: t("admin_tab_products"), icon: TrendingUp },
    { key: "customers" as const, label: t("admin_tab_customers"), icon: Users },
    { key: "analytics" as const, label: t("admin_tab_analytics"), icon: Eye },
  ], [t]);

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-card border-b sticky top-0 z-40">
        <div className="container mx-auto flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
              <ArrowLeft size={18} />
            </Link>
            <h1 className="font-display font-bold text-lg">{t("admin_panel")}</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex bg-muted rounded-md p-0.5">
              <button 
                onClick={() => setLanguage('en')}
                className={`px-2 py-0.5 text-[10px] font-bold rounded ${language === 'en' ? 'bg-primary text-primary-foreground' : 'hover:bg-background/50 text-muted-foreground'}`}
              >
                EN
              </button>
              <button 
                onClick={() => setLanguage('mr')}
                className={`px-2 py-0.5 text-[10px] font-bold rounded ${language === 'mr' ? 'bg-primary text-primary-foreground' : 'hover:bg-background/50 text-muted-foreground'}`}
              >
                मराठी
              </button>
              <button 
                onClick={() => setLanguage('hi')}
                className={`px-2 py-0.5 text-[10px] font-bold rounded ${language === 'hi' ? 'bg-primary text-primary-foreground' : 'hover:bg-background/50 text-muted-foreground'}`}
              >
                हिंदी
              </button>
            </div>
            <button onClick={handleLogout} className="flex items-center gap-2 text-sm font-body text-muted-foreground hover:text-destructive transition-colors">
              <LogOut size={16} /> {t("admin_logout")}
            </button>
          </div>
        </div>
      </header>

      {/* Summary cards */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-card rounded-lg p-5 shadow-card">
            <p className="text-sm text-muted-foreground font-body">{t("admin_total_customers")}</p>
            <p className="text-3xl font-display font-bold">{customers.length}</p>
          </div>
          <div className="bg-card rounded-lg p-5 shadow-card">
            <p className="text-sm text-muted-foreground font-body">{t("admin_total_views")}</p>
            <p className="text-3xl font-display font-bold">{views.length}</p>
          </div>
          <div className="bg-card rounded-lg p-5 shadow-card">
            <p className="text-sm text-muted-foreground font-body">{t("admin_most_popular")}</p>
            <p className="text-xl font-display font-bold truncate">{mostPopular}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-card rounded-lg p-1 shadow-card w-fit">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-body font-medium transition-colors ${
                tab === t.key ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <t.icon size={16} /> {t.label}
            </button>
          ))}
        </div>

        {/* Products tab */}
        {tab === "products" && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-display text-xl font-bold">{t("admin_tab_products")}</h2>
              <button
                onClick={() => { resetForm(); setShowForm(true); }}
                className="flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-body font-semibold hover:opacity-90 transition-opacity"
              >
                <Plus size={16} /> {t("admin_add_product")}
              </button>
            </div>

            {showForm && (
              <div className="bg-card rounded-lg p-6 shadow-card mb-6 space-y-4">
                <input
                  placeholder={t("admin_name_placeholder")}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-md border bg-background text-foreground font-body text-sm focus:ring-2 focus:ring-ring outline-none"
                />
                <input
                  placeholder={t("admin_price_placeholder")}
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-md border bg-background text-foreground font-body text-sm focus:ring-2 focus:ring-ring outline-none"
                />
                <textarea
                  placeholder={t("admin_desc_placeholder")}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-md border bg-background text-foreground font-body text-sm focus:ring-2 focus:ring-ring outline-none resize-none h-20"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="text-sm font-body"
                />
                <div className="flex gap-3">
                  <button
                    onClick={() => saveMutation.mutate()}
                    disabled={saveMutation.isPending}
                    className="px-6 py-2 rounded-md bg-primary text-primary-foreground text-sm font-body font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {saveMutation.isPending ? t("admin_saving") : editingId ? t("admin_update") : t("admin_add")}
                  </button>
                  <button onClick={resetForm} className="px-6 py-2 rounded-md border text-sm font-body text-muted-foreground hover:text-foreground transition-colors">
                    {t("admin_cancel")}
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {products.map((p) => (
                <div key={p.id} className="bg-card rounded-lg p-4 shadow-card flex items-center gap-4">
                  <div className="w-16 h-16 rounded-md bg-muted overflow-hidden flex-shrink-0">
                    {p.image_url ? (
                      <img src={p.image_url} alt={p.name} className="w-full h-full object-contain" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">{t("admin_no_img")}</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-body font-semibold text-sm truncate">{p.name}</h3>
                    <p className="text-sm text-muted-foreground font-body">₹{p.price}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => startEdit(p)} className="p-2 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => deleteMutation.mutate(p.id)} className="p-2 rounded-md hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Customers tab */}
        {tab === "customers" && (
          <div>
            <h2 className="font-display text-xl font-bold mb-4">{t("admin_customers_title")}</h2>
            {customers.length === 0 ? (
              <p className="text-muted-foreground font-body text-sm">{t("admin_customers_none")}</p>
            ) : (
              <div className="bg-card rounded-lg shadow-card overflow-x-auto">
                <table className="w-full text-sm font-body">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 text-muted-foreground font-medium">{t("admin_table_name")}</th>
                      <th className="text-left p-3 text-muted-foreground font-medium">{t("admin_table_phone")}</th>
                      <th className="text-left p-3 text-muted-foreground font-medium">{t("admin_table_interest")}</th>
                      <th className="text-left p-3 text-muted-foreground font-medium">{t("admin_table_date")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map((c) => (
                      <tr key={c.id} className="border-b last:border-0">
                        <td className="p-3">{c.name}</td>
                        <td className="p-3">{c.phone}</td>
                        <td className="p-3 text-muted-foreground">{c.interest || "—"}</td>
                        <td className="p-3 text-muted-foreground">{new Date(c.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Analytics tab */}
        {tab === "analytics" && (
          <div>
            <h2 className="font-display text-xl font-bold mb-4">{t("admin_analytics_title")}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-card rounded-lg p-5 shadow-card">
                <p className="text-sm text-muted-foreground font-body">{t("admin_analytics_clicks")}</p>
                <p className="text-3xl font-display font-bold">{views.length}</p>
              </div>
              <div className="bg-card rounded-lg p-5 shadow-card">
                <p className="text-sm text-muted-foreground font-body">{t("admin_analytics_mvp")}</p>
                <p className="text-xl font-display font-bold">{mostPopular}</p>
              </div>
            </div>
            <h3 className="font-display text-lg font-semibold mb-3">{t("admin_analytics_chart_title")}</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-card p-4 rounded-lg shadow-card">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ left: -25, right: 10 }}>
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'currentColor' }} axisLine={{ stroke: 'hsl(var(--muted))' }} />
                    <YAxis tick={{ fontSize: 12, fill: 'currentColor' }} axisLine={{ stroke: 'hsl(var(--muted))' }} allowDecimals={false} />
                    <Tooltip cursor={{ fill: 'hsl(var(--muted))' }} contentStyle={{ backgroundColor: 'hsl(var(--card))', color: 'hsl(var(--card-foreground))', borderRadius: '8px', border: '1px solid hsl(var(--border))', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="h-64 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={chartData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="count">
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', color: 'hsl(var(--card-foreground))', borderRadius: '8px', border: '1px solid hsl(var(--border))', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            {chartData.length === 0 && (
              <p className="text-muted-foreground font-body text-sm mt-4">{t("admin_analytics_none")}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
