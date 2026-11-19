'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import {
  Package,
  CheckCircle2,
  Clock,
  Truck,
  ShieldCheck,
  AlertCircle,
  Copy,
  Check,
  Phone,
  MessageCircle,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import { getOrderByToken, submitPaymentRecord } from '@/lib/orders';
import { formatBDT } from '@/lib/currency';
import { Order, FulfillmentStatus, PaymentStatus } from '@/types';

export default function OrderTrackingDetailPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const resolvedParams = use(params);
  const rawToken = resolvedParams.token;
  const initialOrder = getOrderByToken(rawToken);

  const [order, setOrder] = useState<Order | undefined>(initialOrder);
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setMounted(true);
    const found = getOrderByToken(rawToken);
    if (found) {
      setOrder(found);
      setSenderPhone(found.customerPhone || '');
      setProvider(found.paymentMethod === 'nagad' ? 'nagad' : 'bkash');
    }
  }, [rawToken]);

  // Manual payment submission modal / form state
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [provider, setProvider] = useState<'bkash' | 'nagad'>(
    order?.paymentMethod === 'nagad' ? 'nagad' : 'bkash'
  );
  const [senderPhone, setSenderPhone] = useState(order?.customerPhone || '');
  const [transactionId, setTransactionId] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  if (!order) {
    if (!mounted) {
      return (
        <div className="min-h-[75vh] bg-[#090F21] flex flex-col items-center justify-center text-center px-4">
          <div className="w-8 h-8 border-2 border-[#176B43] border-t-[#F5E8C9] rounded-full animate-spin mb-3"></div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#F5E8C9]">
            Verifying matchday order token...
          </p>
        </div>
      );
    }

    return (
      <div className="min-h-[75vh] bg-[#090F21] flex flex-col items-center justify-center text-center px-4">
        <div className="w-16 h-16 rounded-full bg-[#101D40] flex items-center justify-center mb-4 border border-[#1E3368]">
          <AlertCircle className="w-8 h-8 text-amber-400" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black uppercase text-white mb-2">
          Order Not Found
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm mb-6 max-w-md">
          No matchday order could be found for token{' '}
          <span className="font-mono text-[#F5E8C9]">"{rawToken}"</span>. Please check for typos or search by your JOTG order ID.
        </p>
        <Link
          href="/track"
          className="px-6 py-2.5 bg-[#176B43] hover:bg-[#1FA365] text-white font-bold text-xs uppercase tracking-widest rounded-md"
        >
          Back to Tracking Search
        </Link>
      </div>
    );
  }

  const copyTrackingLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionId.trim()) return;

    const updated = submitPaymentRecord(order.id, {
      provider,
      senderPhone: senderPhone.trim() || order.customerPhone,
      transactionId: transactionId.trim(),
    });

    if (updated) {
      setOrder({ ...updated });
      setSubmitSuccess(true);
      setTimeout(() => {
        setShowPaymentForm(false);
        setSubmitSuccess(false);
      }, 2000);
    }
  };

  // Milestone Stepper
  const milestones: {
    status: FulfillmentStatus;
    title: string;
    description: string;
  }[] = [
    {
      status: 'pending_confirmation',
      title: 'Order Placed',
      description: 'Order registered in stadium warehouse',
    },
    {
      status: 'confirmed',
      title: 'Confirmed & Payment Verified',
      description:
        order.paymentMethod === 'cod'
          ? 'COD order verified by telephone'
          : 'bKash / Nagad transaction verified',
    },
    {
      status: 'processing',
      title: 'Preparation & Customization',
      description: 'Official crest verification and heat-press printing',
    },
    {
      status: 'shipped',
      title: 'Dispatched with Courier',
      description: 'Out for physical delivery to your address',
    },
    {
      status: 'delivered',
      title: 'Delivered',
      description: 'Handed over and kit unboxed',
    },
  ];

  const statusOrder: Record<FulfillmentStatus, number> = {
    pending_confirmation: 1,
    confirmed: 2,
    processing: 3,
    shipped: 4,
    delivered: 5,
    cancelled: 0,
  };

  const currentLevel = statusOrder[order.fulfillmentStatus] || 1;

  return (
    <div className="min-h-screen bg-[#090F21] py-10 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Navigation */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/track"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Search Another Order</span>
          </Link>

          <button
            onClick={copyTrackingLink}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#101D40] text-xs font-bold text-[#F5E8C9] border border-[#1E3368] hover:border-[#F5E8C9] transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Link Copied' : 'Share Tracking Link'}</span>
          </button>
        </div>

        {/* Order Header Card */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#101D40] border border-[#1E3368] mb-8 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-black uppercase text-white font-mono tracking-tight">
                  {order.orderNumber}
                </h1>
                <span
                  className={`text-[10px] font-black uppercase px-2.5 py-1 rounded border ${
                    order.fulfillmentStatus === 'delivered'
                      ? 'bg-green-950 text-green-400 border-green-700'
                      : order.fulfillmentStatus === 'shipped'
                      ? 'bg-blue-950 text-blue-400 border-blue-700'
                      : order.fulfillmentStatus === 'cancelled'
                      ? 'bg-red-950 text-red-400 border-red-700'
                      : 'bg-amber-950 text-amber-400 border-amber-700'
                  }`}
                >
                  {order.fulfillmentStatus.replace('_', ' ')}
                </span>
              </div>
              <p suppressHydrationWarning className="text-xs text-slate-400 mt-1">
                Placed on {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
              <div className="mt-2 text-[11px] font-mono text-slate-400">
                Secure Token: <span className="text-[#F5E8C9]">{order.trackingToken}</span>
              </div>
            </div>

            {/* Total Payable Badge */}
            <div className="p-4 rounded-xl bg-[#090F21] border border-[#1E3368] text-right">
              <span className="text-[11px] font-bold uppercase text-slate-400 block">
                Total Amount
              </span>
              <span className="text-2xl font-black text-[#F5E8C9]">
                {formatBDT(order.totalMinor)}
              </span>
              <span className="text-[10px] font-bold uppercase text-slate-400 block mt-0.5">
                Method: {order.paymentMethod.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Milestone Fulfillment Stepper */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#101D40] border border-[#1E3368] mb-8 shadow-xl">
          <h2 className="text-sm font-black uppercase tracking-wider text-white mb-6">
            Live Fulfillment Milestones
          </h2>

          <div className="relative">
            <div className="space-y-6">
              {milestones.map((milestone, idx) => {
                const milestoneLevel = idx + 1;
                const isCompleted = currentLevel > milestoneLevel;
                const isCurrent = currentLevel === milestoneLevel;

                return (
                  <div key={milestone.status} className="flex items-start gap-4">
                    <div className="relative flex flex-col items-center">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                          isCompleted
                            ? 'bg-[#176B43] text-white shadow-md shadow-[#176B43]/40'
                            : isCurrent
                            ? 'bg-[#F5E8C9] text-[#101D40] ring-4 ring-[#176B43]/30 scale-105'
                            : 'bg-[#090F21] text-slate-600 border border-[#1E3368]'
                        }`}
                      >
                        {isCompleted ? (
                          <Check className="w-5 h-5" />
                        ) : (
                          milestoneLevel
                        )}
                      </div>
                      {idx < milestones.length - 1 && (
                        <div
                          className={`w-0.5 h-10 mt-1 ${
                            isCompleted ? 'bg-[#176B43]' : 'bg-[#1E3368]'
                          }`}
                        ></div>
                      )}
                    </div>

                    <div className="pt-1 flex-1">
                      <h4
                        className={`text-sm font-bold uppercase ${
                          isCurrent
                            ? 'text-[#F5E8C9]'
                            : isCompleted
                            ? 'text-white'
                            : 'text-slate-500'
                        }`}
                      >
                        {milestone.title}
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {milestone.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Payment Verification Status & Submission */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#101D40] border border-[#1E3368] mb-8 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E3368] pb-5 mb-5">
            <div>
              <h2 className="text-sm font-black uppercase tracking-wider text-white">
                Payment Verification State
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Provider: <strong className="text-white uppercase">{order.paymentMethod}</strong>
              </p>
            </div>

            <div className="flex items-center gap-3">
              {order.paymentStatus === 'paid' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-950 text-green-400 border border-green-700 text-xs font-bold uppercase">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Payment Verified & Confirmed</span>
                </span>
              )}

              {order.paymentStatus === 'verification_pending' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-950 text-blue-400 border border-blue-700 text-xs font-bold uppercase animate-pulse">
                  <Clock className="w-4 h-4" />
                  <span>Staff Verification Pending</span>
                </span>
              )}

              {order.paymentStatus === 'unpaid' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-950 text-amber-400 border border-amber-700 text-xs font-bold uppercase">
                  <AlertCircle className="w-4 h-4" />
                  <span>Payment Unpaid</span>
                </span>
              )}

              {order.paymentStatus === 'rejected' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950 text-red-400 border border-red-700 text-xs font-bold uppercase">
                  <AlertCircle className="w-4 h-4" />
                  <span>TrxID Rejected - Re-submission Required</span>
                </span>
              )}
            </div>
          </div>

          {/* If payment record exists */}
          {order.paymentRecord && (
            <div className="p-4 rounded-xl bg-[#090F21] border border-[#1E3368] mb-4 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <span>Submitted Transaction ID:</span>
                <strong className="font-mono text-[#F5E8C9] text-sm tracking-wider">
                  {order.paymentRecord.transactionId || 'None'}
                </strong>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>Sender Mobile Number:</span>
                <span className="font-mono text-white">{order.paymentRecord.senderPhone || order.customerPhone}</span>
              </div>
              {order.paymentRecord.adminNotes && (
                <div className="flex items-center justify-between text-slate-300 pt-2 border-t border-[#1E3368]">
                  <span>Staff Note:</span>
                  <span className="text-amber-400 font-medium">{order.paymentRecord.adminNotes}</span>
                </div>
              )}
            </div>
          )}

          {/* Submit / Re-submit TrxID Button if needed */}
          {(order.paymentMethod === 'bkash' || order.paymentMethod === 'nagad') &&
            order.paymentStatus !== 'paid' && (
              <div>
                {!showPaymentForm ? (
                  <button
                    onClick={() => setShowPaymentForm(true)}
                    className="px-5 py-2.5 rounded-lg bg-[#15244E] hover:bg-[#1E3368] text-[#F5E8C9] text-xs font-bold uppercase tracking-wider border border-[#1E3368] transition-colors"
                  >
                    {order.paymentRecord?.transactionId
                      ? 'Update / Re-submit Transaction ID'
                      : 'Submit bKash / Nagad Transaction ID'}
                  </button>
                ) : (
                  <form
                    onSubmit={handlePaymentSubmit}
                    className="p-5 rounded-xl bg-[#090F21] border border-[#1E3368] space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase text-white">
                        Submit Payment Verification Details
                      </h4>
                      <button
                        type="button"
                        onClick={() => setShowPaymentForm(false)}
                        className="text-xs text-slate-400 hover:text-white"
                      >
                        Cancel
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                          Provider
                        </label>
                        <select
                          value={provider}
                          onChange={(e) => setProvider(e.target.value as any)}
                          className="w-full bg-[#101D40] border border-[#1E3368] rounded px-3 py-2 text-xs text-white"
                        >
                          <option value="bkash">bKash (01755998844)</option>
                          <option value="nagad">Nagad (01944332211)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                          Sender Mobile Number
                        </label>
                        <input
                          type="tel"
                          required
                          value={senderPhone}
                          onChange={(e) => setSenderPhone(e.target.value)}
                          className="w-full bg-[#101D40] border border-[#1E3368] rounded px-3 py-2 text-xs text-white font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                          Transaction ID (TrxID) *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. 9J28A77KL1"
                          value={transactionId}
                          onChange={(e) => setTransactionId(e.target.value.toUpperCase())}
                          className="w-full bg-[#101D40] border border-[#1E3368] rounded px-3 py-2 text-xs text-white font-mono uppercase"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-[#176B43] hover:bg-[#1FA365] text-white font-bold text-xs uppercase tracking-widest rounded-md"
                    >
                      {submitSuccess ? 'Submitted for Verification!' : 'Submit for Verification'}
                    </button>
                  </form>
                )}
              </div>
            )}
        </div>

        {/* Order Items & Customer Address Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Items snapshot */}
          <div className="lg:col-span-7 p-6 rounded-2xl bg-[#101D40] border border-[#1E3368] shadow-xl space-y-4">
            <h3 className="text-sm font-black uppercase tracking-wider text-white border-b border-[#1E3368] pb-3">
              Kits in this Order
            </h3>

            <div className="space-y-3">
              {order.items?.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl bg-[#090F21] border border-[#1E3368] flex items-start justify-between gap-4"
                >
                  <div>
                    <h4 className="text-xs font-bold uppercase text-white">
                      {item.productTitleSnapshot}
                    </h4>
                    <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-400">
                      <span>Size: <strong className="text-[#F5E8C9]">{item.sizeSnapshot}</strong></span>
                      <span>•</span>
                      <span>Qty: {item.quantity}</span>
                      {item.editionSnapshot && (
                        <>
                          <span>•</span>
                          <span>{item.editionSnapshot}</span>
                        </>
                      )}
                    </div>

                    {item.customizationDetails?.playerName && (
                      <div className="mt-2 p-2 rounded bg-[#101D40] border border-[#1E3368] text-[11px] text-[#F5E8C9]">
                        <span className="font-bold">Nameset:</span> #{item.customizationDetails.playerNumber || ''} {item.customizationDetails.playerName}
                        {item.customizationDetails.sleevePatch && (
                          <span className="block text-slate-400">
                            Patch: {item.customizationDetails.sleevePatch}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <span className="text-xs font-black text-white whitespace-nowrap">
                    {formatBDT(item.totalMinor)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-[#1E3368] space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span className="text-white font-medium">{formatBDT(order.subtotalMinor)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Delivery Charge</span>
                <span className="text-white font-medium">{formatBDT(order.shippingMinor)}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-white pt-2 border-t border-[#1E3368]">
                <span>Total Paid / Payable</span>
                <span className="text-[#F5E8C9]">{formatBDT(order.totalMinor)}</span>
              </div>
            </div>
          </div>

          {/* Delivery Details & Support */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-2xl bg-[#101D40] border border-[#1E3368] shadow-xl space-y-4">
              <h3 className="text-sm font-black uppercase tracking-wider text-white border-b border-[#1E3368] pb-3">
                Delivery Destination
              </h3>

              <div className="text-xs text-slate-300 space-y-2">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Customer Name</span>
                  <span className="font-bold text-white">{order.customerName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Contact Number</span>
                  <span className="font-mono text-white">{order.customerPhone}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Address</span>
                  <span className="text-white">
                    {order.deliveryAddress}, {order.deliveryArea}, {order.cityDistrict}
                  </span>
                </div>
                {order.customerNotes && (
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Special Instructions</span>
                    <span className="italic text-slate-400">{order.customerNotes}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Need Help Box */}
            <div className="p-6 rounded-2xl bg-[#090F21] border border-[#1E3368] space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-white">
                Matchday Customer Support
              </h4>
              <p className="text-xs text-slate-400">
                Need urgent assistance, delivery reschedule, or size confirmation? Our team is live on WhatsApp:
              </p>
              <div className="flex items-center gap-3 pt-1">
                <a
                  href="https://wa.me/8801755998844"
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#176B43] hover:bg-[#1FA365] text-white text-xs font-bold uppercase transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Live</span>
                </a>
                <a
                  href="tel:+8801755998844"
                  className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#101D40] hover:bg-[#15244E] text-[#F5E8C9] border border-[#1E3368] text-xs font-bold uppercase transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call Staff</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
