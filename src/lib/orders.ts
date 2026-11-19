import { Order, PaymentMethod, PaymentStatus, FulfillmentStatus, OrderItem } from '@/types';

const ORDERS_STORAGE_KEY = 'jotg_orders_v1';

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-1001',
    orderNumber: 'JOTG-1001',
    trackingToken: 'jotg_trk_arg_3star_2026',
    customerName: 'Tanvir Hossain',
    customerPhone: '01711223344',
    customerEmail: 'tanvir.football@gmail.com',
    deliveryAddress: 'House 14, Road 7, Sector 3, Uttara',
    cityDistrict: 'Dhaka',
    deliveryArea: 'Uttara',
    paymentMethod: 'bkash',
    paymentStatus: 'paid',
    fulfillmentStatus: 'processing',
    shippingZoneId: 'zone-dhaka',
    subtotalMinor: 110000,
    shippingMinor: 8000,
    discountMinor: 0,
    totalMinor: 118000,
    createdAt: '2026-05-10T14:30:00.000Z',
    updatedAt: '2026-05-10T16:00:00.000Z',
    items: [
      {
        id: 'item-1001-1',
        orderId: 'ord-1001',
        productTitleSnapshot: 'Argentina 3-Star Champions Home Kit',
        productSkuSnapshot: 'JOTG-ARG-3STAR-H-FAN',
        sizeSnapshot: 'L',
        editionSnapshot: 'Fan Edition',
        unitPriceMinor: 110000,
        quantity: 1,
        totalMinor: 110000,
      },
    ],
    paymentRecord: {
      id: 'pay-1001',
      orderId: 'ord-1001',
      provider: 'bkash',
      senderPhone: '01711223344',
      transactionId: '9J28A77KL1',
      expectedAmountMinor: 118000,
      submittedAmountMinor: 118000,
      verificationStatus: 'verified',
      verifiedAt: '2026-05-10T16:00:00.000Z',
      adminNotes: 'Verified against bKash merchant statement',
      createdAt: '2026-05-10T14:30:00.000Z',
    },
  },
  {
    id: 'ord-1002',
    orderNumber: 'JOTG-1002',
    trackingToken: 'jotg_trk_rm_custom_2026',
    customerName: 'Shakib Al Hasan',
    customerPhone: '01899887766',
    customerEmail: 'shakib75@outlook.com',
    deliveryAddress: 'Apartment 4B, Dhanmondi 27',
    cityDistrict: 'Dhaka',
    deliveryArea: 'Dhanmondi',
    paymentMethod: 'bkash',
    paymentStatus: 'verification_pending',
    fulfillmentStatus: 'pending_confirmation',
    shippingZoneId: 'zone-dhaka',
    subtotalMinor: 119000,
    shippingMinor: 8000,
    discountMinor: 0,
    totalMinor: 127000,
    createdAt: '2026-05-11T09:15:00.000Z',
    updatedAt: '2026-05-11T10:00:00.000Z',
    items: [
      {
        id: 'item-1002-1',
        orderId: 'ord-1002',
        productTitleSnapshot: 'Real Madrid 24/25 Home Kit (Custom Print)',
        productSkuSnapshot: 'JOTG-RM-2425-H-FAN',
        sizeSnapshot: 'XL',
        editionSnapshot: 'Fan Edition',
        unitPriceMinor: 99000,
        quantity: 1,
        totalMinor: 119000,
        customizationDetails: {
          playerName: 'BELLINGHAM',
          playerNumber: '5',
          sleevePatch: 'UCL Starball + 15 Badge',
          customizationFeeMinor: 20000,
        },
      },
    ],
    paymentRecord: {
      id: 'pay-1002',
      orderId: 'ord-1002',
      provider: 'bkash',
      senderPhone: '01899887766',
      transactionId: 'BK902X8Y77',
      expectedAmountMinor: 127000,
      submittedAmountMinor: 127000,
      verificationStatus: 'pending',
      createdAt: '2026-05-11T09:15:00.000Z',
    },
  },
  {
    id: 'ord-1003',
    orderNumber: 'JOTG-1003',
    trackingToken: 'jotg_trk_ars_nagad_2026',
    customerName: 'Mahmudur Rahman',
    customerPhone: '01622334455',
    customerEmail: 'mahmud.ctg@yahoo.com',
    deliveryAddress: 'GEC Circle, Nasirabad',
    cityDistrict: 'Chittagong',
    deliveryArea: 'Nasirabad',
    paymentMethod: 'nagad',
    paymentStatus: 'unpaid',
    fulfillmentStatus: 'pending_confirmation',
    shippingZoneId: 'zone-nationwide',
    subtotalMinor: 145000,
    shippingMinor: 13000,
    discountMinor: 0,
    totalMinor: 158000,
    createdAt: '2026-05-11T12:00:00.000Z',
    updatedAt: '2026-05-11T12:30:00.000Z',
    items: [
      {
        id: 'item-1003-1',
        orderId: 'ord-1003',
        productTitleSnapshot: 'Arsenal 24/25 Away Player Edition Jersey',
        productSkuSnapshot: 'JOTG-ARS-2425-A-PLY',
        sizeSnapshot: 'M',
        editionSnapshot: 'Player Edition',
        unitPriceMinor: 145000,
        quantity: 1,
        totalMinor: 145000,
      },
    ],
  },
  {
    id: 'ord-1004',
    orderNumber: 'JOTG-1004',
    trackingToken: 'jotg_trk_cod_dhaka_2026',
    customerName: 'Farhan Kabir',
    customerPhone: '01700112233',
    deliveryAddress: 'Holding 88, Road 11, Banani',
    cityDistrict: 'Dhaka',
    deliveryArea: 'Banani',
    paymentMethod: 'cod',
    paymentStatus: 'unpaid',
    fulfillmentStatus: 'confirmed',
    shippingZoneId: 'zone-dhaka',
    subtotalMinor: 89000,
    shippingMinor: 8000,
    discountMinor: 0,
    totalMinor: 97000,
    createdAt: '2026-05-11T13:45:00.000Z',
    updatedAt: '2026-05-11T14:10:00.000Z',
    items: [
      {
        id: 'item-1004-1',
        orderId: 'ord-1004',
        productTitleSnapshot: 'Bangladesh National Team 2024/25 Home Jersey',
        productSkuSnapshot: 'JOTG-BD-2425-H-FAN',
        sizeSnapshot: 'L',
        editionSnapshot: 'Fan Edition',
        unitPriceMinor: 89000,
        quantity: 1,
        totalMinor: 89000,
      },
    ],
  },
];

