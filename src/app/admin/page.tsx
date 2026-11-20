'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShieldCheck,
  Package,
  CreditCard,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Filter,
  RefreshCw,
  TrendingUp,
  Layers,
  ChevronRight,
  ExternalLink,
  Edit,
  Truck,
  Check,
  AlertTriangle,
  Lock,
  LogOut,
  Eye,
  EyeOff,
  Key,
  Plus,
  Trash2,
  UploadCloud,
  Image as ImageIcon,
  Star,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Trophy,
  Flame,
  Shirt,
  Tag,
  Copy,
  DollarSign,
  Save,
  X,
  Loader2,
} from 'lucide-react';
import {
  getStoredProducts,
  getProductsApi,
  createProductApi,
  updateProductApi,
  deleteProductApi,
  updateVariantStockApi,
  uploadImagesApi,
  getStoredCategories,
  getCategoriesApi,
  createCategoryApi,
  updateCategoryApi,
  deleteCategoryApi,
  getAdminMetricsApi,
  getAdminSettingsApi,
  updateAdminSettingsApi,
} from '@/lib/api';
import {
  INITIAL_ORDERS,
  getStoredOrders,
  adminVerifyPayment,
  adminRejectPayment,
  adminUpdateFulfillment,
} from '@/lib/orders';
import { COLLECTIONS, SHIPPING_ZONES } from '@/lib/data';
import { formatBDT } from '@/lib/currency';
import {
  Product,
  Category,
  Collection,
  Order,
  EditionType,
  ProductImage,
  ProductVariant,
  StoreSettings,
  FulfillmentStatus,
  PaymentStatus,
} from '@/types';

const EDITION_TYPES: EditionType[] = [
  'Fan Edition',
  'Player Edition',
  'Retro',
  'Custom Kit',
  'Training Wear',
  'Accessory',
];

interface FormVariant {
  id?: string;
  size: string;
  color?: string;
  sku: string;
  stockQuantity: number;
}

interface FormImage {
  id?: string;
  imageUrl: string;
  altText: string;
  displayOrder: number;
  isPrimary: boolean;
}

