
import { supabase } from "@/integrations/supabase/client";

export async function fetchProducts() {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(*)
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function fetchBanners() {
  const { data, error } = await supabase
    .from('banners')
    .select('*')
    .eq('active', true)
    .order('priority', { ascending: true });

  if (error) throw error;
  return data;
}

export async function fetchCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name', { ascending: true });

  if (error) throw error;
  return data;
}