export function getStoredOrders(): Order[] {
  if (typeof window === 'undefined') return INITIAL_ORDERS;
  try {
    const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(INITIAL_ORDERS));
      return INITIAL_ORDERS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_ORDERS;
  }
}

export function saveStoredOrders(orders: Order[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  } catch {
    // ignore quota
  }
}

export function getOrderByToken(token: string): Order | undefined {
  const cleanToken = token.trim().toLowerCase();
  const orders = getStoredOrders();
  return orders.find(
    (o) =>
      o.trackingToken.toLowerCase() === cleanToken ||
      o.orderNumber.toLowerCase() === cleanToken
  );
}

export function createNewOrder(orderData: {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryAddress: string;
  cityDistrict: string;
  deliveryArea: string;
  customerNotes?: string;
  paymentMethod: PaymentMethod;
  shippingZoneId: string;
  items: OrderItem[];
  subtotalMinor: number;
  shippingMinor: number;
  discountMinor?: number;
  totalMinor: number;
  paymentSubmission?: {
    senderPhone: string;
    transactionId: string;
  };
}): Order {
  const orders = getStoredOrders();
  const nextNum = 1000 + orders.length + 1;
  const orderNumber = `JOTG-${nextNum}`;
  const randomSuffix = Math.random().toString(36).substring(2, 10);
  const trackingToken = `jotg_trk_${randomSuffix}`;

  const isPrepaid = orderData.paymentMethod === 'bkash' || orderData.paymentMethod === 'nagad';
  const hasTrx = !!orderData.paymentSubmission?.transactionId;

  const paymentStatus: PaymentStatus = isPrepaid
    ? hasTrx
      ? 'verification_pending'
      : 'unpaid'
    : 'unpaid';

  const orderId = `ord-${Date.now()}`;

  const newOrder: Order = {
    id: orderId,
    orderNumber,
    trackingToken,
    customerName: orderData.customerName,
    customerPhone: orderData.customerPhone,
    customerEmail: orderData.customerEmail,
    deliveryAddress: orderData.deliveryAddress,
    cityDistrict: orderData.cityDistrict,
    deliveryArea: orderData.deliveryArea,
    customerNotes: orderData.customerNotes,
    paymentMethod: orderData.paymentMethod,
    paymentStatus,
    fulfillmentStatus: 'pending_confirmation',
    shippingZoneId: orderData.shippingZoneId,
    subtotalMinor: orderData.subtotalMinor,
    shippingMinor: orderData.shippingMinor,
    discountMinor: orderData.discountMinor || 0,
    totalMinor: orderData.totalMinor,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    items: orderData.items.map((item, index) => ({
      ...item,
      id: `item-${orderId}-${index}`,
      orderId,
    })),
    paymentRecord: hasTrx
      ? {
          id: `pay-${orderId}`,
          orderId,
          provider: orderData.paymentMethod,
          senderPhone: orderData.paymentSubmission?.senderPhone,
          transactionId: orderData.paymentSubmission?.transactionId?.toUpperCase(),
          expectedAmountMinor: orderData.totalMinor,
          submittedAmountMinor: orderData.totalMinor,
          verificationStatus: 'pending',
          createdAt: new Date().toISOString(),
        }
      : undefined,
  };

  const updated = [newOrder, ...orders];
  saveStoredOrders(updated);
  return newOrder;
}