export default function AdminPage() {
  const [mounted, setMounted] = useState(false);

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'categories' | 'orders' | 'settings'>('overview');

  // Core Data States
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [settings, setSettings] = useState<StoreSettings>({});
  const [metrics, setMetrics] = useState<any>({
    totalProducts: 0,
    activeProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    pendingVerifications: 0,
    totalRevenueMinor: 0,
    lowStockCount: 0,
  });

  const [loading, setLoading] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Filters for Products
  const [productSearch, setProductSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [editionFilter, setEditionFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');

  // Filters for Orders
  const [orderSearch, setOrderSearch] = useState('');
  const [orderPaymentFilter, setOrderPaymentFilter] = useState('all');
  const [orderFulfillmentFilter, setOrderFulfillmentFilter] = useState('all');

  // Product Modal (Add/Edit)
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formCategoryId, setFormCategoryId] = useState('');
  const [formCollectionId, setFormCollectionId] = useState('');
  const [formTeamLabel, setFormTeamLabel] = useState('');
  const [formSeason, setFormSeason] = useState('2024/25');
  const [formEditionType, setFormEditionType] = useState<EditionType>('Fan Edition');
  const [formRegularPrice, setFormRegularPrice] = useState('1150');
  const [formSalePrice, setFormSalePrice] = useState('');
  const [formSku, setFormSku] = useState('');
  const [formIsFeatured, setFormIsFeatured] = useState(false);
  const [formIsBestseller, setFormIsBestseller] = useState(false);
  const [formIsNewArrival, setFormIsNewArrival] = useState(true);
  const [formIsActive, setFormIsActive] = useState(true);
  const [formAllowsCustomization, setFormAllowsCustomization] = useState(true);
  const [formCustomizationFee, setFormCustomizationFee] = useState('200');

  const [formImages, setFormImages] = useState<FormImage[]>([]);
  const [urlImageInput, setUrlImageInput] = useState('');
  const [formVariants, setFormVariants] = useState<FormVariant[]>([
    { size: 'S', sku: '', stockQuantity: 10 },
    { size: 'M', sku: '', stockQuantity: 20 },
    { size: 'L', sku: '', stockQuantity: 25 },
    { size: 'XL', sku: '', stockQuantity: 15 },
    { size: 'XXL', sku: '', stockQuantity: 8 },
  ]);
  const [isSavingProduct, setIsSavingProduct] = useState(false);
  const [productFormError, setProductFormError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Category Modal (Add/Edit)
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [catName, setCatName] = useState('');
  const [catSlug, setCatSlug] = useState('');
  const [catDescription, setCatDescription] = useState('');
  const [catDisplayOrder, setCatDisplayOrder] = useState('1');

  // Delete Confirm Modal
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'product' | 'category'; id: string; name: string } | null>(null);

  // Order Action Modals
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  // --------------------------------------------------------------------------
  // Auto Session Check
  // --------------------------------------------------------------------------
  useEffect(() => {
    const checkSession = async () => {
      try {
        const token = sessionStorage.getItem('jotg_admin_token') || localStorage.getItem('jotg_admin_token');
        if (token) {
          const res = await fetch('/api/admin/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token }),
          });
          const data = await res.json();
          if (res.ok && data.valid) {
            setIsAuthenticated(true);
          } else {
            sessionStorage.removeItem('jotg_admin_token');
            localStorage.removeItem('jotg_admin_token');
            setIsAuthenticated(false);
          }
        }
      } catch {
        const token = sessionStorage.getItem('jotg_admin_token');
        if (token) setIsAuthenticated(true);
      }
      setMounted(true);
    };

    checkSession();
  }, []);

  // --------------------------------------------------------------------------
  // Load All Dashboard Data
  // --------------------------------------------------------------------------
  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [fetchedProducts, fetchedCategories, fetchedSettings, fetchedMetrics] = await Promise.all([
        getProductsApi(),
        getCategoriesApi(),
        getAdminSettingsApi(),
        getAdminMetricsApi(),
      ]);

      setProducts(fetchedProducts);
      setCategories(fetchedCategories);
      setSettings(fetchedSettings);
      setMetrics(fetchedMetrics);
      setOrders(getStoredOrders());
    } catch (err: any) {
      console.warn('[Dashboard data load warning]:', err.message);
      setProducts(getStoredProducts());
      setCategories(getStoredCategories());
      setOrders(getStoredOrders());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadDashboardData();
    }
  }, [isAuthenticated]);

  const showBanner = (type: 'success' | 'error', message: string) => {
    setActionFeedback({ type, message });
    setTimeout(() => {
      setActionFeedback(null);
    }, 4500);
  };

  // --------------------------------------------------------------------------
  // Authentication Handlers
  // --------------------------------------------------------------------------
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: adminEmail.trim(),
          password: adminPassword,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success && data.token) {
        setIsAuthenticated(true);
        sessionStorage.setItem('jotg_admin_token', data.token);
        localStorage.setItem('jotg_admin_token', data.token);
        setAdminPassword('');
      } else {
        setLoginError(data.error || 'Invalid administrator email or password.');
      }
    } catch {
      setLoginError('Authentication service unreachable. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('jotg_admin_token');
    localStorage.removeItem('jotg_admin_token');
  };

  // --------------------------------------------------------------------------
  // Product Form Management
  // --------------------------------------------------------------------------
  const openAddProductModal = () => {
    setEditingProductId(null);
    setFormTitle('');
    setFormSlug('');
    setFormDescription('');
    setFormCategoryId(categories[0]?.id || 'cat-1');
    setFormCollectionId(COLLECTIONS[0]?.id || 'col-1');
    setFormTeamLabel('');
    setFormSeason('2024/25');
    setFormEditionType('Fan Edition');
    setFormRegularPrice('1150');
    setFormSalePrice('990');
    const autoSku = `JOTG-KIT-${Date.now().toString().slice(-4)}`;
    setFormSku(autoSku);
    setFormIsFeatured(false);
    setFormIsBestseller(false);
    setFormIsNewArrival(true);
    setFormIsActive(true);
    setFormAllowsCustomization(true);
    setFormCustomizationFee('200');
    setFormImages([
      {
        id: `img-${Date.now()}-1`,
        imageUrl: 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?auto=format&fit=crop&w=800&q=80',
        altText: 'Kit Front View',
        displayOrder: 1,
        isPrimary: true,
      },
    ]);
    setFormVariants([
      { size: 'S', sku: `${autoSku}-S`, stockQuantity: 12 },
      { size: 'M', sku: `${autoSku}-M`, stockQuantity: 20 },
      { size: 'L', sku: `${autoSku}-L`, stockQuantity: 25 },
      { size: 'XL', sku: `${autoSku}-XL`, stockQuantity: 15 },
      { size: 'XXL', sku: `${autoSku}-XXL`, stockQuantity: 8 },
    ]);
    setUrlImageInput('');
    setProductFormError('');
    setIsProductModalOpen(true);
  };

  const openEditProductModal = (product: Product) => {
    setEditingProductId(product.id);
    setFormTitle(product.title);
    setFormSlug(product.slug);
    setFormDescription(product.description || '');
    setFormCategoryId(product.categoryId || categories[0]?.id || 'cat-1');
    setFormCollectionId(product.collectionId || COLLECTIONS[0]?.id || 'col-1');
    setFormTeamLabel(product.teamLabel || '');
    setFormSeason(product.season || '2024/25');
    setFormEditionType(product.editionType);
    setFormRegularPrice((product.regularPriceMinor / 100).toString());
    setFormSalePrice(product.salePriceMinor ? (product.salePriceMinor / 100).toString() : '');
    setFormSku(product.sku);
    setFormIsFeatured(product.isFeatured);
    setFormIsBestseller(product.isBestseller);
    setFormIsNewArrival(product.isNewArrival);
    setFormIsActive(product.isActive);
    setFormAllowsCustomization(product.allowsCustomization);
    setFormCustomizationFee((product.customizationFeeMinor / 100).toString());
    setFormImages(
      product.images.map((img, i) => ({
        id: img.id,
        imageUrl: img.imageUrl,
        altText: img.altText || product.title,
        displayOrder: img.displayOrder || i + 1,
        isPrimary: img.isPrimary,
      }))
    );
    setFormVariants(
      product.variants.map((v) => ({
        id: v.id,
        size: v.size,
        color: v.color,
        sku: v.sku,
        stockQuantity: v.stockQuantity,
      }))
    );
    setUrlImageInput('');
    setProductFormError('');
    setIsProductModalOpen(true);
  };

  const handleTitleChange = (val: string) => {
    setFormTitle(val);
    if (!editingProductId) {
      const generatedSlug = val
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setFormSlug(generatedSlug);
    }
  };

  const handleAddImageUrl = () => {
    if (!urlImageInput.trim()) return;
    const newImg: FormImage = {
      id: `img-${Date.now()}`,
      imageUrl: urlImageInput.trim(),
      altText: formTitle || 'Kit Image',
      displayOrder: formImages.length + 1,
      isPrimary: formImages.length === 0,
    };
    setFormImages([...formImages, newImg]);
    setUrlImageInput('');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const filePayloads: Array<{ data: string; filename: string; contentType: string }> = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
      filePayloads.push({
        data: base64,
        filename: file.name,
        contentType: file.type || 'image/jpeg',
      });
    }

    try {
      const uploaded = await uploadImagesApi(filePayloads);
      const newImages: FormImage[] = uploaded.map((u, i) => ({
        id: `img-up-${Date.now()}-${i}`,
        imageUrl: u.url,
        altText: formTitle || 'Kit Image',
        displayOrder: formImages.length + i + 1,
        isPrimary: formImages.length === 0 && i === 0,
      }));
      setFormImages([...formImages, ...newImages]);
      showBanner('success', `Uploaded ${newImages.length} image(s) successfully.`);
    } catch (err: any) {
      showBanner('error', `Image upload failed: ${err.message}`);
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const setPrimaryImage = (index: number) => {
    setFormImages(
      formImages.map((img, i) => ({
        ...img,
        isPrimary: i === index,
      }))
    );
  };

  const removeImage = (index: number) => {
    const filtered = formImages.filter((_, i) => i !== index);
    if (filtered.length > 0 && !filtered.some((img) => img.isPrimary)) {
      filtered[0].isPrimary = true;
    }
    setFormImages(filtered);
  };

  const handleVariantStockChange = (index: number, stock: number) => {
    const updated = [...formVariants];
    updated[index].stockQuantity = Math.max(0, stock);
    setFormVariants(updated);
  };

  const handleAddCustomSize = () => {
    const sizeName = prompt('Enter Size code (e.g. 3XL, KIDS-24, XS):');
    if (!sizeName) return;
    const cleanSize = sizeName.toUpperCase().trim();
    if (formVariants.some((v) => v.size === cleanSize)) {
      alert('This size is already in the list.');
      return;
    }
    setFormVariants([
      ...formVariants,
      {
        size: cleanSize,
        sku: `${formSku || 'JOTG'}-${cleanSize}`,
        stockQuantity: 10,
      },
    ]);
  };

  const removeVariant = (index: number) => {
    if (formVariants.length <= 1) {
      alert('A product must have at least one size variant.');
      return;
    }
    setFormVariants(formVariants.filter((_, i) => i !== index));
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setProductFormError('');

    if (!formTitle.trim()) {
      setProductFormError('Please enter a product title.');
      return;
    }
    if (!formSku.trim()) {
      setProductFormError('Please provide a unique SKU.');
      return;
    }
    const regMinor = Math.round(parseFloat(formRegularPrice) * 100);
    if (isNaN(regMinor) || regMinor <= 0) {
      setProductFormError('Regular price must be a valid positive number.');
      return;
    }
    const saleMinor = formSalePrice.trim() ? Math.round(parseFloat(formSalePrice) * 100) : null;
    if (saleMinor !== null && (isNaN(saleMinor) || saleMinor >= regMinor)) {
      setProductFormError('Sale price must be lower than the regular price.');
      return;
    }
    if (formImages.length === 0) {
      setProductFormError('Please provide at least one product image or URL.');
      return;
    }
    if (formVariants.length === 0) {
      setProductFormError('At least one size variant is required.');
      return;
    }

    setIsSavingProduct(true);

    const payload: Partial<Product> = {
      title: formTitle.trim(),
      slug: formSlug.trim() || formTitle.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-'),
      description: formDescription.trim(),
      categoryId: formCategoryId,
      collectionId: formCollectionId,
      teamLabel: formTeamLabel.trim(),
      season: formSeason.trim(),
      editionType: formEditionType,
      regularPriceMinor: regMinor,
      salePriceMinor: saleMinor ?? undefined,
      sku: formSku.trim().toUpperCase(),
      isFeatured: formIsFeatured,
      isBestseller: formIsBestseller,
      isNewArrival: formIsNewArrival,
      isActive: formIsActive,
      allowsCustomization: formAllowsCustomization,
      customizationFeeMinor: Math.round(parseFloat(formCustomizationFee || '200') * 100),
      images: formImages.map((img, i) => ({
        id: img.id || `img-${Date.now()}-${i}`,
        productId: editingProductId || '',
        imageUrl: img.imageUrl,
        altText: img.altText || formTitle,
        displayOrder: i + 1,
        isPrimary: img.isPrimary,
      })),
      variants: formVariants.map((v, i) => ({
        id: v.id || `var-${Date.now()}-${i}`,
        productId: editingProductId || '',
        size: v.size,
        color: v.color,
        sku: v.sku || `${formSku}-${v.size}`,
        stockQuantity: Number(v.stockQuantity),
      })),
    };

    try {
      if (editingProductId) {
        const updated = await updateProductApi(editingProductId, payload);
        setProducts((prev) => prev.map((p) => (p.id === editingProductId ? updated : p)));
        showBanner('success', `Kit "${updated.title}" successfully updated.`);
      } else {
        const created = await createProductApi(payload);
        setProducts((prev) => [created, ...prev]);
        showBanner('success', `New Kit "${created.title}" successfully created and published!`);
      }
      setIsProductModalOpen(false);
      loadDashboardData();
    } catch (err: any) {
      setProductFormError(err.message || 'Failed to save product to database.');
    } finally {
      setIsSavingProduct(false);
    }
  };

  const handleToggleProductStatus = async (product: Product) => {
    try {
      const updated = await updateProductApi(product.id, { isActive: !product.isActive });
      setProducts((prev) => prev.map((p) => (p.id === product.id ? updated : p)));
      showBanner('success', `Kit status changed to ${updated.isActive ? 'Active' : 'Draft/Hidden'}.`);
    } catch (err: any) {
      showBanner('error', `Failed to toggle status: ${err.message}`);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      if (deleteTarget.type === 'product') {
        await deleteProductApi(deleteTarget.id);
        setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
        showBanner('success', `Kit "${deleteTarget.name}" deleted.`);
      } else if (deleteTarget.type === 'category') {
        await deleteCategoryApi(deleteTarget.id);
        setCategories((prev) => prev.filter((c) => c.id !== deleteTarget.id));
        showBanner('success', `Category "${deleteTarget.name}" deleted.`);
      }
    } catch (err: any) {
      showBanner('error', `Failed to delete: ${err.message}`);
    } finally {
      setDeleteTarget(null);
    }
  };

  // --------------------------------------------------------------------------
  // Category Management Handlers
  // --------------------------------------------------------------------------
  const openAddCategoryModal = () => {
    setEditingCategory(null);
    setCatName('');
    setCatSlug('');
    setCatDescription('');
    setCatDisplayOrder((categories.length + 1).toString());
    setIsCategoryModalOpen(true);
  };

  const openEditCategoryModal = (cat: Category) => {
    setEditingCategory(cat);
    setCatName(cat.name);
    setCatSlug(cat.slug);
    setCatDescription(cat.description || '');
    setCatDisplayOrder(cat.displayOrder.toString());
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) return;

    try {
      const payload: Partial<Category> = {
        name: catName.trim(),
        slug: catSlug.trim() || catName.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-'),
        description: catDescription.trim(),
        displayOrder: parseInt(catDisplayOrder, 10) || 1,
      };

      if (editingCategory) {
        const updated = await updateCategoryApi(editingCategory.id, payload);
        setCategories((prev) => prev.map((c) => (c.id === editingCategory.id ? updated : c)));
        showBanner('success', `Category "${updated.name}" updated.`);
      } else {
        const created = await createCategoryApi(payload);
        setCategories((prev) => [...prev, created]);
        showBanner('success', `Category "${created.name}" created.`);
      }
      setIsCategoryModalOpen(false);
    } catch (err: any) {
      showBanner('error', `Category save error: ${err.message}`);
    }
  };

  // --------------------------------------------------------------------------
  // Order & Payment Verification Handlers
  // --------------------------------------------------------------------------
  const handleVerifyPayment = (orderId: string) => {
    const updated = adminVerifyPayment(orderId, 'Verified by Admin via Control Room');
    if (updated) {
      setOrders(getStoredOrders());
      showBanner('success', `Payment for Order ${updated.orderNumber} successfully verified!`);
      loadDashboardData();
    }
  };

  const handleRejectPayment = () => {
    if (!selectedOrder) return;
    const updated = adminRejectPayment(selectedOrder.id, rejectReason || 'TrxID verification invalid or mismatched.');
    if (updated) {
      setOrders(getStoredOrders());
      showBanner('error', `Payment for ${updated.orderNumber} rejected.`);
      setIsRejectModalOpen(false);
      setSelectedOrder(null);
      setRejectReason('');
      loadDashboardData();
    }
  };

  const handleFulfillmentChange = (orderId: string, status: FulfillmentStatus) => {
    const updated = adminUpdateFulfillment(orderId, status);
    if (updated) {
      setOrders(getStoredOrders());
      showBanner('success', `Order ${updated.orderNumber} status changed to ${status.replace('_', ' ')}.`);
    }
  };

  // --------------------------------------------------------------------------
  // Filtered Lists
  // --------------------------------------------------------------------------
  const filteredProducts = products.filter((p) => {
    if (categoryFilter !== 'all' && p.categoryId !== categoryFilter) return false;
    if (editionFilter !== 'all' && p.editionType !== editionFilter) return false;
    if (stockFilter === 'in_stock') {
      const totalStock = p.variants.reduce((sum, v) => sum + v.stockQuantity, 0);
      if (totalStock === 0) return false;
    }
    if (stockFilter === 'out_of_stock') {
      const totalStock = p.variants.reduce((sum, v) => sum + v.stockQuantity, 0);
      if (totalStock > 0) return false;
    }
    if (stockFilter === 'low_stock') {
      const totalStock = p.variants.reduce((sum, v) => sum + v.stockQuantity, 0);
      if (totalStock > 10 || totalStock === 0) return false;
    }
    if (productSearch.trim()) {
      const q = productSearch.toLowerCase().trim();
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchSku = p.sku.toLowerCase().includes(q);
      const matchTeam = p.teamLabel?.toLowerCase().includes(q);
      if (!matchTitle && !matchSku && !matchTeam) return false;
    }
    return true;
  });

  const filteredOrders = orders.filter((o) => {
    if (orderPaymentFilter !== 'all' && o.paymentStatus !== orderPaymentFilter) return false;
    if (orderFulfillmentFilter !== 'all' && o.fulfillmentStatus !== orderFulfillmentFilter) return false;
    if (orderSearch.trim()) {
      const q = orderSearch.toLowerCase().trim();
      const matchNum = o.orderNumber.toLowerCase().includes(q);
      const matchPhone = o.customerPhone.includes(q);
      const matchName = o.customerName.toLowerCase().includes(q);
      const matchTrx = o.paymentRecord?.transactionId?.toLowerCase().includes(q);
      if (!matchNum && !matchPhone && !matchName && !matchTrx) return false;
    }
    return true;
  });

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#090F21] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#176B43] animate-spin" />
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // ADMIN LOGIN VIEW
  // --------------------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#090F21] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#101D40]/90 border border-slate-700/80 rounded-xl p-8 shadow-2xl backdrop-blur-md">
          <div className="text-center mb-8">
            <div className="inline-flex p-3 rounded-full bg-[#176B43]/20 border border-[#176B43]/40 text-[#176B43] mb-4">
              <Lock className="w-8 h-8 text-[#F5E8C9]" />
            </div>
            <h1 className="text-2xl font-black uppercase text-white tracking-tight">
              JOTG <span className="text-[#F5E8C9]">CONTROL ROOM</span>
            </h1>
            <p className="text-xs uppercase tracking-widest text-[#176B43] font-bold mt-1">
              JERSEY ON THE GO — WEAR IT. OWN IT.
            </p>
            <p className="text-slate-400 text-xs mt-2 font-mono">
              Restricted Area: Authorized administrative personnel only.
            </p>
          </div>

          {loginError && (
            <div className="mb-6 p-4 rounded-lg bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-3">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                Admin Email
              </label>
              <input
                type="email"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="admin@jerseyonthego.com"
                className="w-full bg-[#090F21] border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#176B43] font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                Security Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#090F21] border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#176B43] font-mono pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3 bg-[#176B43] hover:bg-[#1FA365] text-white font-black text-xs uppercase tracking-widest rounded-lg transition-colors flex items-center justify-center gap-2 mt-2 shadow-lg shadow-[#176B43]/20"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <Key className="w-4 h-4 text-[#F5E8C9]" />
                  <span>Access Control Room</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-800 text-center">
            <Link href="/" className="text-xs text-slate-400 hover:text-white flex items-center justify-center gap-1">
              <span>← Return to Public Storefront</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // AUTHENTICATED ADMIN DASHBOARD
  // --------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#090F21] text-slate-200">
      {/* Feedback Banner */}
      {actionFeedback && (
        <div
          className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 border ${
            actionFeedback.type === 'success'
              ? 'bg-[#101D40] border-[#176B43] text-white'
              : 'bg-red-950 border-red-500 text-red-200'
          }`}
        >
          {actionFeedback.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-[#176B43]" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-red-400" />
          )}
          <span className="text-sm font-semibold">{actionFeedback.message}</span>
        </div>
      )}

      {/* Top Header */}
      <header className="border-b border-slate-800 bg-[#101D40]/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#176B43] animate-pulse"></span>
              <span className="text-lg font-black tracking-tight text-white uppercase font-mono">
                JOTG <span className="text-[#F5E8C9]">ADMIN</span>
              </span>
            </Link>
            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-widest bg-[#176B43]/20 border border-[#176B43]/40 text-[#176B43]">
              WEAR IT. OWN IT.
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/products"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-800/80 hover:bg-slate-700 text-xs font-bold uppercase tracking-wider text-slate-300 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#F5E8C9]" />
              <span>Storefront</span>
            </Link>

            <button
              onClick={loadDashboardData}
              disabled={loading}
              className="p-1.5 rounded-md bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#176B43]' : ''}`} />
            </button>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-red-950/40 hover:bg-red-900/60 border border-red-800/40 text-red-300 text-xs font-bold uppercase tracking-wider transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex overflow-x-auto border-t border-slate-800/60 gap-1 sm:gap-2">
          {[
            { id: 'overview', label: 'Overview', icon: TrendingUp },
            { id: 'products', label: 'Products & Kits', icon: Shirt, badge: products.length },
            { id: 'categories', label: 'Categories', icon: Tag, badge: categories.length },
            {
              id: 'orders',
              label: 'Orders & Payments',
              icon: CreditCard,
              badge: orders.filter((o) => o.paymentStatus === 'verification_pending').length,
            },
            { id: 'settings', label: 'Store Settings', icon: Layers },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-3 px-3 sm:px-4 text-xs font-bold uppercase tracking-wider border-b-2 whitespace-nowrap transition-colors ${
                  active
                    ? 'border-[#176B43] text-white bg-[#090F21]/40'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/20'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-[#176B43]' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span
                    className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                      tab.id === 'orders'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* =================================================================== */}
        {/* TAB 1: OVERVIEW */}
        {/* =================================================================== */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="bg-[#101D40]/80 border border-slate-800 p-5 rounded-xl shadow-lg">
                <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
                  <span>Total Revenue</span>
                  <DollarSign className="w-4 h-4 text-[#176B43]" />
                </div>
                <div className="text-2xl font-black text-white font-mono">
                  {formatBDT(metrics.totalRevenueMinor || 0)}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">Confirmed & Verified Orders</div>
              </div>

              <div className="bg-[#101D40]/80 border border-slate-800 p-5 rounded-xl shadow-lg">
                <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
                  <span>Total Orders</span>
                  <Package className="w-4 h-4 text-[#F5E8C9]" />
                </div>
                <div className="text-2xl font-black text-white font-mono">{orders.length}</div>
                <div className="text-[11px] text-slate-400 mt-1">{orders.filter(o => o.fulfillmentStatus === 'delivered').length} Delivered</div>
              </div>

              <div className="bg-[#101D40]/80 border border-slate-800 p-5 rounded-xl shadow-lg">
                <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
                  <span>Active Kits</span>
                  <Shirt className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-black text-white font-mono">
                  {products.filter((p) => p.isActive).length} <span className="text-xs text-slate-400">/ {products.length}</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1">Live on Storefront</div>
              </div>

              <div className="bg-[#101D40]/80 border border-amber-900/40 p-5 rounded-xl shadow-lg">
                <div className="flex items-center justify-between text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
                  <span>Pending Trx</span>
                  <Clock className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl font-black text-amber-200 font-mono">
                  {orders.filter((o) => o.paymentStatus === 'verification_pending').length}
                </div>
                <div className="text-[11px] text-amber-400/80 mt-1">bKash / Nagad to verify</div>
              </div>

              <div className="bg-[#101D40]/80 border border-slate-800 p-5 rounded-xl shadow-lg">
                <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
                  <span>Low Stock Alert</span>
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                </div>
                <div className="text-2xl font-black text-rose-300 font-mono">
                  {products.filter((p) => p.variants.reduce((s, v) => s + v.stockQuantity, 0) <= 10).length}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">Kits with &le; 10 units</div>
              </div>
            </div>

            {/* Quick Action Bar */}
            <div className="flex flex-wrap items-center gap-3 bg-[#101D40]/40 border border-slate-800 p-4 rounded-xl">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Quick Actions:</span>
              <button
                onClick={openAddProductModal}
                className="px-4 py-2 bg-[#176B43] hover:bg-[#1FA365] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Jersey</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab('orders');
                  setOrderPaymentFilter('verification_pending');
                }}
                className="px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Verify bKash / Nagad Payments</span>
              </button>
              <button
                onClick={() => setActiveTab('categories')}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Tag className="w-4 h-4" />
                <span>Manage Categories</span>
              </button>
            </div>

            {/* Recent Orders Overview */}
            <div className="bg-[#101D40]/60 border border-slate-800 rounded-xl overflow-hidden">
              <div className="p-5 border-b border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black uppercase text-white tracking-wider">Latest Matchday Orders</h3>
                  <p className="text-xs text-slate-400">Incoming orders from fans across Bangladesh</p>
                </div>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs font-bold uppercase tracking-wider text-[#F5E8C9] hover:text-white flex items-center gap-1"
                >
                  <span>View All Orders</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#090F21]/80 text-slate-400 uppercase tracking-wider border-b border-slate-800 text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Order #</th>
                      <th className="py-3 px-4">Customer</th>
                      <th className="py-3 px-4">Payment</th>
                      <th className="py-3 px-4">Total</th>
                      <th className="py-3 px-4">Fulfillment</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono">
                    {orders.slice(0, 5).map((order) => (
                      <tr key={order.id} className="hover:bg-slate-800/30">
                        <td className="py-3.5 px-4 font-bold text-white">{order.orderNumber}</td>
                        <td className="py-3.5 px-4">
                          <div className="font-sans font-semibold text-slate-200">{order.customerName}</div>
                          <div className="text-[11px] text-slate-400">{order.customerPhone} • {order.cityDistrict}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            order.paymentStatus === 'paid'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : order.paymentStatus === 'verification_pending'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              : 'bg-slate-800 text-slate-400'
                          }`}>
                            {order.paymentMethod.toUpperCase()} — {order.paymentStatus.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-[#F5E8C9]">
                          {formatBDT(order.totalMinor)}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded text-[10px] font-sans font-bold uppercase tracking-wider bg-slate-800 text-slate-300">
                            {order.fulfillmentStatus.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          {order.paymentStatus === 'verification_pending' ? (
                            <button
                              onClick={() => handleVerifyPayment(order.id)}
                              className="px-2.5 py-1 bg-[#176B43] hover:bg-[#1FA365] text-white text-[11px] font-bold uppercase rounded font-sans"
                            >
                              Verify
                            </button>
                          ) : (
                            <button
                              onClick={() => setActiveTab('orders')}
                              className="text-xs text-slate-400 hover:text-white font-sans"
                            >
                              Details
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 2: PRODUCTS (FULL CRUD) */}
        {/* =================================================================== */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            {/* Header & Controls */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black uppercase text-white tracking-tight">Kit Catalog Management</h2>
                <p className="text-xs text-slate-400">
                  Total {products.length} jerseys recorded • {products.filter((p) => p.isActive).length} published on storefront
                </p>
              </div>

              <button
                onClick={openAddProductModal}
                className="px-5 py-2.5 bg-[#176B43] hover:bg-[#1FA365] text-white font-black text-xs uppercase tracking-widest rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-[#176B43]/20"
              >
                <Plus className="w-4 h-4 text-[#F5E8C9]" />
                <span>Add New Jersey</span>
              </button>
            </div>

            {/* Filter Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-[#101D40]/60 p-4 rounded-xl border border-slate-800">
              {/* Search */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search by title, SKU, team..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full bg-[#090F21] border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#176B43]"
                />
              </div>

              {/* Category Filter */}
              <div>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full bg-[#090F21] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#176B43]"
                >
                  <option value="all">All Categories</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Edition Type */}
              <div>
                <select
                  value={editionFilter}
                  onChange={(e) => setEditionFilter(e.target.value)}
                  className="w-full bg-[#090F21] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#176B43]"
                >
                  <option value="all">All Edition Types</option>
                  {EDITION_TYPES.map((ed) => (
                    <option key={ed} value={ed}>
                      {ed}
                    </option>
                  ))}
                </select>
              </div>

              {/* Stock Status */}
              <div>
                <select
                  value={stockFilter}
                  onChange={(e) => setStockFilter(e.target.value)}
                  className="w-full bg-[#090F21] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#176B43]"
                >
                  <option value="all">All Stock Statuses</option>
                  <option value="in_stock">In Stock (&gt; 0)</option>
                  <option value="low_stock">Low Stock (&le; 10)</option>
                  <option value="out_of_stock">Out of Stock (0)</option>
                </select>
              </div>
            </div>

            {/* Products Table */}
            <div className="bg-[#101D40]/80 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#090F21] text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Jersey</th>
                      <th className="py-3 px-4">SKU & Edition</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Price</th>
                      <th className="py-3 px-4">Total Stock</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-slate-500 font-mono">
                          No kits found matching your search and filter criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map((p) => {
                        const primaryImg = p.images.find((img) => img.isPrimary)?.imageUrl || p.images[0]?.imageUrl || '';
                        const totalStock = p.variants.reduce((sum, v) => sum + v.stockQuantity, 0);
                        const categoryName = categories.find((c) => c.id === p.categoryId)?.name || 'General';

                        return (
                          <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                            {/* Jersey Thumbnail & Title */}
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-14 bg-slate-900 rounded-md overflow-hidden relative shrink-0 border border-slate-700">
                                  {primaryImg ? (
                                    <img src={primaryImg} alt={p.title} className="w-full h-full object-cover" />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-600">
                                      <ImageIcon className="w-4 h-4" />
                                    </div>
                                  )}
                                </div>
                                <div>
                                  <Link
                                    href={`/products/${p.slug}`}
                                    target="_blank"
                                    className="font-bold text-white hover:text-[#F5E8C9] transition-colors"
                                  >
                                    {p.title}
                                  </Link>
                                  <div className="text-[11px] text-slate-400 font-mono">
                                    {p.teamLabel || 'Club'} • {p.season || '2024/25'}
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* SKU & Edition */}
                            <td className="py-3.5 px-4 font-mono">
                              <div className="text-slate-200 font-semibold">{p.sku}</div>
                              <span className="inline-block px-1.5 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 mt-0.5">
                                {p.editionType}
                              </span>
                            </td>

                            {/* Category */}
                            <td className="py-3.5 px-4">
                              <span className="text-slate-300">{categoryName}</span>
                            </td>

                            {/* Price */}
                            <td className="py-3.5 px-4 font-mono">
                              {p.salePriceMinor ? (
                                <div>
                                  <span className="text-[#F5E8C9] font-bold">{formatBDT(p.salePriceMinor)}</span>
                                  <span className="text-slate-500 line-through text-[11px] block">
                                    {formatBDT(p.regularPriceMinor)}
                                  </span>
                                </div>
                              ) : (
                                <span className="text-white font-bold">{formatBDT(p.regularPriceMinor)}</span>
                              )}
                            </td>

                            {/* Total Stock */}
                            <td className="py-3.5 px-4 font-mono">
                              <span
                                className={`px-2 py-0.5 rounded text-xs font-bold ${
                                  totalStock === 0
                                    ? 'bg-rose-950/60 text-rose-300 border border-rose-800'
                                    : totalStock <= 10
                                    ? 'bg-amber-950/60 text-amber-300 border border-amber-800'
                                    : 'bg-emerald-950/60 text-emerald-300 border border-emerald-800'
                                }`}
                              >
                                {totalStock} units
                              </span>
                              <div className="text-[10px] text-slate-500 mt-1">
                                {p.variants.map((v) => `${v.size}:${v.stockQuantity}`).join(' ')}
                              </div>
                            </td>

                            {/* Published / Active Switch */}
                            <td className="py-3.5 px-4">
                              <button
                                onClick={() => handleToggleProductStatus(p)}
                                className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition-colors ${
                                  p.isActive
                                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                }`}
                              >
                                {p.isActive ? (
                                  <>
                                    <Check className="w-3 h-3" />
                                    <span>Active</span>
                                  </>
                                ) : (
                                  <>
                                    <X className="w-3 h-3" />
                                    <span>Draft</span>
                                  </>
                                )}
                              </button>
                            </td>

                            {/* Actions */}
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Link
                                  href={`/products/${p.slug}`}
                                  target="_blank"
                                  className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                                  title="View on Storefront"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </Link>
                                <button
                                  onClick={() => openEditProductModal(p)}
                                  className="p-1.5 rounded bg-slate-800 hover:bg-[#176B43] text-slate-300 hover:text-white transition-colors"
                                  title="Edit Kit"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => setDeleteTarget({ type: 'product', id: p.id, name: p.title })}
                                  className="p-1.5 rounded bg-slate-800 hover:bg-red-900 text-slate-300 hover:text-red-200 transition-colors"
                                  title="Delete Kit"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 3: CATEGORIES */}
        {/* =================================================================== */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black uppercase text-white tracking-tight">Category Management</h2>
                <p className="text-xs text-slate-400">Organize kits by category, club, or collection</p>
              </div>
              <button
                onClick={openAddCategoryModal}
                className="px-4 py-2 bg-[#176B43] hover:bg-[#1FA365] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Category</span>
              </button>
            </div>

            <div className="bg-[#101D40]/80 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#090F21] text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Order</th>
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Slug</th>
                    <th className="py-3 px-4">Description</th>
                    <th className="py-3 px-4">Total Kits</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {categories.map((cat) => {
                    const count = products.filter((p) => p.categoryId === cat.id).length;
                    return (
                      <tr key={cat.id} className="hover:bg-slate-800/40">
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-400">{cat.displayOrder}</td>
                        <td className="py-3.5 px-4 font-bold text-white">{cat.name}</td>
                        <td className="py-3.5 px-4 font-mono text-slate-400">{cat.slug}</td>
                        <td className="py-3.5 px-4 text-slate-400 max-w-xs truncate">{cat.description}</td>
                        <td className="py-3.5 px-4 font-mono font-bold text-[#F5E8C9]">{count}</td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => openEditCategoryModal(cat)}
                              className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setDeleteTarget({ type: 'category', id: cat.id, name: cat.name })}
                              className="p-1.5 rounded bg-slate-800 hover:bg-red-900 text-slate-300 hover:text-red-200"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 4: ORDERS & PAYMENT VERIFICATION */}
        {/* =================================================================== */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black uppercase text-white tracking-tight">Orders & Trx Verification</h2>
                <p className="text-xs text-slate-400">
                  Verify bKash / Nagad Transaction IDs, manage fulfillment, and print slips
                </p>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#101D40]/60 p-4 rounded-xl border border-slate-800">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search by order #, phone, TrxID..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="w-full bg-[#090F21] border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#176B43]"
                />
              </div>

              <div>
                <select
                  value={orderPaymentFilter}
                  onChange={(e) => setOrderPaymentFilter(e.target.value)}
                  className="w-full bg-[#090F21] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#176B43]"
                >
                  <option value="all">All Payment Statuses</option>
                  <option value="verification_pending">Pending Verification (bKash/Nagad)</option>
                  <option value="paid">Paid & Confirmed</option>
                  <option value="unpaid">Unpaid (COD)</option>
                  <option value="rejected">Rejected Trx</option>
                </select>
              </div>

              <div>
                <select
                  value={orderFulfillmentFilter}
                  onChange={(e) => setOrderFulfillmentFilter(e.target.value)}
                  className="w-full bg-[#090F21] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#176B43]"
                >
                  <option value="all">All Fulfillment Stages</option>
                  <option value="pending_confirmation">Pending Confirmation</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-[#101D40]/80 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#090F21] text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Order Info</th>
                      <th className="py-3 px-4">Customer & Delivery</th>
                      <th className="py-3 px-4">Kits / Items</th>
                      <th className="py-3 px-4">Payment & TrxID</th>
                      <th className="py-3 px-4">Fulfillment</th>
                      <th className="py-3 px-4 text-right">Verification</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 font-mono">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-slate-500">
                          No orders found matching criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((order) => {
                        const hasTrx = Boolean(order.paymentRecord?.transactionId);
                        const isPending = order.paymentStatus === 'verification_pending';

                        return (
                          <tr key={order.id} className="hover:bg-slate-800/40">
                            {/* Order Info */}
                            <td className="py-3.5 px-4">
                              <div className="font-bold text-white">{order.orderNumber}</div>
                              <div className="text-[10px] text-slate-400 font-sans">
                                {new Date(order.createdAt).toLocaleDateString()} at{' '}
                                {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </div>
                              <Link
                                href={`/track/${order.trackingToken}`}
                                target="_blank"
                                className="text-[10px] text-[#F5E8C9] hover:underline flex items-center gap-1 mt-1 font-sans"
                              >
                                <span>Track Link</span>
                                <ExternalLink className="w-3 h-3" />
                              </Link>
                            </td>

                            {/* Customer & Address */}
                            <td className="py-3.5 px-4 font-sans">
                              <div className="font-bold text-slate-200">{order.customerName}</div>
                              <div className="text-slate-400 font-mono text-[11px]">{order.customerPhone}</div>
                              <div className="text-slate-400 text-[11px] truncate max-w-xs">
                                {order.deliveryAddress}, {order.cityDistrict}
                              </div>
                            </td>

                            {/* Items */}
                            <td className="py-3.5 px-4 font-sans">
                              <div className="space-y-1">
                                {order.items?.map((it, i) => (
                                  <div key={i} className="text-[11px] text-slate-300">
                                    • {it.productTitleSnapshot} ({it.sizeSnapshot}) x {it.quantity}
                                    {it.customizationDetails?.playerName && (
                                      <span className="block text-[10px] text-[#F5E8C9] font-mono">
                                        Custom: {it.customizationDetails.playerName} #{it.customizationDetails.playerNumber}
                                      </span>
                                    )}
                                  </div>
                                ))}
                              </div>
                              <div className="font-mono font-bold text-[#F5E8C9] mt-1">
                                Total: {formatBDT(order.totalMinor)}
                              </div>
                            </td>

                            {/* Payment Record & TrxID */}
                            <td className="py-3.5 px-4">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                  order.paymentStatus === 'paid'
                                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                    : order.paymentStatus === 'verification_pending'
                                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                    : 'bg-slate-800 text-slate-400'
                                }`}
                              >
                                {order.paymentMethod.toUpperCase()} — {order.paymentStatus.replace('_', ' ')}
                              </span>

                              {hasTrx && (
                                <div className="mt-1.5 p-1.5 bg-[#090F21] rounded border border-slate-700/80">
                                  <div className="text-[10px] text-slate-400 uppercase tracking-wider">TrxID:</div>
                                  <div className="font-bold text-white text-xs tracking-wider flex items-center justify-between">
                                    <span>{order.paymentRecord?.transactionId}</span>
                                    <button
                                      onClick={() => {
                                        navigator.clipboard.writeText(order.paymentRecord?.transactionId || '');
                                        showBanner('success', 'TrxID copied to clipboard.');
                                      }}
                                      className="p-1 hover:text-[#F5E8C9]"
                                      title="Copy TrxID"
                                    >
                                      <Copy className="w-3 h-3" />
                                    </button>
                                  </div>
                                  <div className="text-[10px] text-slate-400">
                                    Sender: {order.paymentRecord?.senderPhone || order.customerPhone}
                                  </div>
                                </div>
                              )}
                            </td>

                            {/* Fulfillment Selector */}
                            <td className="py-3.5 px-4">
                              <select
                                value={order.fulfillmentStatus}
                                onChange={(e) => handleFulfillmentChange(order.id, e.target.value as FulfillmentStatus)}
                                className="bg-[#090F21] border border-slate-700 rounded px-2.5 py-1 text-xs text-white focus:outline-none focus:border-[#176B43]"
                              >
                                <option value="pending_confirmation">Pending Conf.</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="processing">Processing</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            </td>

                            {/* Actions / Verify */}
                            <td className="py-3.5 px-4 text-right font-sans">
                              {isPending ? (
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => handleVerifyPayment(order.id)}
                                    className="px-2.5 py-1 bg-[#176B43] hover:bg-[#1FA365] text-white text-xs font-bold uppercase rounded"
                                  >
                                    Accept Trx
                                  </button>
                                  <button
                                    onClick={() => {
                                      setSelectedOrder(order);
                                      setIsRejectModalOpen(true);
                                    }}
                                    className="px-2 py-1 bg-red-950/60 hover:bg-red-900 border border-red-800 text-red-200 text-xs font-bold uppercase rounded"
                                  >
                                    Reject
                                  </button>
                                </div>
                              ) : (
                                <span className="text-[11px] text-slate-400">
                                  {order.paymentStatus === 'paid' ? 'Verified' : 'COD'}
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 5: STORE SETTINGS */}
        {/* =================================================================== */}
        {activeTab === 'settings' && (
          <div className="space-y-6 max-w-4xl">
            <div>
              <h2 className="text-xl font-black uppercase text-white tracking-tight">Store Settings & Payment Gateways</h2>
              <p className="text-xs text-slate-400">Configure bKash, Nagad, announcements, and delivery rates</p>
            </div>

            <div className="bg-[#101D40]/80 border border-slate-800 rounded-xl p-6 space-y-6">
              {/* Announcement Bar */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-white">
                    Announcement Banner Strip
                  </label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.announcement?.enabled !== false}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          announcement: {
                            text: settings.announcement?.text || '',
                            enabled: e.target.checked,
                          },
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#176B43]"></div>
                  </label>
                </div>
                <input
                  type="text"
                  value={settings.announcement?.text || ''}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      announcement: {
                        enabled: settings.announcement?.enabled !== false,
                        text: e.target.value,
                      },
                    })
                  }
                  className="w-full bg-[#090F21] border border-slate-700 rounded-lg px-4 py-2.5 text-xs text-white"
                />
              </div>

              {/* bKash Details */}
              <div className="pt-6 border-t border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase tracking-wider text-pink-400">bKash Account Details</h4>
                  <span className="text-[10px] bg-pink-500/20 text-pink-300 px-2 py-0.5 rounded border border-pink-500/40">
                    Personal (Send Money)
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] text-slate-400 uppercase font-mono mb-1">
                      bKash Number
                    </label>
                    <input
                      type="text"
                      value={settings.payment_methods?.bkash?.account_number || '01755998844'}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          payment_methods: {
                            ...settings.payment_methods!,
                            bkash: {
                              ...settings.payment_methods?.bkash!,
                              account_number: e.target.value,
                            },
                          },
                        })
                      }
                      className="w-full bg-[#090F21] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 uppercase font-mono mb-1">
                      Account Type
                    </label>
                    <input
                      type="text"
                      value={settings.payment_methods?.bkash?.account_type || 'Personal (Send Money)'}
                      className="w-full bg-[#090F21] border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-300 font-mono"
                      readOnly
                    />
                  </div>
                </div>
              </div>

              {/* Nagad Details */}
              <div className="pt-6 border-t border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase tracking-wider text-orange-400">Nagad Account Details</h4>
                  <span className="text-[10px] bg-orange-500/20 text-orange-300 px-2 py-0.5 rounded border border-orange-500/40">
                    Personal (Send Money)
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] text-slate-400 uppercase font-mono mb-1">
                      Nagad Number
                    </label>
                    <input
                      type="text"
                      value={settings.payment_methods?.nagad?.account_number || '01944332211'}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          payment_methods: {
                            ...settings.payment_methods!,
                            nagad: {
                              ...settings.payment_methods?.nagad!,
                              account_number: e.target.value,
                            },
                          },
                        })
                      }
                      className="w-full bg-[#090F21] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 uppercase font-mono mb-1">
                      Account Type
                    </label>
                    <input
                      type="text"
                      value={settings.payment_methods?.nagad?.account_type || 'Personal (Send Money)'}
                      className="w-full bg-[#090F21] border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-300 font-mono"
                      readOnly
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Rates */}
              <div className="pt-6 border-t border-slate-800 space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-[#F5E8C9]">Delivery Zone Rates</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono">
                  <div>
                    <label className="block text-[11px] text-slate-400 uppercase mb-1">
                      Inside Dhaka City (BDT)
                    </label>
                    <input
                      type="number"
                      value={settings.shipping?.dhaka_rate_minor ? settings.shipping.dhaka_rate_minor / 100 : 80}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          shipping: {
                            dhaka_rate_minor: Number(e.target.value) * 100,
                            nationwide_rate_minor: settings.shipping?.nationwide_rate_minor || 13000,
                          },
                        })
                      }
                      className="w-full bg-[#090F21] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 uppercase mb-1">
                      Outside Dhaka / Nationwide (BDT)
                    </label>
                    <input
                      type="number"
                      value={settings.shipping?.nationwide_rate_minor ? settings.shipping.nationwide_rate_minor / 100 : 130}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          shipping: {
                            dhaka_rate_minor: settings.shipping?.dhaka_rate_minor || 8000,
                            nationwide_rate_minor: Number(e.target.value) * 100,
                          },
                        })
                      }
                      className="w-full bg-[#090F21] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-800 flex justify-end">
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await updateAdminSettingsApi(settings);
                      showBanner('success', 'Store settings successfully saved!');
                    } catch (err: any) {
                      showBanner('error', `Settings save failed: ${err.message}`);
                    }
                  }}
                  className="px-6 py-2.5 bg-[#176B43] hover:bg-[#1FA365] text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save All Settings</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* =================================================================== */}
      {/* MODAL: ADD / EDIT PRODUCT */}
      {/* =================================================================== */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#101D40] border border-slate-700 rounded-xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded bg-[#176B43]/20 border border-[#176B43]/40 text-[#176B43]">
                  <Shirt className="w-5 h-5 text-[#F5E8C9]" />
                </div>
                <div>
                  <h3 className="text-base font-black uppercase text-white tracking-tight">
                    {editingProductId ? 'Edit Football Kit' : 'Add New Football Kit'}
                  </h3>
                  <p className="text-xs text-slate-400">Configure jersey details, edition, photos, and size inventory</p>
                </div>
              </div>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveProduct} className="p-6 overflow-y-auto space-y-6 flex-1">
              {productFormError && (
                <div className="p-4 rounded-lg bg-red-950/70 border border-red-500/40 text-red-200 text-xs flex items-center gap-3">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{productFormError}</span>
                </div>
              )}

              {/* 1. Basic Info */}
              <div className="space-y-4">
                <h4 className="text-xs font-black uppercase tracking-wider text-[#F5E8C9]">1. Kit Information</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-300 mb-1">
                      Kit Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={formTitle}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      placeholder="e.g. Real Madrid 2024/25 Home Jersey"
                      className="w-full bg-[#090F21] border border-slate-700 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#176B43]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-300 mb-1">
                      URL Slug *
                    </label>
                    <input
                      type="text"
                      required
                      value={formSlug}
                      onChange={(e) => setFormSlug(e.target.value)}
                      placeholder="real-madrid-2024-25-home-jersey"
                      className="w-full bg-[#090F21] border border-slate-700 rounded-lg px-3.5 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#176B43]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-300 mb-1">
                      Club / National Team *
                    </label>
                    <input
                      type="text"
                      required
                      value={formTeamLabel}
                      onChange={(e) => setFormTeamLabel(e.target.value)}
                      placeholder="e.g. Real Madrid, Argentina"
                      className="w-full bg-[#090F21] border border-slate-700 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#176B43]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-300 mb-1">
                      Season
                    </label>
                    <input
                      type="text"
                      value={formSeason}
                      onChange={(e) => setFormSeason(e.target.value)}
                      placeholder="2024/25"
                      className="w-full bg-[#090F21] border border-slate-700 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#176B43]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-300 mb-1">
                      Edition Type *
                    </label>
                    <select
                      value={formEditionType}
                      onChange={(e) => setFormEditionType(e.target.value as EditionType)}
                      className="w-full bg-[#090F21] border border-slate-700 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#176B43]"
                    >
                      {EDITION_TYPES.map((ed) => (
                        <option key={ed} value={ed}>
                          {ed}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">
                    Description & Specifications
                  </label>
                  <textarea
                    rows={3}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Enter fabric specifications, crest embroidery details, AEROREADY/HEAT.RDY weave info..."
                    className="w-full bg-[#090F21] border border-slate-700 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#176B43]"
                  />
                </div>
              </div>

              {/* 2. Classification & Pricing */}
              <div className="space-y-4 pt-4 border-t border-slate-800">
                <h4 className="text-xs font-black uppercase tracking-wider text-[#F5E8C9]">2. Category, SKU & Pricing</h4>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-300 mb-1">
                      Category *
                    </label>
                    <select
                      value={formCategoryId}
                      onChange={(e) => setFormCategoryId(e.target.value)}
                      className="w-full bg-[#090F21] border border-slate-700 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#176B43]"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-300 mb-1">
                      Base SKU *
                    </label>
                    <input
                      type="text"
                      required
                      value={formSku}
                      onChange={(e) => setFormSku(e.target.value.toUpperCase())}
                      placeholder="JOTG-RM-2425-H"
                      className="w-full bg-[#090F21] border border-slate-700 rounded-lg px-3.5 py-2 text-xs text-white font-mono uppercase focus:outline-none focus:border-[#176B43]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-300 mb-1">
                      Regular Price (৳ BDT) *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formRegularPrice}
                      onChange={(e) => setFormRegularPrice(e.target.value)}
                      placeholder="1150"
                      className="w-full bg-[#090F21] border border-slate-700 rounded-lg px-3.5 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#176B43]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-300 mb-1">
                      Sale Price (৳ BDT optional)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formSalePrice}
                      onChange={(e) => setFormSalePrice(e.target.value)}
                      placeholder="990"
                      className="w-full bg-[#090F21] border border-slate-700 rounded-lg px-3.5 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#176B43]"
                    />
                  </div>
                </div>

                {/* Customization & Flags */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#090F21] p-4 rounded-lg border border-slate-800">
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formAllowsCustomization}
                        onChange={(e) => setFormAllowsCustomization(e.target.checked)}
                        className="rounded border-slate-700 text-[#176B43] focus:ring-0"
                      />
                      <span className="text-xs font-bold uppercase text-slate-200">
                        Allow Custom Name, Number & Sleeve Badges
                      </span>
                    </label>
                    {formAllowsCustomization && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400">Customization Fee:</span>
                        <input
                          type="number"
                          value={formCustomizationFee}
                          onChange={(e) => setFormCustomizationFee(e.target.value)}
                          className="w-24 bg-[#101D40] border border-slate-700 rounded px-2 py-1 text-xs text-white font-mono"
                        />
                        <span className="text-xs text-[#F5E8C9]">৳ BDT</span>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs font-bold uppercase">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formIsNewArrival}
                        onChange={(e) => setFormIsNewArrival(e.target.checked)}
                        className="rounded border-slate-700 text-[#176B43]"
                      />
                      <span className="text-slate-300">New Arrival</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formIsBestseller}
                        onChange={(e) => setFormIsBestseller(e.target.checked)}
                        className="rounded border-slate-700 text-[#176B43]"
                      />
                      <span className="text-slate-300">Bestseller</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formIsFeatured}
                        onChange={(e) => setFormIsFeatured(e.target.checked)}
                        className="rounded border-slate-700 text-[#176B43]"
                      />
                      <span className="text-slate-300">Featured</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formIsActive}
                        onChange={(e) => setFormIsActive(e.target.checked)}
                        className="rounded border-slate-700 text-[#176B43]"
                      />
                      <span className="text-emerald-400">Active (Published)</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* 3. Product Images */}
              <div className="space-y-4 pt-4 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-[#F5E8C9]">3. Product Images</h4>
                    <p className="text-[11px] text-slate-400">Upload high-res photos or paste direct image links</p>
                  </div>
                  <div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      multiple
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 bg-[#176B43] hover:bg-[#1FA365] text-white text-xs font-bold uppercase rounded flex items-center gap-1.5"
                    >
                      <UploadCloud className="w-4 h-4" />
                      <span>Upload Photos</span>
                    </button>
                  </div>
                </div>

                {/* Paste URL Input */}
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="Or paste external image URL (e.g. Unsplash or CDN)..."
                    value={urlImageInput}
                    onChange={(e) => setUrlImageInput(e.target.value)}
                    className="flex-1 bg-[#090F21] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#176B43]"
                  />
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold uppercase rounded-lg"
                  >
                    Add URL
                  </button>
                </div>

                {/* Thumbnail Previews */}
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                  {formImages.map((img, i) => (
                    <div
                      key={i}
                      className={`relative group rounded-lg overflow-hidden border ${
                        img.isPrimary ? 'border-[#F5E8C9] ring-2 ring-[#F5E8C9]/40' : 'border-slate-700'
                      }`}
                    >
                      <div className="aspect-[3/4] bg-slate-900">
                        <img src={img.imageUrl} alt={img.altText} className="w-full h-full object-cover" />
                      </div>
                      {img.isPrimary && (
                        <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-[#F5E8C9] text-[#090F21]">
                          Primary
                        </span>
                      )}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity">
                        {!img.isPrimary && (
                          <button
                            type="button"
                            onClick={() => setPrimaryImage(i)}
                            className="p-1 rounded bg-[#F5E8C9] text-black"
                            title="Set Primary"
                          >
                            <Star className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => removeImage(i)}
                          className="p-1 rounded bg-red-600 text-white"
                          title="Remove Image"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. Variant Sizes & Stock */}
              <div className="space-y-4 pt-4 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-[#F5E8C9]">
                      4. Size & Stock Inventory Matrix
                    </h4>
                    <p className="text-[11px] text-slate-400">Manage individual stock quantities per jersey size</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddCustomSize}
                    className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold uppercase rounded flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Size</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {formVariants.map((v, i) => (
                    <div key={i} className="bg-[#090F21] p-3 rounded-lg border border-slate-700 relative group">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-black text-white font-mono">{v.size}</span>
                        {formVariants.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeVariant(i)}
                            className="text-slate-500 hover:text-red-400"
                            title="Remove Size"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                      <label className="block text-[10px] text-slate-400 uppercase font-mono mb-1">
                        Stock Units
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={v.stockQuantity}
                        onChange={(e) => handleVariantStockChange(i, parseInt(e.target.value, 10) || 0)}
                        className="w-full bg-[#101D40] border border-slate-700 rounded px-2.5 py-1 text-xs text-white font-mono"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-6 border-t border-slate-800 flex items-center justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingProduct}
                  className="px-6 py-2.5 rounded-lg bg-[#176B43] hover:bg-[#1FA365] text-white text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-[#176B43]/20"
                >
                  {isSavingProduct ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving to Database...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 text-[#F5E8C9]" />
                      <span>{editingProductId ? 'Update Football Kit' : 'Publish Football Kit'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* MODAL: ADD / EDIT CATEGORY */}
      {/* =================================================================== */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#101D40] border border-slate-700 rounded-xl w-full max-w-md shadow-2xl p-6">
            <h3 className="text-base font-black uppercase text-white tracking-tight mb-4">
              {editingCategory ? 'Edit Category' : 'Create New Category'}
            </h3>

            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={catName}
                  onChange={(e) => {
                    setCatName(e.target.value);
                    if (!editingCategory) {
                      setCatSlug(e.target.value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-'));
                    }
                  }}
                  className="w-full bg-[#090F21] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">URL Slug *</label>
                <input
                  type="text"
                  required
                  value={catSlug}
                  onChange={(e) => setCatSlug(e.target.value)}
                  className="w-full bg-[#090F21] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={catDescription}
                  onChange={(e) => setCatDescription(e.target.value)}
                  className="w-full bg-[#090F21] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Display Order</label>
                <input
                  type="number"
                  value={catDisplayOrder}
                  onChange={(e) => setCatDisplayOrder(e.target.value)}
                  className="w-full bg-[#090F21] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono"
                />
              </div>

              <div className="pt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-2 rounded bg-slate-800 text-slate-300 text-xs font-bold uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded bg-[#176B43] hover:bg-[#1FA365] text-white text-xs font-bold uppercase"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* MODAL: DELETE CONFIRMATION */}
      {/* =================================================================== */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#101D40] border border-red-800/60 rounded-xl w-full max-w-sm p-6 shadow-2xl text-center">
            <div className="inline-flex p-3 rounded-full bg-red-950 border border-red-800 text-red-400 mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black uppercase text-white mb-2">Confirm Delete</h3>
            <p className="text-xs text-slate-300 mb-6 font-sans">
              Are you sure you want to permanently delete{' '}
              <span className="font-bold text-white">"{deleteTarget.name}"</span>? This action cannot be undone.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 rounded bg-slate-800 text-slate-300 text-xs font-bold uppercase"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-5 py-2 rounded bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* MODAL: REJECT PAYMENT */}
      {/* =================================================================== */}
      {isRejectModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#101D40] border border-slate-700 rounded-xl w-full max-w-md p-6 shadow-2xl">
            <h3 className="text-base font-black uppercase text-white mb-1">Reject Payment Transaction</h3>
            <p className="text-xs text-slate-400 mb-4 font-mono">Order {selectedOrder.orderNumber}</p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">
                  Reason for Rejection
                </label>
                <textarea
                  rows={3}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="e.g. Transaction ID was not found on bKash merchant statement..."
                  className="w-full bg-[#090F21] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsRejectModalOpen(false)}
                  className="px-4 py-2 rounded bg-slate-800 text-slate-300 text-xs font-bold uppercase"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRejectPayment}
                  className="px-5 py-2 rounded bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase"
                >
                  Confirm Rejection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
