import { Product, Category, Collection, Order, StoreSettings } from '@/types';
import { PRODUCTS as INITIAL_PRODUCTS, CATEGORIES as INITIAL_CATEGORIES, COLLECTIONS as INITIAL_COLLECTIONS } from './data';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const STORAGE_KEY_PRODUCTS = 'jotg_custom_products';
const STORAGE_KEY_CATEGORIES = 'jotg_custom_categories';

// ------------------------------------------------------------------------------
// Generic fetch wrapper
// ------------------------------------------------------------------------------
export async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const token = typeof window !== 'undefined'
    ? sessionStorage.getItem('jotg_admin_token') || localStorage.getItem('jotg_admin_token')
    : null;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options?.headers as Record<string, string>),
  };

  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
    headers['x-admin-token'] = token;
  }

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || data.error || `Request failed with status ${res.status}`);
    }
    return data;
  } catch (err: any) {
    console.warn(`[JOTG API Warning] ${endpoint}:`, err.message);
    throw err;
  }
}

// ------------------------------------------------------------------------------
// LocalStorage Fallback & Storefront Synchronization Helpers
// ------------------------------------------------------------------------------
export function getStoredProducts(): Product[] {
  if (typeof window === 'undefined') return INITIAL_PRODUCTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PRODUCTS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // Ignore storage parse errors
  }
  return INITIAL_PRODUCTS;
}

export function saveStoredProducts(products: Product[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(products));
    window.dispatchEvent(new CustomEvent('jotg_products_updated', { detail: products }));
  } catch {
    // Ignore storage quota errors
  }
}

export function getStoredCategories(): Category[] {
  if (typeof window === 'undefined') return INITIAL_CATEGORIES;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CATEGORIES);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // Ignore storage parse errors
  }
  return INITIAL_CATEGORIES;
}

export function saveStoredCategories(categories: Category[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(categories));
    window.dispatchEvent(new CustomEvent('jotg_categories_updated', { detail: categories }));
  } catch {
    // Ignore
  }
}

// ------------------------------------------------------------------------------
// Product APIs
// ------------------------------------------------------------------------------
export async function getProductsApi(filters?: Record<string, string | boolean | undefined>): Promise<Product[]> {
  const queryParams = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined && v !== 'all' && v !== '') {
        queryParams.append(k, String(v));
      }
    });
  }

  const queryStr = queryParams.toString() ? `?${queryParams.toString()}` : '';

  try {
    const res = await fetchApi<{ products?: Product[]; data?: Product[] }>(`/products${queryStr}`);
    const items = res.products || res.data;
    if (items && Array.isArray(items)) {
      if (!queryStr) {
        saveStoredProducts(items);
      }
      return items;
    }
  } catch {
    // Fall back to local store
  }

  let local = getStoredProducts();
  if (filters?.category_slug && filters.category_slug !== 'all') {
    local = local.filter((p) => {
      if (filters.category_slug === 'fan-editions') return p.editionType === 'Fan Edition';
      if (filters.category_slug === 'player-editions') return p.editionType === 'Player Edition';
      if (filters.category_slug === 'custom-jerseys') return p.allowsCustomization;
      const cat = getStoredCategories().find((c) => c.slug === filters.category_slug);
      return cat ? p.categoryId === cat.id : true;
    });
  }
  if (filters?.search) {
    const q = String(filters.search).toLowerCase().trim();
    local = local.filter((p) => p.title.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q));
  }
  return local;
}

export async function getProductBySlugApi(slug: string): Promise<Product | undefined> {
  try {
    const res = await fetchApi<{ product?: Product; data?: Product }>(`/products/slug/${encodeURIComponent(slug)}`);
    if (res.product || res.data) {
      return res.product || res.data;
    }
  } catch {
    // Fallback to local
  }

  const local = getStoredProducts();
  return local.find((p) => p.slug.toLowerCase() === slug.toLowerCase().trim());
}