export function submitPaymentRecord(
  orderId: string,
  submission: {
    provider: 'bkash' | 'nagad';
    senderPhone: string;
    transactionId: string;
    submittedAmountMinor?: number;
  }
): Order | undefined {
  const orders = getStoredOrders();
  const orderIndex = orders.findIndex((o) => o.id === orderId || o.trackingToken === orderId);
  if (orderIndex === -1) return undefined;

  const target = orders[orderIndex];

  target.paymentMethod = submission.provider;
  target.paymentStatus = 'verification_pending';
  target.updatedAt = new Date().toISOString();
  target.paymentRecord = {
    id: `pay-${target.id}-${Date.now()}`,
    orderId: target.id,
    provider: submission.provider,
    senderPhone: submission.senderPhone,
    transactionId: submission.transactionId.toUpperCase().trim(),
    expectedAmountMinor: target.totalMinor,
    submittedAmountMinor: submission.submittedAmountMinor || target.totalMinor,
    verificationStatus: 'pending',
    createdAt: new Date().toISOString(),
  };

  orders[orderIndex] = target;
  saveStoredOrders(orders);
  return target;
}

export function adminVerifyPayment(
  orderId: string,
  verifiedBy: string = 'Staff Admin',
  notes?: string
): Order | undefined {
  const orders = getStoredOrders();
  const index = orders.findIndex((o) => o.id === orderId);
  if (index === -1) return undefined;

  const order = orders[index];
  order.paymentStatus = 'paid';
  if (order.fulfillmentStatus === 'pending_confirmation') {
    order.fulfillmentStatus = 'confirmed';
  }
  order.updatedAt = new Date().toISOString();

  if (order.paymentRecord) {
    order.paymentRecord.verificationStatus = 'verified';
    order.paymentRecord.verifiedAt = new Date().toISOString();
    order.paymentRecord.adminNotes = notes || `Verified by ${verifiedBy}`;
  }

  orders[index] = order;
  saveStoredOrders(orders);
  return order;
}

export function adminRejectPayment(orderId: string, notes: string): Order | undefined {
  const orders = getStoredOrders();
  const index = orders.findIndex((o) => o.id === orderId);
  if (index === -1) return undefined;

  const order = orders[index];
  order.paymentStatus = 'rejected';
  order.updatedAt = new Date().toISOString();

  if (order.paymentRecord) {
    order.paymentRecord.verificationStatus = 'rejected';
    order.paymentRecord.adminNotes = notes;
  }

  orders[index] = order;
  saveStoredOrders(orders);
  return order;
}

export function adminUpdateFulfillment(
  orderId: string,
  status: FulfillmentStatus
): Order | undefined {
  const orders = getStoredOrders();
  const index = orders.findIndex((o) => o.id === orderId);
  if (index === -1) return undefined;

  const order = orders[index];
  order.fulfillmentStatus = status;
  if (status === 'delivered' && order.paymentMethod === 'cod') {
    order.paymentStatus = 'paid';
  }
  order.updatedAt = new Date().toISOString();

  orders[index] = order;
  saveStoredOrders(orders);
  return order;
}
