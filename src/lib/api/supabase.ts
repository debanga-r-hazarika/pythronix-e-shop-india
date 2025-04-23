
import { supabase } from "@/integrations/supabase/client";

export async function fetchProducts(filters = {}) {
  const {
    category_id = null,
    min_price = null,
    max_price = null,
    in_stock = null,
    sort_by = "created_at",
    sort_order = "desc",
    search = null,
    on_sale = null,
    featured = null
  } = filters as {
    category_id?: string | null;
    min_price?: number | null;
    max_price?: number | null;
    in_stock?: boolean | null;
    sort_by?: string;
    sort_order?: "asc" | "desc";
    search?: string | null;
    on_sale?: boolean | null;
    featured?: boolean | null;
  };
  
  let query = supabase
    .from('products')
    .select(`
      *,
      category:categories(*),
      secondary_categories:product_categories(category:categories(*))
    `);
  
  // Apply category filter
  if (category_id) {
    // Using or() with explicit conditions for proper filtering
    query = query.or(`category_id.eq.${category_id},product_categories.category_id.eq.${category_id}`);
  }
  
  // Apply search filter if provided
  if (search) {
    query = query.ilike('name', `%${search}%`);
  }
  
  if (min_price !== null) {
    query = query.gte('price', min_price);
  }
  
  if (max_price !== null) {
    query = query.lte('price', max_price);
  }
  
  if (in_stock !== null) {
    query = in_stock 
      ? query.gt('stock', 0) 
      : query.eq('stock', 0);
  }

  // Filter for on_sale products
  if (on_sale !== null) {
    query = query.eq('on_sale', on_sale);
  }

  // Filter for featured products
  if (featured !== null) {
    query = query.eq('featured', featured);
  }
  
  // Apply sorting
  query = query.order(sort_by, { ascending: sort_order === 'asc' });

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
  
  return data;
}

export async function fetchProductById(id) {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(*),
      secondary_categories:product_categories(category:categories(*))
    `)
    .eq('id', id)
    .single();

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

export async function addToWishlist(userId, productId) {
  const { data, error } = await supabase
    .from('wishlists')
    .insert([
      { user_id: userId, product_id: productId }
    ]);
    
  if (error) throw error;
  return data;
}

export async function removeFromWishlist(userId, productId) {
  const { error } = await supabase
    .from('wishlists')
    .delete()
    .match({ user_id: userId, product_id: productId });
    
  if (error) throw error;
  return true;
}

export async function fetchUserWishlist(userId) {
  const { data, error } = await supabase
    .from('wishlists')
    .select(`
      product_id,
      product:products(*)
    `)
    .eq('user_id', userId);
    
  if (error) throw error;
  return data;
}

export async function searchProducts(query) {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(*),
      secondary_categories:product_categories(category:categories(*))
    `)
    .ilike('name', `%${query}%`);

  if (error) throw error;
  return data;
}
