import { Product, Category, Collection, ShippingZone } from '@/types';

export const CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Club Jerseys', slug: 'club-jerseys', description: 'Premier European and worldwide club football kits', displayOrder: 1 },
  { id: 'cat-2', name: 'National Teams', slug: 'national-teams', description: 'World Cup and continental tournament pride', displayOrder: 2 },
  { id: 'cat-3', name: 'Fan Editions', slug: 'fan-editions', description: 'Everyday comfortable supporter fit with embroidered crests', displayOrder: 3 },
  { id: 'cat-4', name: 'Player Editions', slug: 'player-editions', description: 'Athletic cut, lightweight aero-weave, heat-applied badges', displayOrder: 4 },
  { id: 'cat-5', name: 'Custom Jerseys', slug: 'custom-jerseys', description: 'Personalised name, number, and tournament badge kits', displayOrder: 5 },
  { id: 'cat-6', name: 'Training Wear', slug: 'training-wear', description: 'Pre-match tops, track pants, and training shorts', displayOrder: 6 },
  { id: 'cat-7', name: 'Accessories', slug: 'accessories', description: 'Grip socks, shin guards, and football kit essentials', displayOrder: 7 },
];

export const COLLECTIONS: Collection[] = [
  {
    id: 'col-1',
    name: 'Club Collection',
    slug: 'club-collection',
    description: 'Rep your club. Own your colours.',
    tagline: 'Rep your club. Own your colours.',
    heroImageUrl: 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?auto=format&fit=crop&w=1200&q=80',
    displayOrder: 1,
  },
  {
    id: 'col-2',
    name: 'National Teams',
    slug: 'national-teams-collection',
    description: 'Flags up. Colours on.',
    tagline: 'Flags up. Colours on.',
    heroImageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80',
    displayOrder: 2,
  },
  {
    id: 'col-3',
    name: 'Fan Editions',
    slug: 'fan-editions-collection',
    description: 'For the love of the game.',
    tagline: 'For the love of the game.',
    heroImageUrl: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=1200&q=80',
    displayOrder: 3,
  },
  {
    id: 'col-4',
    name: 'Custom Jerseys',
    slug: 'custom-jerseys-collection',
    description: 'Your name. Your number. Your jersey.',
    tagline: 'Your name. Your number. Your jersey.',
    heroImageUrl: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=1200&q=80',
    displayOrder: 4,
  },
  {
    id: 'col-5',
    name: 'Training Wear',
    slug: 'training-wear-collection',
    description: 'Made for the work behind the win.',
    tagline: 'Made for the work behind the win.',
    heroImageUrl: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=1200&q=80',
    displayOrder: 5,
  },
];

export const SHIPPING_ZONES: ShippingZone[] = [
  {
    id: 'zone-dhaka',
    name: 'Inside Dhaka City',
    rateMinor: 8000, // ৳80
    estimatedDays: '24 – 48 Hours',
  },
  {
    id: 'zone-nationwide',
    name: 'Outside Dhaka (Nationwide Bangladesh)',
    rateMinor: 13000, // ৳130
    estimatedDays: '2 – 4 Business Days',
  },
];

export const BANGLADESH_DISTRICTS = [
  'Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna', 'Barisal', 'Rangpur', 'Mymensingh',
  'Comilla', 'Gazipur', 'Narayanganj', 'Bogra', 'Jessore', 'Cox\'s Bazar', 'Kushtia',
  'Tangail', 'Feni', 'Faridpur', 'Noakhali', 'Pabna', 'Dinajpur', 'Sirajganj', 'Jamalpur'
];

