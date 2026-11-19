'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
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
} from 'lucide-react';
import {
  INITIAL_ORDERS,
  getStoredOrders,
  adminVerifyPayment,
  adminRejectPayment,
  adminUpdateFulfillment,
} from '@/lib/orders';
import { PRODUCTS, SHIPPING_ZONES } from '@/lib/data';
import { formatBDT } from '@/lib/currency';
import { Order, FulfillmentStatus, PaymentStatus } from '@/types';

export default function AdminPage() {
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [mounted, setMounted] = useState(false);

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    try {
      const isAuth =
        sessionStorage.getItem('jotg_admin_auth') === 'true' ||
        localStorage.getItem('jotg_admin_auth') === 'true';
      setIsAuthenticated(isAuth);
    } catch {
      // Ignore storage errors
    }
    setOrders(getStoredOrders());
    setMounted(true);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const validEmail = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@jerseyonthego.com').toLowerCase().trim();
    const validPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'jotg@dmin2026';

    if (adminEmail.toLowerCase().trim() === validEmail && adminPassword === validPassword) {
      setIsAuthenticated(true);
      try {
        sessionStorage.setItem('jotg_admin_auth', 'true');
        localStorage.setItem('jotg_admin_auth', 'true');
      } catch {
        // Ignore storage errors
      }
    } else {
      setLoginError('Invalid secret credentials. Access denied to Staff Atelier.');
    }
  };

  const handleDemoLogin = () => {
    setAdminEmail('admin@jerseyonthego.com');
    setAdminPassword('jotg@dmin2026');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    try {
      sessionStorage.removeItem('jotg_admin_auth');
      localStorage.removeItem('jotg_admin_auth');
    } catch {
      // Ignore storage errors
    }
  };
  const [activeTab, setActiveTab] = useState<'orders' | 'verification' | 'inventory' | 'settings'>('orders');

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [fulfillmentFilter, setFulfillmentFilter] = useState<string>('all');

  // Modal / Action state
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  // Inventory local state
  const [inventoryList, setInventoryList] = useState(
    PRODUCTS.flatMap((p) =>
      p.variants.map((v) => ({
        variantId: v.id,
        productId: p.id,
        productTitle: p.title,
        sku: v.sku,
        size: v.size,
        stockQuantity: v.stockQuantity,
      }))
    )
  );

  const refreshData = () => {
    setOrders(getStoredOrders());
  };

  const handleVerify = (orderId: string) => {
    const updated = adminVerifyPayment(orderId, 'Staff Atelier');
    if (updated) {
      setOrders(getStoredOrders());
      setFeedbackMsg(`Order ${updated.orderNumber} payment verified and confirmed.`);
      setTimeout(() => setFeedbackMsg(''), 3000);
    }
  };

  const openRejectModal = (order: Order) => {
    setSelectedOrder(order);
    setRejectReason('Transaction ID not found in mobile banking statement.');
    setIsRejectModalOpen(true);
  };

  const handleConfirmReject = () => {
    if (!selectedOrder) return;
    const updated = adminRejectPayment(selectedOrder.id, rejectReason.trim());
    if (updated) {
      setOrders(getStoredOrders());
      setIsRejectModalOpen(false);
      setSelectedOrder(null);
      setFeedbackMsg(`Order ${updated.orderNumber} payment rejected.`);
      setTimeout(() => setFeedbackMsg(''), 3000);
    }
  };

  const handleFulfillmentChange = (orderId: string, newStatus: FulfillmentStatus) => {
    const updated = adminUpdateFulfillment(orderId, newStatus);
    if (updated) {
      setOrders(getStoredOrders());
      setFeedbackMsg(`Order ${updated.orderNumber} updated to ${newStatus.replace('_', ' ')}.`);
      setTimeout(() => setFeedbackMsg(''), 3000);
    }
  };

  const handleStockAdjust = (variantId: string, delta: number) => {
    setInventoryList((prev) =>
      prev.map((item) =>
        item.variantId === variantId
          ? { ...item, stockQuantity: Math.max(0, item.stockQuantity + delta) }
          : item
      )
    );
  };

  // KPI Calculations
  const totalOrders = orders.length;
  const pendingVerifications = orders.filter(
    (o) => o.paymentStatus === 'verification_pending'
  ).length;
  const totalRevenueMinor = orders
    .filter((o) => o.paymentStatus === 'paid')
    .reduce((acc, curr) => acc + curr.totalMinor, 0);
  const activeFulfillmentCount = orders.filter(
    (o) => o.fulfillmentStatus === 'processing' || o.fulfillmentStatus === 'confirmed' || o.fulfillmentStatus === 'shipped'
  ).length;

  // Filtered orders list
  const filteredOrders = orders.filter((o) => {
    if (paymentFilter !== 'all' && o.paymentStatus !== paymentFilter) return false;
    if (fulfillmentFilter !== 'all' && o.fulfillmentStatus !== fulfillmentFilter) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchNum = o.orderNumber.toLowerCase().includes(q);
      const matchToken = o.trackingToken.toLowerCase().includes(q);
      const matchName = o.customerName.toLowerCase().includes(q);
      const matchPhone = o.customerPhone.toLowerCase().includes(q);
      const matchTrx = o.paymentRecord?.transactionId?.toLowerCase().includes(q);
      if (!matchNum && !matchToken && !matchName && !matchPhone && !matchTrx) return false;
    }

    return true;
  });

  const pendingVerificationOrders = orders.filter(
    (o) => o.paymentStatus === 'verification_pending'
  );

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#090F21] flex flex-col items-center justify-center text-center px-4">
        <div className="w-10 h-10 border-2 border-[#176B43] border-t-[#F5E8C9] rounded-full animate-spin mb-4"></div>
        <p className="text-xs font-bold uppercase tracking-widest text-[#F5E8C9]">
          INITIALIZING STAFF ATELIER...
        </p>
      </div>
    );
  }

  // LOGIN SCREEN GATE FOR UNAUTHENTICATED USERS
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#090F21] flex items-center justify-center py-16 px-4 relative overflow-hidden">
        {/* Background tactical pattern */}
        <div className="absolute inset-0 pitch-grid opacity-15 pointer-events-none"></div>
        <div className="absolute inset-0 stadium-glow opacity-30 pointer-events-none"></div>

        <div className="w-full max-w-md bg-[#101D40] border border-[#1E3368] rounded-2xl p-6 sm:p-8 shadow-2xl relative z-10 space-y-6">
          <div className="text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#15244E] border border-[#1E3368] flex items-center justify-center mx-auto mb-4 text-[#F5E8C9] shadow-lg">
              <Lock className="w-7 h-7 text-[#176B43]" />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#176B43]/20 border border-[#176B43]/40 text-[10px] font-black uppercase tracking-widest text-[#F5E8C9] mb-2">
              <Key className="w-3.5 h-3.5 text-[#176B43]" />
              <span>STAFF ATELIER ACCESS</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight">
              ADMIN <span className="text-[#F5E8C9]">AUTHENTICATION</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1.5">
              Authorized personnel only. Please sign in with your secret administrator credentials.
            </p>
          </div>

          {loginError && (
            <div className="p-3.5 rounded-xl bg-red-950/70 border border-red-700/60 text-xs text-red-200 flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#F5E8C9] mb-1.5">
                Secret Admin Email
              </label>
              <input
                type="email"
                required
                value={adminEmail}
                onChange={(e) => {
                  setAdminEmail(e.target.value);
                  setLoginError('');
                }}
                placeholder="admin@jerseyonthego.com"
                className="w-full bg-[#090F21] border border-[#1E3368] rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#F5E8C9]"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#F5E8C9] mb-1.5">
                Secret Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={adminPassword}
                  onChange={(e) => {
                    setAdminPassword(e.target.value);
                    setLoginError('');
                  }}
                  placeholder="••••••••••••"
                  className="w-full bg-[#090F21] border border-[#1E3368] rounded-xl pl-4 pr-11 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#F5E8C9]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-[#176B43] hover:bg-[#1FA365] text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-[#176B43]/30 transition-all hover:scale-[1.01] flex items-center justify-center gap-2 mt-2"
            >
              <Lock className="w-4 h-4" />
              <span>UNLOCK STAFF ATELIER</span>
            </button>
          </form>

          {/* Quick Demo Access Helper */}
          <div className="pt-4 border-t border-[#1E3368]/60 text-center">
            <span className="text-[11px] text-slate-400 block mb-2">
              Default Credentials: <code className="text-[#F5E8C9]">admin@jerseyonthego.com</code> / <code className="text-[#F5E8C9]">jotg@dmin2026</code>
            </span>
            <button
              type="button"
              onClick={handleDemoLogin}
              className="text-xs font-bold uppercase tracking-wider text-[#176B43] hover:text-[#1FA365] underline"
            >
              Fill Default Admin Credentials
            </button>
          </div>

          <div className="text-center pt-2">
            <Link
              href="/"
              className="text-xs text-slate-400 hover:text-white transition-colors"
            >
              ← Return to Matchday Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090F21] py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Atelier Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#F5E8C9] mb-1">
              <ShieldCheck className="w-4 h-4 text-[#176B43]" />
              <span>STAFF ATELIER & BACKOFFICE (AUTHENTICATED)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
              ORDER & PAYMENT <span className="text-[#F5E8C9]">MANAGEMENT</span>
            </h1>
          </div>

          <div className="flex items-center flex-wrap gap-2.5">
            <button
              onClick={refreshData}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#101D40] text-xs font-bold uppercase text-slate-300 hover:text-white border border-[#1E3368] transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Store Data</span>
            </button>
            <Link
              href="/"
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#176B43] hover:bg-[#1FA365] text-xs font-bold uppercase text-white transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Storefront</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-950/70 hover:bg-red-900 border border-red-800 text-red-300 hover:text-white text-xs font-black uppercase transition-colors"
              title="Lock atelier and sign out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Lock Atelier</span>
            </button>
          </div>
        </div>

        {/* Global Feedback Banner */}
        {feedbackMsg && (
          <div className="mb-6 p-3 rounded-lg bg-[#176B43]/30 border border-[#176B43] text-xs text-[#F5E8C9] font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#176B43]" />
            <span>{feedbackMsg}</span>
          </div>
        )}

        {/* KPI Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="p-5 rounded-xl bg-[#101D40] border border-[#1E3368] flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase text-slate-400 block">
                Total Orders
              </span>
              <span className="text-2xl font-black text-white mt-1 block">
                {totalOrders}
              </span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-[#15244E] flex items-center justify-center text-[#F5E8C9]">
              <Package className="w-5 h-5" />
            </div>
          </div>

          <div className="p-5 rounded-xl bg-[#101D40] border border-[#1E3368] flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase text-amber-400 block">
                Pending Verification
              </span>
              <span className="text-2xl font-black text-amber-300 mt-1 block">
                {pendingVerifications}
              </span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-amber-950/60 border border-amber-800 flex items-center justify-center text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
          </div>

          <div className="p-5 rounded-xl bg-[#101D40] border border-[#1E3368] flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase text-slate-400 block">
                Paid Revenue (Minor Minor)
              </span>
              <span className="text-xl sm:text-2xl font-black text-[#176B43] mt-1 block">
                {formatBDT(totalRevenueMinor)}
              </span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-[#15244E] flex items-center justify-center text-[#176B43]">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>

          <div className="p-5 rounded-xl bg-[#101D40] border border-[#1E3368] flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase text-slate-400 block">
                Active Fulfillment
              </span>
              <span className="text-2xl font-black text-blue-400 mt-1 block">
                {activeFulfillmentCount}
              </span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-[#15244E] flex items-center justify-center text-blue-400">
              <Truck className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-[#1E3368] gap-4 sm:gap-8 mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 text-xs sm:text-sm font-black uppercase tracking-wider transition-colors relative whitespace-nowrap ${
              activeTab === 'orders' ? 'text-[#F5E8C9]' : 'text-slate-400 hover:text-white'
            }`}
          >
            All Orders ({orders.length})
            {activeTab === 'orders' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#F5E8C9]"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('verification')}
            className={`pb-3 text-xs sm:text-sm font-black uppercase tracking-wider transition-colors relative whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'verification' ? 'text-[#F5E8C9]' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Payment Verification Queue</span>
            {pendingVerifications > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-amber-500 text-black text-[10px] font-extrabold">
                {pendingVerifications}
              </span>
            )}
            {activeTab === 'verification' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#F5E8C9]"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`pb-3 text-xs sm:text-sm font-black uppercase tracking-wider transition-colors relative whitespace-nowrap ${
              activeTab === 'inventory' ? 'text-[#F5E8C9]' : 'text-slate-400 hover:text-white'
            }`}
          >
            Kit Inventory ({inventoryList.length} Variants)
            {activeTab === 'inventory' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#F5E8C9]"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`pb-3 text-xs sm:text-sm font-black uppercase tracking-wider transition-colors relative whitespace-nowrap ${
              activeTab === 'settings' ? 'text-[#F5E8C9]' : 'text-slate-400 hover:text-white'
            }`}
          >
            Store Settings
            {activeTab === 'settings' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#F5E8C9]"></span>
            )}
          </button>
        </div>

        {/* TAB 1: ALL ORDERS TABLE */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {/* Search & Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 p-4 rounded-xl bg-[#101D40] border border-[#1E3368]">
              <div className="sm:col-span-6 relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter by Order #, Customer, Phone, or TrxID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#090F21] border border-[#1E3368] rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#F5E8C9]"
                />
              </div>

              <div className="sm:col-span-3">
                <select
                  value={paymentFilter}
                  onChange={(e) => setPaymentFilter(e.target.value)}
                  className="w-full bg-[#090F21] border border-[#1E3368] rounded-lg px-3 py-2 text-xs text-white uppercase font-bold focus:outline-none focus:border-[#F5E8C9]"
                >
                  <option value="all">Payment: All</option>
                  <option value="paid">Paid</option>
                  <option value="verification_pending">Verification Pending</option>
                  <option value="unpaid">Unpaid</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div className="sm:col-span-3">
                <select
                  value={fulfillmentFilter}
                  onChange={(e) => setFulfillmentFilter(e.target.value)}
                  className="w-full bg-[#090F21] border border-[#1E3368] rounded-lg px-3 py-2 text-xs text-white uppercase font-bold focus:outline-none focus:border-[#F5E8C9]"
                >
                  <option value="all">Fulfillment: All</option>
                  <option value="pending_confirmation">Pending Confirmation</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                </select>
              </div>
            </div>

            {/* Orders Table */}
            <div className="rounded-xl bg-[#101D40] border border-[#1E3368] overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-[#090F21] text-[#F5E8C9] uppercase text-[10px] font-bold tracking-wider">
                    <tr>
                      <th className="p-3.5">Order ID & Date</th>
                      <th className="p-3.5">Customer & Destination</th>
                      <th className="p-3.5">Kit Items Snapshot</th>
                      <th className="p-3.5">Total & Method</th>
                      <th className="p-3.5">Payment State</th>
                      <th className="p-3.5">Fulfillment State</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1E3368]">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-10 text-slate-400">
                          No orders matched your search filters.
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((ord) => (
                        <tr key={ord.id} className="hover:bg-[#15244E]/40 transition-colors">
                          {/* Order ID & Link */}
                          <td className="p-3.5 whitespace-nowrap">
                            <Link
                              href={`/track/${ord.trackingToken}`}
                              target="_blank"
                              className="font-mono font-black text-white hover:text-[#F5E8C9] flex items-center gap-1"
                            >
                              <span>{ord.orderNumber}</span>
                              <ExternalLink className="w-3 h-3 text-slate-500" />
                            </Link>
                            <span suppressHydrationWarning className="text-[10px] text-slate-400 block mt-0.5">
                              {new Date(ord.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                            </span>
                          </td>

                          {/* Customer */}
                          <td className="p-3.5">
                            <span className="font-bold text-white block">{ord.customerName}</span>
                            <span className="text-[11px] font-mono text-slate-400 block">{ord.customerPhone}</span>
                            <span className="text-[10px] text-slate-400 block truncate max-w-[140px]">
                              {ord.cityDistrict} ({ord.deliveryArea})
                            </span>
                          </td>

                          {/* Items */}
                          <td className="p-3.5 max-w-[200px]">
                            {ord.items?.map((i) => (
                              <div key={i.id} className="text-[11px] truncate">
                                <span className="font-semibold text-white">{i.quantity}x</span> {i.productTitleSnapshot} ({i.sizeSnapshot})
                                {i.customizationDetails?.playerName && (
                                  <span className="text-[#F5E8C9] block text-[10px]">
                                    #{i.customizationDetails.playerNumber} {i.customizationDetails.playerName}
                                  </span>
                                )}
                              </div>
                            ))}
                          </td>

                          {/* Total */}
                          <td className="p-3.5 whitespace-nowrap">
                            <span className="font-black text-white block text-sm">
                              {formatBDT(ord.totalMinor)}
                            </span>
                            <span className="text-[10px] font-bold uppercase text-slate-400 block">
                              {ord.paymentMethod}
                            </span>
                            {ord.paymentRecord?.transactionId && (
                              <span className="font-mono text-[10px] text-[#F5E8C9] block">
                                Trx: {ord.paymentRecord.transactionId}
                              </span>
                            )}
                          </td>

                          {/* Payment State */}
                          <td className="p-3.5 whitespace-nowrap">
                            <span
                              className={`text-[10px] font-black uppercase px-2 py-0.5 rounded border inline-block ${
                                ord.paymentStatus === 'paid'
                                  ? 'bg-green-950 text-green-400 border-green-700'
                                  : ord.paymentStatus === 'verification_pending'
                                  ? 'bg-blue-950 text-blue-400 border-blue-700 animate-pulse'
                                  : ord.paymentStatus === 'rejected'
                                  ? 'bg-red-950 text-red-400 border-red-700'
                                  : 'bg-amber-950 text-amber-400 border-amber-700'
                              }`}
                            >
                              {ord.paymentStatus.replace('_', ' ')}
                            </span>
                          </td>

                          {/* Fulfillment State */}
                          <td className="p-3.5 whitespace-nowrap">
                            <select
                              value={ord.fulfillmentStatus}
                              onChange={(e) =>
                                handleFulfillmentChange(ord.id, e.target.value as FulfillmentStatus)
                              }
                              className="bg-[#090F21] border border-[#1E3368] rounded px-2 py-1 text-[11px] text-[#F5E8C9] font-bold uppercase focus:outline-none"
                            >
                              <option value="pending_confirmation">Pending Confirmation</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="processing">Processing</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>

                          {/* Actions */}
                          <td className="p-3.5 text-right whitespace-nowrap">
                            {ord.paymentStatus === 'verification_pending' ? (
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => handleVerify(ord.id)}
                                  className="px-2.5 py-1 rounded bg-[#176B43] hover:bg-[#1FA365] text-white text-[10px] font-black uppercase"
                                  title="Confirm payment received in mobile banking"
                                >
                                  Verify Paid
                                </button>
                                <button
                                  onClick={() => openRejectModal(ord)}
                                  className="px-2 py-1 rounded bg-red-900/60 hover:bg-red-800 text-red-300 text-[10px] font-bold uppercase"
                                  title="Reject incorrect TrxID"
                                >
                                  Reject
                                </button>
                              </div>
                            ) : ord.paymentStatus === 'unpaid' && ord.paymentMethod === 'cod' ? (
                              <button
                                onClick={() => handleVerify(ord.id)}
                                className="px-2.5 py-1 rounded bg-[#101D40] hover:bg-[#15244E] text-[#F5E8C9] text-[10px] font-bold border border-[#1E3368]"
                              >
                                Mark Paid (Cash)
                              </button>
                            ) : (
                              <span className="text-[10px] text-slate-500 font-mono">Up to date</span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PAYMENT VERIFICATION QUEUE */}
        {activeTab === 'verification' && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-800 text-xs text-amber-200">
              <span className="font-bold block uppercase mb-1">bKash & Nagad Verification Instructions</span>
              Cross-check the submitted Transaction ID and Sender Number against your physical bKash merchant or personal statement before clicking <strong>Verify & Mark Paid</strong>.
            </div>

            {pendingVerificationOrders.length === 0 ? (
              <div className="text-center py-16 bg-[#101D40] rounded-2xl border border-[#1E3368]">
                <CheckCircle2 className="w-12 h-12 text-[#176B43] mx-auto mb-3" />
                <h3 className="text-base font-bold uppercase text-white">All Clear!</h3>
                <p className="text-xs text-slate-400">There are no pending mobile money transactions awaiting verification.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pendingVerificationOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-6 rounded-2xl bg-[#101D40] border-2 border-amber-700/60 shadow-xl space-y-4"
                  >
                    <div className="flex items-center justify-between border-b border-[#1E3368] pb-3">
                      <div>
                        <span className="text-sm font-black uppercase text-white font-mono">
                          {ord.orderNumber}
                        </span>
                        <span className="text-[10px] text-slate-400 block">
                          Customer: {ord.customerName} ({ord.customerPhone})
                        </span>
                      </div>
                      <span className="text-sm font-black text-[#F5E8C9]">
                        {formatBDT(ord.totalMinor)}
                      </span>
                    </div>

                    <div className="p-4 rounded-xl bg-[#090F21] border border-[#1E3368] space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Provider:</span>
                        <strong className="text-white uppercase font-bold">{ord.paymentMethod}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Sender Number:</span>
                        <span className="font-mono text-white">{ord.paymentRecord?.senderPhone || ord.customerPhone}</span>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-[#1E3368]">
                        <span className="text-slate-400">Submitted TrxID:</span>
                        <span className="font-mono font-black text-sm text-[#F5E8C9] tracking-wider px-2 py-0.5 rounded bg-[#101D40] border border-[#1E3368]">
                          {ord.paymentRecord?.transactionId}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <button
                        onClick={() => handleVerify(ord.id)}
                        className="flex-1 py-2.5 rounded-lg bg-[#176B43] hover:bg-[#1FA365] text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Check className="w-4 h-4" />
                        <span>Verify & Mark Paid</span>
                      </button>
                      <button
                        onClick={() => openRejectModal(ord)}
                        className="py-2.5 px-4 rounded-lg bg-red-900/60 hover:bg-red-800 text-red-300 text-xs font-bold uppercase transition-colors"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: INVENTORY MANAGER */}
        {activeTab === 'inventory' && (
          <div className="rounded-xl bg-[#101D40] border border-[#1E3368] overflow-hidden shadow-xl">
            <div className="p-4 bg-[#090F21] border-b border-[#1E3368] flex items-center justify-between">
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-white">
                  Matchday Kit Variant Inventory
                </h3>
                <p className="text-[11px] text-slate-400">
                  Manage real-time stock levels for all sizes and editions.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-[#090F21] text-[#F5E8C9] uppercase text-[10px] font-bold">
                  <tr>
                    <th className="p-3.5">Product</th>
                    <th className="p-3.5">SKU</th>
                    <th className="p-3.5">Size</th>
                    <th className="p-3.5 text-center">In-Stock Quantity</th>
                    <th className="p-3.5 text-right">Quick Adjust</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1E3368]">
                  {inventoryList.map((item) => (
                    <tr key={item.variantId} className="hover:bg-[#15244E]/40 transition-colors">
                      <td className="p-3.5 font-bold text-white max-w-xs truncate">
                        {item.productTitle}
                      </td>
                      <td className="p-3.5 font-mono text-[11px] text-slate-400">
                        {item.sku}
                      </td>
                      <td className="p-3.5">
                        <span className="font-black text-[#F5E8C9] px-2 py-0.5 rounded bg-[#090F21] border border-[#1E3368]">
                          {item.size}
                        </span>
                      </td>
                      <td className="p-3.5 text-center font-bold text-sm">
                        <span
                          className={
                            item.stockQuantity <= 5
                              ? 'text-amber-400'
                              : item.stockQuantity === 0
                              ? 'text-red-400'
                              : 'text-white'
                          }
                        >
                          {item.stockQuantity}
                        </span>
                      </td>
                      <td className="p-3.5 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => handleStockAdjust(item.variantId, -1)}
                            className="w-7 h-7 rounded bg-[#090F21] hover:bg-[#15244E] text-white border border-[#1E3368] font-bold text-xs"
                          >
                            -
                          </button>
                          <button
                            onClick={() => handleStockAdjust(item.variantId, 1)}
                            className="w-7 h-7 rounded bg-[#090F21] hover:bg-[#15244E] text-white border border-[#1E3368] font-bold text-xs"
                          >
                            +
                          </button>
                          <button
                            onClick={() => handleStockAdjust(item.variantId, 10)}
                            className="px-2 h-7 rounded bg-[#176B43] hover:bg-[#1FA365] text-white text-[10px] font-bold uppercase ml-1"
                          >
                            +10
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: STORE SETTINGS */}
        {activeTab === 'settings' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-[#101D40] border border-[#1E3368] space-y-4">
              <h3 className="text-sm font-black uppercase tracking-wider text-white border-b border-[#1E3368] pb-3">
                Mobile Banking Accounts (Active)
              </h3>
              <div className="text-xs space-y-3">
                <div className="p-3 rounded-lg bg-[#090F21] border border-[#1E3368]">
                  <span className="text-[10px] font-bold uppercase text-pink-400 block">bKash Account</span>
                  <span className="font-mono text-base font-black text-white">01755998844</span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">Send Money / Merchant</span>
                </div>
                <div className="p-3 rounded-lg bg-[#090F21] border border-[#1E3368]">
                  <span className="text-[10px] font-bold uppercase text-orange-400 block">Nagad Account</span>
                  <span className="font-mono text-base font-black text-white">01944332211</span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">Personal Send Money</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#101D40] border border-[#1E3368] space-y-4">
              <h3 className="text-sm font-black uppercase tracking-wider text-white border-b border-[#1E3368] pb-3">
                Shipping Zones & Rates
              </h3>
              <div className="space-y-3">
                {SHIPPING_ZONES.map((zone) => (
                  <div key={zone.id} className="p-3 rounded-lg bg-[#090F21] border border-[#1E3368] flex justify-between items-center">
                    <div>
                      <span className="text-xs font-bold text-white block uppercase">{zone.name}</span>
                      <span className="text-[10px] text-slate-400">{zone.estimatedDays}</span>
                    </div>
                    <span className="text-sm font-black text-[#F5E8C9]">{formatBDT(zone.rateMinor)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Rejection Modal */}
        {isRejectModalOpen && selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl bg-[#101D40] border border-[#1E3368] p-6 space-y-4 shadow-2xl">
              <div className="flex items-center gap-2 text-red-400">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="text-sm font-black uppercase text-white">
                  Reject Payment for {selectedOrder.orderNumber}
                </h3>
              </div>

              <p className="text-xs text-slate-300">
                Please provide a reason. The customer will see this message on their order tracking page so they can submit the correct TrxID:
              </p>

              <textarea
                rows={3}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full bg-[#090F21] border border-[#1E3368] rounded-lg p-3 text-xs text-white focus:outline-none focus:border-red-400"
              ></textarea>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setIsRejectModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-bold uppercase text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmReject}
                  className="px-5 py-2 rounded-lg bg-red-700 hover:bg-red-600 text-white text-xs font-black uppercase tracking-wider"
                >
                  Confirm Rejection
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