export async function createProductApi(data: Partial<Product>): Promise<Product> {
  const cleanData = {
    ...data,
    regularPriceMinor: Number(data.regularPriceMinor || 0),
    salePriceMinor: data.salePriceMinor ? Number(data.salePriceMinor) : undefined,
  };

  let createdProduct: Product;

  try {
    const res = await fetchApi<{ product?: Product; data?: Product }>('/products', {
      method: 'POST',
      body: JSON.stringify(cleanData),
    });
    createdProduct = res.product || res.data || (cleanData as Product);
  } catch {
    // Offline / Local resilience fallback
    const id = `prod-${Date.now()}`;
    const slug = (cleanData.slug || cleanData.title || 'kit')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    createdProduct = {
      id,
      title: cleanData.title || 'New Jersey',
      slug,
      description: cleanData.description || '',
      categoryId: cleanData.categoryId || 'cat-1',
      collectionId: cleanData.collectionId || 'col-1',
      teamLabel: cleanData.teamLabel || 'Club Kit',
      season: cleanData.season || '2024/25',
      editionType: cleanData.editionType || 'Fan Edition',
      regularPriceMinor: cleanData.regularPriceMinor,
      salePriceMinor: cleanData.salePriceMinor,
      sku: cleanData.sku || `JOTG-${Date.now().toString().slice(-4)}`,
      isFeatured: Boolean(cleanData.isFeatured),
      isBestseller: Boolean(cleanData.isBestseller),
      isNewArrival: cleanData.isNewArrival !== undefined ? Boolean(cleanData.isNewArrival) : true,
      isActive: cleanData.isActive !== undefined ? Boolean(cleanData.isActive) : true,
      allowsCustomization: Boolean(cleanData.allowsCustomization),
      customizationFeeMinor: cleanData.customizationFeeMinor || 20000,
      images: cleanData.images && cleanData.images.length > 0
        ? cleanData.images
        : [
            {
              id: `img-${Date.now()}-0`,
              productId: id,
              imageUrl: 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?auto=format&fit=crop&w=800&q=80',
              altText: cleanData.title || 'Kit Image',
              displayOrder: 1,
              isPrimary: true,
            },
          ],
      variants: cleanData.variants && cleanData.variants.length > 0
        ? cleanData.variants
        : ['S', 'M', 'L', 'XL', 'XXL'].map((s, idx) => ({
            id: `var-${Date.now()}-${idx}`,
            productId: id,
            size: s,
            sku: `${cleanData.sku || 'JOTG'}-${s}`,
            stockQuantity: 15,
          })),
    };
  }

  // Update local storage so storefront and admin see it immediately
  const existing = getStoredProducts();
  const nextProducts = [createdProduct, ...existing.filter((p) => p.id !== createdProduct.id)];
  saveStoredProducts(nextProducts);

  return createdProduct;
}

export async function updateProductApi(id: string, data: Partial<Product>): Promise<Product> {
  let updatedProduct: Product;

  try {
    const res = await fetchApi<{ product?: Product; data?: Product }>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    updatedProduct = res.product || res.data || (data as Product);
  } catch {
    const existing = getStoredProducts();
    const current = existing.find((p) => p.id === id);
    updatedProduct = { ...(current || {}), ...data } as Product;
  }

  const existing = getStoredProducts();
  const index = existing.findIndex((p) => p.id === id);
  if (index !== -1) {
    existing[index] = { ...existing[index], ...updatedProduct };
    saveStoredProducts([...existing]);
  }

  return updatedProduct;
}

export async function deleteProductApi(id: string): Promise<boolean> {
  try {
    await fetchApi(`/products/${id}`, { method: 'DELETE' });
  } catch {
    // Still delete from local storage
  }

  const existing = getStoredProducts();
  const filtered = existing.filter((p) => p.id !== id);
  saveStoredProducts(filtered);

  return true;
}

export async function updateVariantStockApi(productId: string, variantId: string, stockQuantity: number): Promise<boolean> {
  try {
    await fetchApi(`/products/${productId}/variants/${variantId}/stock`, {
      method: 'PATCH',
      body: JSON.stringify({ stockQuantity }),
    });
  } catch {
    // Update local storage
  }

  const existing = getStoredProducts();
  const product = existing.find((p) => p.id === productId);
  if (product) {
    const variant = product.variants.find((v) => v.id === variantId);
    if (variant) {
      variant.stockQuantity = stockQuantity;
      saveStoredProducts([...existing]);
      return true;
    }
  }

  return false;
}

// ------------------------------------------------------------------------------
// Image Upload API
// ------------------------------------------------------------------------------
export async function uploadImagesApi(
  files: Array<{ data: string; filename: string; contentType?: string; altText?: string }>
): Promise<Array<{ url: string; filename: string; altText?: string }>> {
  try {
    const res = await fetchApi<{ success: boolean; data: Array<{ url: string; filename: string; altText?: string }> }>(
      '/upload/images',
      {
        method: 'POST',
        body: JSON.stringify({ files }),
      }
    );
    if (res.data && Array.isArray(res.data)) {
      return res.data;
    }
  } catch (err: any) {
    console.warn('[Upload warning, fallback to direct data URI]:', err.message);
  }

  // Fallback: return data URIs directly so the UI continues working even if the backend is unreachable
  return files.map((f, i) => ({
    url: f.data,
    filename: f.filename || `kit-upload-${i}.jpg`,
    altText: f.altText || 'Kit Image',
  }));
}

