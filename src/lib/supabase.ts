import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function getCoupleBySlug(slug: string) {
  const { data: couple, error } = await supabase
    .from("couples")
    .select("*")
    .eq("slug", slug.toLowerCase())
    .eq("status", "published")
    .single();

  if (error) {
    console.error("Error fetching couple:", error);
    return null;
  }

  return couple;
}

export async function getAllPublishedCouples() {
  const { data: couples, error } = await supabase
    .from("couples")
    .select("slug, name1, name2, wedding_date")
    .eq("status", "published");

  if (error) {
    console.error("Error fetching couples:", error);
    return [];
  }

  return couples;
}