
import { supabase } from "@/integrations/supabase/client";

export async function fetchProducts(filters = {}) {
  const {
    category_id = null,
    min_price = null,
    max_price = null,
    in_stock = null,
    sort_by = "created_at",
    sort_order = "desc"
  } = filters as {
    category_id?: string | null;
    min_price?: number | null;
    max_price?: number | null;
    in_stock?: boolean | null;
    sort_by?: string;
    sort_order?: "asc" | "desc";
  };
  
  let query = supabase
    .from('products')
    .select(`
      *,
      category:categories(*)
    `);
  
  // Apply filters
  if (category_id) {
    // Query for products that have this category as either their primary category
    // or as a secondary category through product_categories relationship
    const { data: productIds, error: productIdsError } = await supabase
      .from('product_categories')
      .select('product_id')
      .eq('category_id', category_id);
    
    if (!productIdsError && productIds.length > 0) {
      const secondaryCategoryProductIds = productIds.map(pc => pc.product_id);
      query = query.or(`category_id.eq.${category_id},id.in.(${secondaryCategoryProductIds.join(',')})`);
    } else {
      query = query.eq('category_id', category_id);
    }
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
  
  // Apply sorting
  query = query.order(sort_by, { ascending: sort_order === 'asc' });

  const { data, error } = await query;

  if (error) throw error;
  return data;
}

export async function fetchProductById(id) {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(*)
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  
  // Get secondary categories for this product
  const { data: secondaryCategories, error: secondaryCategoriesError } = await supabase
    .from('product_categories')
    .select(`
      category:categories(*)
    `)
    .eq('product_id', id);
  
  if (!secondaryCategoriesError && secondaryCategories?.length > 0) {
    data.secondaryCategories = secondaryCategories.map(sc => sc.category);
  }
  
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
  // Use the correct table name and structure
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