// ------------------------------------------------------------------------------
// Category APIs
// ------------------------------------------------------------------------------
export async function getCategoriesApi(): Promise<Category[]> {
  try {
    const res = await fetchApi<{ categories?: Category[]; data?: Category[] }>('/categories');
    const items = res.categories || res.data;
    if (items && Array.isArray(items)) {
      saveStoredCategories(items);
      return items;
    }
  } catch {
    // Fallback
  }
  return getStoredCategories();
}

export async function createCategoryApi(data: Partial<Category>): Promise<Category> {
  let created: Category;
  try {
    const res = await fetchApi<{ category?: Category; data?: Category }>('/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    created = res.category || res.data || (data as Category);
  } catch {
    const slug = (data.name || 'category')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-');
    created = {
      id: `cat-${Date.now()}`,
      name: data.name || 'New Category',
      slug: data.slug || slug,
      description: data.description || '',
      displayOrder: data.displayOrder || 10,
    };
  }

  const existing = getStoredCategories();
  const next = [...existing, created];
  saveStoredCategories(next);
  return created;
}

export async function updateCategoryApi(id: string, data: Partial<Category>): Promise<Category> {
  let updated: Category;
  try {
    const res = await fetchApi<{ category?: Category; data?: Category }>(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    updated = res.category || res.data || (data as Category);
  } catch {
    const existing = getStoredCategories();
    const curr = existing.find((c) => c.id === id);
    updated = { ...(curr || {}), ...data } as Category;
  }

  const existing = getStoredCategories();
  const idx = existing.findIndex((c) => c.id === id);
  if (idx !== -1) {
    existing[idx] = { ...existing[idx], ...updated };
    saveStoredCategories([...existing]);
  }
  return updated;
}

export async function deleteCategoryApi(id: string): Promise<boolean> {
  try {
    await fetchApi(`/categories/${id}`, { method: 'DELETE' });
  } catch {
    // Fallback
  }

  const existing = getStoredCategories();
  saveStoredCategories(existing.filter((c) => c.id !== id));
  return true;
}

// ------------------------------------------------------------------------------
// Admin Metrics & Settings APIs
// ------------------------------------------------------------------------------
export async function getAdminMetricsApi() {
  try {
    const res = await fetchApi<{ metrics?: any; data?: any }>('/admin/metrics');
    return res.metrics || res.data;
  } catch {
    const products = getStoredProducts();
    return {
      totalProducts: products.length,
      activeProducts: products.filter((p) => p.isActive).length,
      totalOrders: 3,
      pendingOrders: 1,
      pendingVerifications: 1,
      totalRevenueMinor: 153000,
      lowStockCount: 0,
    };
  }
}

export async function getAdminSettingsApi(): Promise<StoreSettings> {
  try {
    const res = await fetchApi<{ settings?: StoreSettings }>('/admin/settings');
    if (res.settings) return res.settings;
  } catch {
    // Fallback
  }

  return {
    announcement: {
      text: 'YOUR NEXT MATCHDAY STARTS HERE • FAST NATIONWIDE DELIVERY ACROSS BANGLADESH • PREMIUM KITS',
      enabled: true,
    },
    payment_methods: {
      bkash: {
        enabled: true,
        account_number: '01755998844',
        account_type: 'Personal (Send Money)',
        instructions: '1. Send exact total amount to our bKash number.\n2. Note down TrxID.\n3. Submit for quick verification.',
      },
      nagad: {
        enabled: true,
        account_number: '01944332211',
        account_type: 'Personal (Send Money)',
        instructions: '1. Send exact amount to our Nagad number.\n2. Submit TrxID.',
      },
      cod: {
        enabled: true,
        instructions: 'Pay in cash upon physical delivery. Please keep exact change ready.',
      },
    },
    shipping: {
      dhaka_rate_minor: 8000,
      nationwide_rate_minor: 13000,
    },
    contact: {
      phone: '+880 1755 998844',
      whatsapp: '+880 1755 998844',
      email: 'support@jerseyonthego.com',
      location: 'Banani, Dhaka - 1213, Bangladesh',
      hours: 'Saturday – Thursday: 10:00 AM – 10:00 PM',
    },
  };
}

export async function updateAdminSettingsApi(settings: Partial<StoreSettings>): Promise<StoreSettings> {
  try {
    const res = await fetchApi<{ settings?: StoreSettings }>('/admin/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
    if (res.settings) return res.settings;
  } catch {
    // Fallback
  }
  return settings as StoreSettings;
}

