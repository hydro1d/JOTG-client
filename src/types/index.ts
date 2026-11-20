export type EditionType =
  | 'Fan Edition'
  | 'Player Edition'
  | 'Retro'
  | 'Custom Kit'
  | 'Training Wear'
  | 'Accessory';

export type PaymentMethod = 'cod' | 'bkash' | 'nagad';

export type PaymentStatus =
  | 'unpaid'
  | 'verification_pending'
  | 'paid'
  | 'rejected'
  | 'refunded';

export type FulfillmentStatus =
  | 'pending_confirmation'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export interface ProductVariant {
  id: string;
  productId: string;
  size: string;
  color?: string;
  sku: string;
  stockQuantity: number;
  priceOverrideMinor?: number;
}

export interface ProductImage {
  id: string;
  productId: string;
  imageUrl: string;
  altText: string;
  displayOrder: number;
  isPrimary: boolean;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  categoryId?: string;
  collectionId?: string;
  teamLabel?: string;
  season?: string;
  editionType: EditionType;
  regularPriceMinor: number;
  salePriceMinor?: number | null;
  sku: string;
  isFeatured: boolean;
  isBestseller: boolean;
  isNewArrival: boolean;
  isActive: boolean;
  allowsCustomization: boolean;
  customizationFeeMinor: number;
  images: ProductImage[];
  variants: ProductVariant[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  displayOrder: number;
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string;
  tagline: string;
  heroImageUrl: string;
  displayOrder: number;
}

export interface CustomizationDetails {
  playerName?: string;
  playerNumber?: string;
  sleevePatch?: string;
  additionalNotes?: string;
  customizationFeeMinor: number;
}

export interface CartItem {
  variantId: string;
  productId: string;
  title: string;
  slug: string;
  imageUrl: string;
  size: string;
  editionType: EditionType;
  unitPriceMinor: number;
  quantity: number;
  customization?: CustomizationDetails;
}

export interface ShippingZone {
  id: string;
  name: string;
  rateMinor: number;
  estimatedDays: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId?: string;
  variantId?: string;
  productTitleSnapshot: string;
  productSkuSnapshot: string;
  sizeSnapshot: string;
  editionSnapshot?: string;
  unitPriceMinor: number;
  quantity: number;
  totalMinor: number;
  customizationDetails?: CustomizationDetails;
}

export interface Order {
  id: string;
  orderNumber: string;
  trackingToken: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryAddress: string;
  cityDistrict: string;
  deliveryArea: string;
  customerNotes?: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  shippingZoneId?: string;
  subtotalMinor: number;
  shippingMinor: number;
  discountMinor: number;
  totalMinor: number;
  createdAt: string;
  updatedAt: string;
  items?: OrderItem[];
  paymentRecord?: PaymentRecord;
}

export interface PaymentRecord {
  id: string;
  orderId: string;
  provider: 'bkash' | 'nagad' | 'cod';
  senderPhone?: string;
  transactionId?: string;
  expectedAmountMinor: number;
  submittedAmountMinor?: number;
  verificationStatus: 'pending' | 'verified' | 'rejected' | 'requires_correction';
  verifiedAt?: string;
  adminNotes?: string;
  createdAt: string;
}

export interface StoreSettings {
  announcement?: {
    text: string;
    enabled: boolean;
  };
  payment_methods?: {
    bkash: {
      enabled: boolean;
      account_number: string;
      account_type: string;
      instructions: string;
    };
    nagad: {
      enabled: boolean;
      account_number: string;
      account_type: string;
      instructions: string;
    };
    cod: {
      enabled: boolean;
      instructions: string;
    };
  };
  shipping?: {
    dhaka_rate_minor: number;
    nationwide_rate_minor: number;
  };
  contact?: {
    phone: string;
    whatsapp: string;
    email: string;
    location: string;
    hours: string;
  };
}
