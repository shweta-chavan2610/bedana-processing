import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

interface Props {
  prefilledProduct: string | null;
}

const InterestForm = ({ prefilledProduct }: Props) => {
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
  if (prefilledProduct && interest !== `I am interested in ${prefilledProduct}`) {
    setInterest(`I am interested in ${prefilledProduct}`);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      toast.error("Please fill in name and phone");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("customers").insert({ name: name.trim(), phone: phone.trim(), interest: interest.trim() || null });
    setSubmitting(false);
    if (error) {
      toast.error("Failed to submit. Try again.");
    } else {
      toast.success("Thank you for your interest!");
      setName("");
      setPhone("");
      setInterest("");
    }
  };

  return (
    <section id="contact" className="py-20 px-4 bg-muted/50">
      <div className="container mx-auto max-w-lg">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-4">Get in Touch</h2>
        <p className="text-center text-muted-foreground font-body mb-8">
          Interested in our products? Let us know and we'll reach out!
        </p>
        <form onSubmit={handleSubmit} className="bg-card rounded-lg p-6 shadow-card space-y-4">
          <div>
            <label className="text-sm font-body font-medium text-card-foreground block mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-md border bg-background text-foreground font-body text-sm focus:ring-2 focus:ring-ring outline-none"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="text-sm font-body font-medium text-card-foreground block mb-1">Phone</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2.5 rounded-md border bg-background text-foreground font-body text-sm focus:ring-2 focus:ring-ring outline-none"
              placeholder="Your phone number"
            />
          </div>
          <div>
            <label className="text-sm font-body font-medium text-card-foreground block mb-1">Interest</label>
            <select
              value={interest}
              onChange={(e) => setInterest(e.target.value)}
              className="w-full px-4 py-2.5 rounded-md border bg-background text-foreground font-body text-sm focus:ring-2 focus:ring-ring outline-none"
            >
              <option value="">Select a product...</option>
              {products?.map((p) => (
                <option key={p.name} value={`I am interested in ${p.name}`}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 rounded-md bg-primary text-primary-foreground font-body font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit Interest"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default InterestForm;
