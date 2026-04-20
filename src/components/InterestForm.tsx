import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { MapPin, Phone, Mail, User, Building } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

interface Props {
  prefilledProduct: string | null;
}

const InterestForm = ({ prefilledProduct }: Props) => {
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [interest, setInterest] = useState(prefilledProduct || "");
  const [submitting, setSubmitting] = useState(false);

  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data } = await supabase.from("products").select("name");
      return data || [];
    },
  });

  // Sync prefilled product
  if (prefilledProduct && interest !== `${t("form_interest_prefix")} ${prefilledProduct}`) {
    setInterest(`${t("form_interest_prefix")} ${prefilledProduct}`);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();

    if (!trimmedName || !trimmedPhone) {
      toast.error(t("form_error_fill"));
      return;
    }

    if (trimmedName.length < 3 || !trimmedName.includes(' ')) {
      toast.error(t("form_error_name"));
      return;
    }

    if (!/^[a-zA-Z\s.-]+$/.test(trimmedName)) {
      toast.error(t("form_error_chars"));
      return;
    }

    // Phone validation: strictly 10 digits
    const cleanedPhone = trimmedPhone.replace(/[\s-]/g, '');
    if (!/^[0-9]{10}$/.test(cleanedPhone)) {
      toast.error(t("form_error_phone"));
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("customers").insert({ name: name.trim(), phone: phone.trim(), interest: interest.trim() || null });
    setSubmitting(false);
    if (error) {
      toast.error(t("form_error_fail"));
    } else {
      toast.success(t("form_success"));
      setName("");
      setPhone("");
      setInterest("");
    }
  };

  return (
    <section id="contact" className="py-20 px-4 bg-muted/50">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">{t("form_title")}</h2>
          <p className="text-muted-foreground font-body">
            {t("form_subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* Left Side: Contact Information */}
          <div className="bg-card rounded-lg p-8 shadow-card flex flex-col h-full">
            <div className="flex flex-col flex-1">
              <h3 className="text-2xl font-display font-semibold mb-6 flex items-center gap-2 text-foreground">
                <Building className="w-6 h-6 text-primary" />
                {t("form_biz_details")}
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-full shrink-0">
                    <Building className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">{t("form_biz_name")}</p>
                    <p className="text-lg font-body font-medium text-foreground">{t("hero_title")}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-full shrink-0">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">{t("form_owner")}</p>
                    <p className="text-lg font-body font-medium text-foreground">Santosh Patil</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-full shrink-0">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">{t("form_phone")}</p>
                    <p className="text-lg font-body font-medium text-foreground">+91 9158327105</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-full shrink-0">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">{t("form_email")}</p>
                    <p className="text-lg font-body font-medium text-foreground">santoshpatil1978@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-full shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">{t("form_address")}</p>
                    <p className="text-lg font-body font-medium text-foreground">
                      {t("form_address_val")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Map Embed */}
              <div className="mt-auto pt-8">
                <div className="rounded-lg overflow-hidden border border-border">
                  <iframe
                    title="Business Location"
                  src="https://www.google.com/maps?q=Riddhi+Siddhi+Bedana+Processing+At+post+Turchi+near+by+police+training+centre+Turchi+Tal+Tasgaon+dist+sangli&output=embed"
                  width="100%"
                  height="200"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Contact Form */}
          <div className="bg-card rounded-lg p-8 shadow-card flex flex-col h-full">
            <h3 className="text-2xl font-display font-semibold mb-6 text-foreground">{t("form_send_msg")}</h3>
            <form onSubmit={handleSubmit} className="flex flex-col flex-1 space-y-5">
              <div>
                <label className="text-sm font-body font-medium text-card-foreground block mb-1">{t("form_name")}</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-md border bg-background text-foreground font-body text-sm focus:ring-2 focus:ring-ring outline-none transition-all"
                  placeholder={t("form_name")}
                />
              </div>
              <div>
                <label className="text-sm font-body font-medium text-card-foreground block mb-1">{t("form_phone_label")}</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 rounded-md border bg-background text-foreground font-body text-sm focus:ring-2 focus:ring-ring outline-none transition-all"
                  placeholder={t("form_phone_label")}
                />
              </div>
              <div>
                <label className="text-sm font-body font-medium text-card-foreground block mb-1">{t("form_interest")}</label>
                <select
                  value={interest}
                  onChange={(e) => setInterest(e.target.value)}
                  className="w-full px-4 py-3 rounded-md border bg-background text-foreground font-body text-sm focus:ring-2 focus:ring-ring outline-none transition-all"
                >
                  <option value="">{t("form_select_prod")}</option>
                  {products?.map((p) => (
                    <option key={p.name} value={`${t("form_interest_prefix")} ${p.name}`}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mt-auto pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 rounded-md bg-primary text-primary-foreground font-body font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {submitting ? t("form_submitting") : t("form_submit")}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InterestForm;