export const PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    title: 'Real Madrid 24/25 Home Kit',
    slug: 'real-madrid-24-25-home-kit',
    description: 'The iconic royal all-white look with houndstooth micro-texture pattern. Features embroidered club crest and high-grade breathable AEROREADY fabric for matchday comfort.',
    categoryId: 'cat-1',
    collectionId: 'col-1',
    teamLabel: 'Real Madrid',
    season: '2024/25',
    editionType: 'Fan Edition',
    regularPriceMinor: 115000,
    salePriceMinor: 99000,
    sku: 'JOTG-RM-2425-H-FAN',
    isFeatured: true,
    isBestseller: true,
    isNewArrival: true,
    isActive: true,
    allowsCustomization: true,
    customizationFeeMinor: 20000,
    images: [
      { id: 'img-1-1', productId: 'prod-1', imageUrl: 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?auto=format&fit=crop&w=800&q=80', altText: 'Real Madrid 24/25 Home Front', displayOrder: 1, isPrimary: true },
      { id: 'img-1-2', productId: 'prod-1', imageUrl: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=800&q=80', altText: 'Real Madrid Fabric Texture', displayOrder: 2, isPrimary: false },
    ],
    variants: [
      { id: 'var-1-s', productId: 'prod-1', size: 'S', sku: 'JOTG-RM-2425-H-FAN-S', stockQuantity: 12 },
      { id: 'var-1-m', productId: 'prod-1', size: 'M', sku: 'JOTG-RM-2425-H-FAN-M', stockQuantity: 20 },
      { id: 'var-1-l', productId: 'prod-1', size: 'L', sku: 'JOTG-RM-2425-H-FAN-L', stockQuantity: 25 },
      { id: 'var-1-xl', productId: 'prod-1', size: 'XL', sku: 'JOTG-RM-2425-H-FAN-XL', stockQuantity: 15 },
      { id: 'var-1-xxl', productId: 'prod-1', size: 'XXL', sku: 'JOTG-RM-2425-H-FAN-XXL', stockQuantity: 8 },
    ],
  },
  {
    id: 'prod-2',
    title: 'Argentina 3-Star Champions Home Kit',
    slug: 'argentina-3-star-champions-home-kit',
    description: 'The timeless Albiceleste sky blue and white stripes featuring 3 gold stars above the national association badge and central gold champions patch.',
    categoryId: 'cat-2',
    collectionId: 'col-2',
    teamLabel: 'Argentina',
    season: '2024/25',
    editionType: 'Fan Edition',
    regularPriceMinor: 125000,
    salePriceMinor: 110000,
    sku: 'JOTG-ARG-3STAR-H-FAN',
    isFeatured: true,
    isBestseller: true,
    isNewArrival: true,
    isActive: true,
    allowsCustomization: true,
    customizationFeeMinor: 20000,
    images: [
      { id: 'img-2-1', productId: 'prod-2', imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80', altText: 'Argentina 3 Star Kit', displayOrder: 1, isPrimary: true },
    ],
    variants: [
      { id: 'var-2-s', productId: 'prod-2', size: 'S', sku: 'JOTG-ARG-3STAR-H-FAN-S', stockQuantity: 10 },
      { id: 'var-2-m', productId: 'prod-2', size: 'M', sku: 'JOTG-ARG-3STAR-H-FAN-M', stockQuantity: 18 },
      { id: 'var-2-l', productId: 'prod-2', size: 'L', sku: 'JOTG-ARG-3STAR-H-FAN-L', stockQuantity: 22 },
      { id: 'var-2-xl', productId: 'prod-2', size: 'XL', sku: 'JOTG-ARG-3STAR-H-FAN-XL', stockQuantity: 14 },
      { id: 'var-2-xxl', productId: 'prod-2', size: 'XXL', sku: 'JOTG-ARG-3STAR-H-FAN-XXL', stockQuantity: 6 },
    ],
  },
  {
    id: 'prod-3',
    title: 'Arsenal 24/25 Away Player Edition Jersey',
    slug: 'arsenal-24-25-away-player-edition',
    description: 'Player specification fit crafted with Labrum London collaboration details, heat-pressed canon crest, and advanced micro-mesh ventilation channels.',
    categoryId: 'cat-4',
    collectionId: 'col-1',
    teamLabel: 'Arsenal',
    season: '2024/25',
    editionType: 'Player Edition',
    regularPriceMinor: 165000,
    salePriceMinor: 145000,
    sku: 'JOTG-ARS-2425-A-PLY',
    isFeatured: true,
    isBestseller: true,
    isNewArrival: true,
    isActive: true,
    allowsCustomization: true,
    customizationFeeMinor: 20000,
    images: [
      { id: 'img-3-1', productId: 'prod-3', imageUrl: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=800&q=80', altText: 'Arsenal Away Player Edition Front', displayOrder: 1, isPrimary: true },
    ],
    variants: [
      { id: 'var-3-s', productId: 'prod-3', size: 'S', sku: 'JOTG-ARS-2425-A-PLY-S', stockQuantity: 8 },
      { id: 'var-3-m', productId: 'prod-3', size: 'M', sku: 'JOTG-ARS-2425-A-PLY-M', stockQuantity: 15 },
      { id: 'var-3-l', productId: 'prod-3', size: 'L', sku: 'JOTG-ARS-2425-A-PLY-L', stockQuantity: 16 },
      { id: 'var-3-xl', productId: 'prod-3', size: 'XL', sku: 'JOTG-ARS-2425-A-PLY-XL', stockQuantity: 9 },
    ],
  },
  {
    id: 'prod-4',
    title: 'Portugal 2024 Euro Home Jersey',
    slug: 'portugal-2024-euro-home-jersey',
    description: 'Classic red with green and black accents honouring the national flag. Built with lightweight dri-fit sweat-wicking knit fabric.',
    categoryId: 'cat-2',
    collectionId: 'col-2',
    teamLabel: 'Portugal',
    season: '2024',
    editionType: 'Fan Edition',
    regularPriceMinor: 119000,
    salePriceMinor: 105000,
    sku: 'JOTG-POR-2024-H-FAN',
    isFeatured: false,
    isBestseller: true,
    isNewArrival: true,
    isActive: true,
    allowsCustomization: true,
    customizationFeeMinor: 20000,
    images: [
      { id: 'img-4-1', productId: 'prod-4', imageUrl: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=800&q=80', altText: 'Portugal 2024 Home Kit', displayOrder: 1, isPrimary: true },
    ],
    variants: [
      { id: 'var-4-s', productId: 'prod-4', size: 'S', sku: 'JOTG-POR-2024-H-FAN-S', stockQuantity: 7 },
      { id: 'var-4-m', productId: 'prod-4', size: 'M', sku: 'JOTG-POR-2024-H-FAN-M', stockQuantity: 12 },
      { id: 'var-4-l', productId: 'prod-4', size: 'L', sku: 'JOTG-POR-2024-H-FAN-L', stockQuantity: 14 },
      { id: 'var-4-xl', productId: 'prod-4', size: 'XL', sku: 'JOTG-POR-2024-H-FAN-XL', stockQuantity: 8 },
    ],
  },
  {
    id: 'prod-5',
    title: 'Barcelona 24/25 125th Anniversary Home Kit',
    slug: 'barcelona-24-25-anniversary-home-kit',
    description: 'Special 125th anniversary half-and-half Blaugrana split with central gold crest and sleeve accents commemorating legendary club heritage.',
    categoryId: 'cat-1',
    collectionId: 'col-1',
    teamLabel: 'Barcelona',
    season: '2024/25',
    editionType: 'Fan Edition',
    regularPriceMinor: 130000,
    salePriceMinor: 115000,
    sku: 'JOTG-FCB-2425-H-FAN',
    isFeatured: true,
    isBestseller: true,
    isNewArrival: true,
    isActive: true,
    allowsCustomization: true,
    customizationFeeMinor: 20000,
    images: [
      { id: 'img-5-1', productId: 'prod-5', imageUrl: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=800&q=80', altText: 'Barcelona 125th Anniversary Front', displayOrder: 1, isPrimary: true },
    ],
    variants: [
      { id: 'var-5-s', productId: 'prod-5', size: 'S', sku: 'JOTG-FCB-2425-H-FAN-S', stockQuantity: 14 },
      { id: 'var-5-m', productId: 'prod-5', size: 'M', sku: 'JOTG-FCB-2425-H-FAN-M', stockQuantity: 24 },
      { id: 'var-5-l', productId: 'prod-5', size: 'L', sku: 'JOTG-FCB-2425-H-FAN-L', stockQuantity: 20 },
      { id: 'var-5-xl', productId: 'prod-5', size: 'XL', sku: 'JOTG-FCB-2425-H-FAN-XL', stockQuantity: 11 },
    ],
  },
  {
    id: 'prod-6',
    title: 'Manchester City 24/25 Oasis Noel Gallagher 4th Kit',
    slug: 'manchester-city-24-25-oasis-kit',
    description: 'Designed in collaboration with Noel Gallagher celebrating 30 years of Definitely Maybe. Features hand-drawn typography and marine colour palette.',
    categoryId: 'cat-4',
    collectionId: 'col-1',
    teamLabel: 'Manchester City',
    season: '2024/25',
    editionType: 'Player Edition',
    regularPriceMinor: 169000,
    salePriceMinor: 149000,
    sku: 'JOTG-MC-2425-OASIS',
    isFeatured: true,
    isBestseller: false,
    isNewArrival: true,
    isActive: true,
    allowsCustomization: true,
    customizationFeeMinor: 20000,
    images: [
      { id: 'img-6-1', productId: 'prod-6', imageUrl: 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?auto=format&fit=crop&w=800&q=80', altText: 'Manchester City Oasis 4th Kit', displayOrder: 1, isPrimary: true },
    ],
    variants: [
      { id: 'var-6-s', productId: 'prod-6', size: 'S', sku: 'JOTG-MC-2425-OASIS-S', stockQuantity: 5 },
      { id: 'var-6-m', productId: 'prod-6', size: 'M', sku: 'JOTG-MC-2425-OASIS-M', stockQuantity: 10 },
      { id: 'var-6-l', productId: 'prod-6', size: 'L', sku: 'JOTG-MC-2425-OASIS-L', stockQuantity: 12 },
      { id: 'var-6-xl', productId: 'prod-6', size: 'XL', sku: 'JOTG-MC-2425-OASIS-XL', stockQuantity: 6 },
    ],
  },
  {
    id: 'prod-7',
    title: 'Bangladesh National Team 2024/25 Home Jersey',
    slug: 'bangladesh-national-team-2024-25-home-jersey',
    description: 'Wear your nation with boundless passion. Lush forest green infused with iconic red solar accents and embossed Bengal tiger stripe textures. Breathable climate-adaptive moisture management.',
    categoryId: 'cat-2',
    collectionId: 'col-2',
    teamLabel: 'Bangladesh',
    season: '2024/25',
    editionType: 'Fan Edition',
    regularPriceMinor: 105000,
    salePriceMinor: 89000,
    sku: 'JOTG-BD-2425-H-FAN',
    isFeatured: true,
    isBestseller: true,
    isNewArrival: true,
    isActive: true,
    allowsCustomization: true,
    customizationFeeMinor: 15000,
    images: [
      { id: 'img-bd-1', productId: 'prod-7', imageUrl: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=800&q=80', altText: 'Bangladesh Home Kit Front', displayOrder: 1, isPrimary: true },
    ],
    variants: [
      { id: 'var-bd-s', productId: 'prod-7', size: 'S', sku: 'JOTG-BD-2425-H-FAN-S', stockQuantity: 15 },
      { id: 'var-bd-m', productId: 'prod-7', size: 'M', sku: 'JOTG-BD-2425-H-FAN-M', stockQuantity: 30 },
      { id: 'var-bd-l', productId: 'prod-7', size: 'L', sku: 'JOTG-BD-2425-H-FAN-L', stockQuantity: 35 },
      { id: 'var-bd-xl', productId: 'prod-7', size: 'XL', sku: 'JOTG-BD-2425-H-FAN-XL', stockQuantity: 20 },
      { id: 'var-bd-xxl', productId: 'prod-7', size: 'XXL', sku: 'JOTG-BD-2425-H-FAN-XXL', stockQuantity: 12 },
    ],
  },
  {
    id: 'prod-8',
    title: 'Real Madrid 1998 Amsterdam Retro Final Jersey',
    slug: 'real-madrid-1998-amsterdam-retro-jersey',
    description: 'The historic jersey worn in Amsterdam winning La Séptima. Features classic vintage collar, embroidered heritage crest, and silky retro jacquard weave.',
    categoryId: 'cat-1',
    collectionId: 'col-1',
    teamLabel: 'Real Madrid',
    season: 'Retro 1998',
    editionType: 'Retro',
    regularPriceMinor: 140000,
    salePriceMinor: 125000,
    sku: 'JOTG-RM-1998-RETRO',
    isFeatured: true,
    isBestseller: true,
    isNewArrival: false,
    isActive: true,
    allowsCustomization: true,
    customizationFeeMinor: 20000,
    images: [
      { id: 'img-rm98-1', productId: 'prod-8', imageUrl: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=800&q=80', altText: 'Real Madrid 1998 Retro Front', displayOrder: 1, isPrimary: true },
    ],
    variants: [
      { id: 'var-rm98-s', productId: 'prod-8', size: 'S', sku: 'JOTG-RM-1998-RETRO-S', stockQuantity: 6 },
      { id: 'var-rm98-m', productId: 'prod-8', size: 'M', sku: 'JOTG-RM-1998-RETRO-M', stockQuantity: 12 },
      { id: 'var-rm98-l', productId: 'prod-8', size: 'L', sku: 'JOTG-RM-1998-RETRO-L', stockQuantity: 14 },
      { id: 'var-rm98-xl', productId: 'prod-8', size: 'XL', sku: 'JOTG-RM-1998-RETRO-XL', stockQuantity: 5 },
    ],
  },
  {
    id: 'prod-9',
    title: 'JOTG Elite Grip Anti-Slip Football Socks (White/Navy)',
    slug: 'jotg-elite-grip-anti-slip-socks',
    description: 'Engineered rubber suction pads lock your feet into football boots, preventing blisters and enhancing turning stability during high-intensity matches.',
    categoryId: 'cat-7',
    collectionId: undefined,
    teamLabel: 'Jersey On The Go',
    season: 'All-Season',
    editionType: 'Accessory',
    regularPriceMinor: 35000,
    salePriceMinor: 29000,
    sku: 'JOTG-ACC-GRIP-WHT',
    isFeatured: false,
    isBestseller: true,
    isNewArrival: true,
    isActive: true,
    allowsCustomization: false,
    customizationFeeMinor: 0,
    images: [
      { id: 'img-7-1', productId: 'prod-9', imageUrl: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=800&q=80', altText: 'Elite Grip Socks Pair', displayOrder: 1, isPrimary: true },
    ],
    variants: [
      { id: 'var-7-fs', productId: 'prod-9', size: 'Free Size', sku: 'JOTG-ACC-GRIP-WHT-FS', stockQuantity: 65 },
    ],
  },
  {
    id: 'prod-10',
    title: 'JOTG Matchday Engineered Pre-Match Training Top',
    slug: 'jotg-matchday-pre-match-training-top',
    description: 'Ultra-lightweight stretch training top designed for high aerobic drills, quick warmups, and matchday sessions. Quick-drying and aerodynamic.',
    categoryId: 'cat-6',
    collectionId: 'col-5',
    teamLabel: 'Jersey On The Go',
    season: '2024/25',
    editionType: 'Training Wear',
    regularPriceMinor: 89000,
    salePriceMinor: 75000,
    sku: 'JOTG-TRN-TOP-NAVY',
    isFeatured: false,
    isBestseller: false,
    isNewArrival: true,
    isActive: true,
    allowsCustomization: false,
    customizationFeeMinor: 0,
    images: [
      { id: 'img-10-1', productId: 'prod-10', imageUrl: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=800&q=80', altText: 'Pre-match Training Top', displayOrder: 1, isPrimary: true },
    ],
    variants: [
      { id: 'var-10-s', productId: 'prod-10', size: 'S', sku: 'JOTG-TRN-TOP-NAVY-S', stockQuantity: 10 },
      { id: 'var-10-m', productId: 'prod-10', size: 'M', sku: 'JOTG-TRN-TOP-NAVY-M', stockQuantity: 18 },
      { id: 'var-10-l', productId: 'prod-10', size: 'L', sku: 'JOTG-TRN-TOP-NAVY-L', stockQuantity: 20 },
      { id: 'var-10-xl', productId: 'prod-10', size: 'XL', sku: 'JOTG-TRN-TOP-NAVY-XL', stockQuantity: 8 },
    ],
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  const category = CATEGORIES.find((c) => c.slug === categorySlug);
  if (!category) return [];
  return PRODUCTS.filter((p) => p.categoryId === category.id);
}

export function getProductsByCollection(collectionSlug: string): Product[] {
  const collection = COLLECTIONS.find((c) => c.slug === collectionSlug);
  if (!collection) return [];
  return PRODUCTS.filter((p) => p.collectionId === collection.id);
}

export function getRelatedProducts(productId: string, limit = 4): Product[] {
  const current = PRODUCTS.find((p) => p.id === productId);
  if (!current) return PRODUCTS.slice(0, limit);

  return PRODUCTS
    .filter((p) => p.id !== productId && (p.categoryId === current.categoryId || p.collectionId === current.collectionId))
    .slice(0, limit);
}
