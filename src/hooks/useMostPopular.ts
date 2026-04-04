import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useMostPopular = () => {
  return useQuery({
    queryKey: ["most-popular"],
    queryFn: async () => {
      const { data, error } = await supabase.from("views").select("product_name");
      if (error) throw error;
      if (!data || data.length === 0) return null;
      const counts: Record<string, number> = {};
      data.forEach((v) => {
        counts[v.product_name] = (counts[v.product_name] || 0) + 1;
      });
      return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
    },
  });
};
