'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ShoppingBag,
  ShieldCheck,
  Truck,
  CheckCircle2,
  Copy,
  Check,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatBDT } from '@/lib/currency';
import { SHIPPING_ZONES, BANGLADESH_DISTRICTS } from '@/lib/data';
import { createNewOrder } from '@/lib/orders';
import { PaymentMethod } from '@/types';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotalMinor, clearCart } = useCart();

  // Customer Form
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [district, setDistrict] = useState('Dhaka');
  const [area, setArea] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');

  // Shipping & Payment
  const [selectedZoneId, setSelectedZoneId] = useState('zone-dhaka');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');

  // Pre-payment submission fields
  const [senderPhone, setSenderPhone] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [payLater, setPayLater] = useState(false);

  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const shippingZone =
    SHIPPING_ZONES.find((z) => z.id === selectedZoneId) || SHIPPING_ZONES[0];
  const shippingFeeMinor = shippingZone.rateMinor;
  const grandTotalMinor = subtotalMinor + shippingFeeMinor;

  // Auto-switch shipping zone when district changes
  const handleDistrictChange = (newDistrict: string) => {
    setDistrict(newDistrict);
    if (newDistrict === 'Dhaka') {
      setSelectedZoneId('zone-dhaka');
    } else {
      setSelectedZoneId('zone-nationwide');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (items.length === 0) {
      setErrorMsg('Your bag is empty. Please add jerseys before checking out.');
      return;
    }

    if (!name.trim()) {
      setErrorMsg('Please enter your full customer name.');
      return;
    }

    const cleanPhone = phone.trim().replace(/[^0-9]/g, '');
    if (cleanPhone.length < 11) {
      setErrorMsg('Please enter a valid 11-digit Bangladeshi mobile number (e.g. 017xxxxxxxx).');
      return;
    }

    if (!address.trim()) {
      setErrorMsg('Please enter your complete delivery street address.');
      return;
    }

    if (!area.trim()) {
      setErrorMsg('Please enter your delivery area / Thana.');
      return;
    }

    if ((paymentMethod === 'bkash' || paymentMethod === 'nagad') && !payLater) {
      if (!transactionId.trim()) {
        setErrorMsg(`Please enter your ${paymentMethod.toUpperCase()} Transaction ID (TrxID) or select 'Submit TrxID after placing order'.`);
        return;
      }
    }

    setSubmitting(true);

    try {
      const orderItems = items.map((i) => ({
        id: '',
        orderId: '',
        productId: i.productId,
        variantId: i.variantId,
        productTitleSnapshot: i.title,
        productSkuSnapshot: `${i.slug}-${i.size}`,
        sizeSnapshot: i.size,
        editionSnapshot: i.editionType,
        unitPriceMinor: i.unitPriceMinor,
        quantity: i.quantity,
        totalMinor: (i.unitPriceMinor + (i.customization?.customizationFeeMinor || 0)) * i.quantity,
        customizationDetails: i.customization,
      }));

      const newOrder = createNewOrder({
        customerName: name.trim(),
        customerPhone: phone.trim(),
        customerEmail: email.trim() || undefined,
        deliveryAddress: address.trim(),
        cityDistrict: district,
        deliveryArea: area.trim(),
        customerNotes: notes.trim() || undefined,
        paymentMethod,
        shippingZoneId: selectedZoneId,
        items: orderItems,
        subtotalMinor,
        shippingMinor: shippingFeeMinor,
        totalMinor: grandTotalMinor,
        paymentSubmission:
          !payLater && transactionId.trim()
            ? {
                senderPhone: senderPhone.trim() || phone.trim(),
                transactionId: transactionId.trim(),
              }
            : undefined,
      });

      clearCart();
      router.push(`/track/${newOrder.trackingToken}`);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to place order. Please try again.');
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[75vh] bg-[#090F21] flex flex-col items-center justify-center text-center px-4">
        <div className="w-20 h-20 rounded-full bg-[#101D40] flex items-center justify-center mb-6 border border-[#1E3368]">
          <ShoppingBag className="w-10 h-10 text-slate-500" />
        </div>
        <h1 className="text-3xl font-black uppercase text-white mb-2">Your Bag Is Empty</h1>
        <p className="text-slate-400 text-sm mb-6 max-w-md">
          Explore our latest club and national team drops to start your matchday order.
        </p>
        <Link
          href="/products"
          className="px-8 py-3.5 bg-[#176B43] hover:bg-[#1FA365] text-white font-black text-xs uppercase tracking-widest rounded-md transition-all shadow-lg shadow-[#176B43]/20"
        >
          BROWSE KITS
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090F21] py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Title */}
        <div className="mb-10 text-center sm:text-left">
          <span className="text-xs font-bold uppercase tracking-widest text-[#176B43]">
            SECURE MATCHDAY CHECKOUT
          </span>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white mt-1">
            CONFIRM YOUR <span className="text-[#F5E8C9]">ORDER</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Cash on Delivery nationwide & verified bKash / Nagad instant checkout.
          </p>
        </div>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Customer & Shipping & Payment */}
          <div className="lg:col-span-7 space-y-8">
            {/* Step 1: Customer Details */}
            <div className="p-6 rounded-2xl bg-[#101D40] border border-[#1E3368]">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-7 h-7 rounded-full bg-[#176B43] text-white font-black text-xs flex items-center justify-center">
                  1
                </div>
                <h2 className="text-base font-black uppercase tracking-wider text-white">
                  Customer & Contact Details
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#F5E8C9] mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tanvir Hossain"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#090F21] border border-[#1E3368] rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#F5E8C9]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#F5E8C9] mb-1.5">
                    Mobile Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="017XXXXXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#090F21] border border-[#1E3368] rounded-lg px-3.5 py-2.5 text-sm text-white font-mono placeholder-slate-500 focus:outline-none focus:border-[#F5E8C9]"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Our courier rider will call this number prior to delivery.
                  </span>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    placeholder="for order tracking confirmation"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#090F21] border border-[#1E3368] rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#F5E8C9]"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Delivery Address & District */}
            <div className="p-6 rounded-2xl bg-[#101D40] border border-[#1E3368]">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-7 h-7 rounded-full bg-[#176B43] text-white font-black text-xs flex items-center justify-center">
                  2
                </div>
                <h2 className="text-base font-black uppercase tracking-wider text-white">
                  Delivery Address & Shipping Zone
                </h2>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-[#F5E8C9] mb-1.5">
                      District *
                    </label>
                    <select
                      value={district}
                      onChange={(e) => handleDistrictChange(e.target.value)}
                      className="w-full bg-[#090F21] border border-[#1E3368] rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#F5E8C9]"
                    >
                      {BANGLADESH_DISTRICTS.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-[#F5E8C9] mb-1.5">
                      Thana / Area *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Banani / Mirpur / Dhanmondi"
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      className="w-full bg-[#090F21] border border-[#1E3368] rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#F5E8C9]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#F5E8C9] mb-1.5">
                    Full Street Address *
                  </label>
                  <textarea
                    rows={2}
                    required
                    placeholder="House number, road number, block or sector details..."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-[#090F21] border border-[#1E3368] rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#F5E8C9]"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                    Special Delivery Instructions (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Call before arrival, leave with security..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-[#090F21] border border-[#1E3368] rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#F5E8C9]"
                  />
                </div>

                {/* Shipping Zone Selector Pills */}
                <div className="pt-2">
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-2">
                    Shipping Method
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {SHIPPING_ZONES.map((zone) => (
                      <div
                        key={zone.id}
                        onClick={() => setSelectedZoneId(zone.id)}
                        className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                          selectedZoneId === zone.id
                            ? 'bg-[#15244E] border-[#F5E8C9] shadow-md'
                            : 'bg-[#090F21] border-[#1E3368] hover:border-slate-500'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white uppercase">{zone.name}</span>
                          <span className="text-xs font-black text-[#F5E8C9]">
                            {formatBDT(zone.rateMinor)}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400 block mt-1">
                          Delivery: {zone.estimatedDays}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Payment Method */}
            <div className="p-6 rounded-2xl bg-[#101D40] border border-[#1E3368]">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-7 h-7 rounded-full bg-[#176B43] text-white font-black text-xs flex items-center justify-center">
                  3
                </div>
                <h2 className="text-base font-black uppercase tracking-wider text-white">
                  Payment Method
                </h2>
              </div>

              {/* Method Tabs */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    paymentMethod === 'cod'
                      ? 'bg-[#176B43] border-[#1FA365] text-white font-black shadow-lg shadow-[#176B43]/20'
                      : 'bg-[#090F21] border-[#1E3368] text-slate-300 hover:text-white'
                  }`}
                >
                  <span className="block text-xs uppercase font-bold">Cash on Delivery</span>
                  <span className="text-[10px] opacity-80">Pay on arrival</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('bkash')}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    paymentMethod === 'bkash'
                      ? 'bg-[#D12053] border-pink-400 text-white font-black shadow-lg shadow-pink-900/30'
                      : 'bg-[#090F21] border-[#1E3368] text-slate-300 hover:text-white'
                  }`}
                >
                  <span className="block text-xs uppercase font-bold">bKash</span>
                  <span className="text-[10px] opacity-80">Send / Payment</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('nagad')}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    paymentMethod === 'nagad'
                      ? 'bg-[#F26522] border-orange-400 text-white font-black shadow-lg shadow-orange-900/30'
                      : 'bg-[#090F21] border-[#1E3368] text-slate-300 hover:text-white'
                  }`}
                >
                  <span className="block text-xs uppercase font-bold">Nagad</span>
                  <span className="text-[10px] opacity-80">Send Money</span>
                </button>
              </div>

              {/* Method Specific Details */}
              {paymentMethod === 'cod' && (
                <div className="p-4 rounded-xl bg-[#090F21] border border-[#1E3368] space-y-2 text-xs text-slate-300">
                  <div className="flex items-center gap-2 text-[#176B43] font-bold uppercase">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Pay Cash Upon Physical Delivery</span>
                  </div>
                  <p>
                    Inspect your football jersey upon delivery. Hand the total amount of{' '}
                    <strong className="text-white">{formatBDT(grandTotalMinor)}</strong> in cash to the rider.
                  </p>
                </div>
              )}

              {paymentMethod === 'bkash' && (
                <div className="p-4 rounded-xl bg-[#090F21] border border-[#D12053]/40 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold uppercase text-pink-400 block">
                        Official bKash Personal Number
                      </span>
                      <span className="text-base font-black text-white font-mono tracking-wider">
                        01755998844
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard('01755998844')}
                      className="px-3 py-1.5 rounded bg-[#101D40] text-pink-300 hover:text-white text-xs font-bold border border-[#1E3368] flex items-center gap-1.5"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>

                  <div className="text-[11px] text-slate-300 space-y-1">
                    <p>1. Open your bKash app and select <strong>Send Money</strong>.</p>
                    <p>2. Enter our number <span className="text-[#F5E8C9] font-mono">01755998844</span>.</p>
                    <p>3. Enter the exact total amount: <strong className="text-white">{formatBDT(grandTotalMinor)}</strong>.</p>
                    <p>4. Enter your bKash sender number and 10-character Transaction ID (TrxID) below.</p>
                  </div>

                  {!payLater ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">
                          Sender bKash Number
                        </label>
                        <input
                          type="tel"
                          placeholder={phone || '017XXXXXXXX'}
                          value={senderPhone}
                          onChange={(e) => setSenderPhone(e.target.value)}
                          className="w-full bg-[#101D40] border border-[#1E3368] rounded px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-pink-400"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">
                          bKash TrxID *
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 9J28A77KL1"
                          value={transactionId}
                          onChange={(e) => setTransactionId(e.target.value.toUpperCase())}
                          className="w-full bg-[#101D40] border border-[#1E3368] rounded px-3 py-2 text-xs text-white font-mono uppercase focus:outline-none focus:border-pink-400"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="p-2.5 rounded bg-[#101D40] text-xs text-[#F5E8C9]">
                      You can submit your bKash TrxID on the order tracking page right after placement.
                    </div>
                  )}

                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-400">
                    <input
                      type="checkbox"
                      checked={payLater}
                      onChange={(e) => setPayLater(e.target.checked)}
                      className="rounded border-[#1E3368] bg-[#090F21] text-[#176B43] focus:ring-0"
                    />
                    <span>I will send payment and submit TrxID right after placing the order</span>
                  </label>
                </div>
              )}

              {paymentMethod === 'nagad' && (
                <div className="p-4 rounded-xl bg-[#090F21] border border-[#F26522]/40 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold uppercase text-orange-400 block">
                        Official Nagad Personal Number
                      </span>
                      <span className="text-base font-black text-white font-mono tracking-wider">
                        01944332211
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard('01944332211')}
                      className="px-3 py-1.5 rounded bg-[#101D40] text-orange-300 hover:text-white text-xs font-bold border border-[#1E3368] flex items-center gap-1.5"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>

                  <div className="text-[11px] text-slate-300 space-y-1">
                    <p>1. Open your Nagad app and select <strong>Send Money</strong>.</p>
                    <p>2. Send exact amount of <strong className="text-white">{formatBDT(grandTotalMinor)}</strong> to <span className="text-[#F5E8C9] font-mono">01944332211</span>.</p>
                    <p>3. Copy the 8-character Nagad TrxID and paste it below.</p>
                  </div>

                  {!payLater ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">
                          Sender Nagad Number
                        </label>
                        <input
                          type="tel"
                          placeholder={phone || '019XXXXXXXX'}
                          value={senderPhone}
                          onChange={(e) => setSenderPhone(e.target.value)}
                          className="w-full bg-[#101D40] border border-[#1E3368] rounded px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-orange-400"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">
                          Nagad TrxID *
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 78XY904A"
                          value={transactionId}
                          onChange={(e) => setTransactionId(e.target.value.toUpperCase())}
                          className="w-full bg-[#101D40] border border-[#1E3368] rounded px-3 py-2 text-xs text-white font-mono uppercase focus:outline-none focus:border-orange-400"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="p-2.5 rounded bg-[#101D40] text-xs text-[#F5E8C9]">
                      You can submit your Nagad TrxID on the tracking page after order creation.
                    </div>
                  )}

                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-400">
                    <input
                      type="checkbox"
                      checked={payLater}
                      onChange={(e) => setPayLater(e.target.checked)}
                      className="rounded border-[#1E3368] bg-[#090F21] text-[#176B43] focus:ring-0"
                    />
                    <span>I will submit my Nagad TrxID on the tracking page</span>
                  </label>
                </div>
              )}
            </div>

            {/* Error Message Alert */}
            {errorMsg && (
              <div className="p-4 rounded-xl bg-red-950/60 border border-red-700/60 flex items-center gap-3 text-xs text-red-200">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>

          {/* Right Column: Order Summary & Place Order */}
          <div className="lg:col-span-5">
            <div className="sticky top-28 p-6 rounded-2xl bg-[#101D40] border border-[#1E3368] shadow-2xl space-y-6">
              <h3 className="text-base font-black uppercase tracking-wider text-white border-b border-[#1E3368] pb-4">
                Matchday Bag Summary ({items.reduce((acc, i) => acc + i.quantity, 0)})
              </h3>

              {/* Items List */}
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div
                    key={`${item.variantId}_${item.customization?.playerName || ''}`}
                    className="flex items-center gap-3 p-2.5 rounded-lg bg-[#090F21] border border-[#1E3368]/60"
                  >
                    <div className="relative w-12 h-14 rounded overflow-hidden bg-[#101D40] flex-shrink-0">
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold uppercase text-white truncate">
                        {item.title}
                      </h4>
                      <div className="text-[10px] text-slate-400">
                        Size: <strong className="text-[#F5E8C9]">{item.size}</strong> • Qty: {item.quantity}
                      </div>
                      {item.customization?.playerName && (
                        <div className="text-[10px] text-[#F5E8C9]">
                          Custom: #{item.customization.playerNumber || ''} {item.customization.playerName}
                        </div>
                      )}
                    </div>
                    <div className="text-xs font-black text-white whitespace-nowrap">
                      {formatBDT(
                        (item.unitPriceMinor + (item.customization?.customizationFeeMinor || 0)) *
                          item.quantity
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Cost Calculations */}
              <div className="pt-4 border-t border-[#1E3368] space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-300">
                  <span>Bag Subtotal</span>
                  <span className="font-bold text-white">{formatBDT(subtotalMinor)}</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Shipping ({shippingZone.name})</span>
                  <span className="font-bold text-white">{formatBDT(shippingFeeMinor)}</span>
                </div>
                <div className="pt-2 border-t border-[#1E3368] flex items-center justify-between text-base">
                  <span className="font-black text-white uppercase">Grand Total</span>
                  <span className="font-black text-[#F5E8C9] text-xl">
                    {formatBDT(grandTotalMinor)}
                  </span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-[#176B43] hover:bg-[#1FA365] disabled:bg-slate-700 text-white font-black text-xs sm:text-sm uppercase tracking-widest rounded-xl shadow-xl shadow-[#176B43]/30 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <span>GENERATING MATCHDAY ORDER...</span>
                ) : (
                  <>
                    <span>PLACE MATCHDAY ORDER</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 text-center">
                <ShieldCheck className="w-4 h-4 text-[#176B43]" />
                <span>Zero Risk • Guaranteed Authentic Football Wear</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
