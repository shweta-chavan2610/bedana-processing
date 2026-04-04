import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { LogOut, Plus, Trash2, Edit2, Users, Eye, TrendingUp, ArrowLeft } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Product = Tables<"products">;

const AdminDashboard = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
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
      let imageUrl = form.image_url;
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }
      const payload = { name: form.name, price: parseFloat(form.price), description: form.description, image_url: imageUrl || null };
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
      toast.success(editingId ? "Product updated" : "Product added");
      resetForm();
    },
    onError: () => toast.error("Failed to save product"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      toast.success("Product deleted");
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

  const tabs = [
    { key: "products" as const, label: "Products", icon: TrendingUp },
    { key: "customers" as const, label: "Customers", icon: Users },
    { key: "analytics" as const, label: "Analytics", icon: Eye },
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-card border-b sticky top-0 z-40">
        <div className="container mx-auto flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
              <ArrowLeft size={18} />
            </Link>
            <h1 className="font-display font-bold text-lg">Owner Panel</h1>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-sm font-body text-muted-foreground hover:text-destructive transition-colors">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </header>

      {/* Summary cards */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-card rounded-lg p-5 shadow-card">
            <p className="text-sm text-muted-foreground font-body">Total Customers</p>
            <p className="text-3xl font-display font-bold">{customers.length}</p>
          </div>
          <div className="bg-card rounded-lg p-5 shadow-card">
            <p className="text-sm text-muted-foreground font-body">Total Product Views</p>
            <p className="text-3xl font-display font-bold">{views.length}</p>
          </div>
          <div className="bg-card rounded-lg p-5 shadow-card">
            <p className="text-sm text-muted-foreground font-body">Most Popular</p>
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
              <h2 className="font-display text-xl font-bold">Products</h2>
              <button
                onClick={() => { resetForm(); setShowForm(true); }}
                className="flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-body font-semibold hover:opacity-90 transition-opacity"
              >
                <Plus size={16} /> Add Product
              </button>
            </div>

            {showForm && (
              <div className="bg-card rounded-lg p-6 shadow-card mb-6 space-y-4">
                <input
                  placeholder="Product name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-md border bg-background text-foreground font-body text-sm focus:ring-2 focus:ring-ring outline-none"
                />
                <input
                  placeholder="Price"
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-md border bg-background text-foreground font-body text-sm focus:ring-2 focus:ring-ring outline-none"
                />
                <textarea
                  placeholder="Description"
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
                    {saveMutation.isPending ? "Saving..." : editingId ? "Update" : "Add"}
                  </button>
                  <button onClick={resetForm} className="px-6 py-2 rounded-md border text-sm font-body text-muted-foreground hover:text-foreground transition-colors">
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {products.map((p) => (
                <div key={p.id} className="bg-card rounded-lg p-4 shadow-card flex items-center gap-4">
                  <div className="w-16 h-16 rounded-md bg-muted overflow-hidden flex-shrink-0">
                    {p.image_url ? (
                      <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">No img</div>
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
            <h2 className="font-display text-xl font-bold mb-4">Registered Customers</h2>
            {customers.length === 0 ? (
              <p className="text-muted-foreground font-body text-sm">No customers yet.</p>
            ) : (
              <div className="bg-card rounded-lg shadow-card overflow-x-auto">
                <table className="w-full text-sm font-body">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 text-muted-foreground font-medium">Name</th>
                      <th className="text-left p-3 text-muted-foreground font-medium">Phone</th>
                      <th className="text-left p-3 text-muted-foreground font-medium">Interest</th>
                      <th className="text-left p-3 text-muted-foreground font-medium">Date</th>
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
            <h2 className="font-display text-xl font-bold mb-4">Visitor Insights</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-card rounded-lg p-5 shadow-card">
                <p className="text-sm text-muted-foreground font-body">Total Clicks</p>
                <p className="text-3xl font-display font-bold">{views.length}</p>
              </div>
              <div className="bg-card rounded-lg p-5 shadow-card">
                <p className="text-sm text-muted-foreground font-body">Most Viewed Product</p>
                <p className="text-xl font-display font-bold">{mostPopular}</p>
              </div>
            </div>
            <h3 className="font-display text-lg font-semibold mb-3">Clicks Per Product</h3>
            <div className="space-y-2">
              {Object.entries(viewCounts)
                .sort((a, b) => b[1] - a[1])
                .map(([name, count]) => (
                  <div key={name} className="bg-card rounded-lg p-4 shadow-card flex items-center justify-between">
                    <span className="font-body font-medium text-sm">{name}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all"
                          style={{ width: `${(count / views.length) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-body font-bold text-primary w-8 text-right">{count}</span>
                    </div>
                  </div>
                ))}
              {Object.keys(viewCounts).length === 0 && (
                <p className="text-muted-foreground font-body text-sm">No views tracked yet.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
