"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { PlusCircle, Save, FileText, Building2, Search, X, User, History } from "lucide-react";
import ItemRow from "./ItemRow";
import { IInvoiceItem } from "@/models/Invoice";
import { SELLERS, SellerKey } from "@/lib/constants";

export default function InvoiceForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [address, setAddress] = useState("");
  const [gst, setGst] = useState("");
  const [customerContact, setCustomerContact] = useState("");
  
  const [selectedSeller, setSelectedSeller] = useState<SellerKey>("JASWIK");
  
  const [shippingName, setShippingName] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [shippingGst, setShippingGst] = useState("");
  const [shippingContact, setShippingContact] = useState("");
  const [sameAsBilling, setSameAsBilling] = useState(true);
  
  const [customers, setCustomers] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isAutoFilled, setIsAutoFilled] = useState(false);
  
  const [ewayBill, setEwayBill] = useState("");
  const [date, setDate] = useState(() => {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000;
    const localISOTime = new Date(now.getTime() - offset).toISOString().slice(0, 16);
    return localISOTime;
  });

  const [items, setItems] = useState<IInvoiceItem[]>([
    {
      id: crypto.randomUUID(),
      name: "",
      hsn: "",
      qty: 1,
      unit: "PCS",
      price: 0,
      taxable: 0,
      cgst: 0,
      sgst: 0,
      igst: 0,
      total: 0,
    },
  ]);

  // Determine if we should use IGST or CGST/SGST based on the state code (07 is Delhi)
  const isInterstate = useMemo(() => {
    const activeGst = sameAsBilling ? gst : (shippingGst || gst);
    const sellerGst = SELLERS[selectedSeller].gstin;
    const sellerStateCode = sellerGst.substring(0, 2);
    return activeGst.length >= 2 && !activeGst.startsWith(sellerStateCode);
  }, [gst, shippingGst, sameAsBilling, selectedSeller]);

  const updateItem = (id: string, field: keyof IInvoiceItem, value: any) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          updated.taxable = Number((updated.qty * updated.price).toFixed(2));
          
          if (isInterstate) {
            updated.igst = Number((updated.taxable * 0.18).toFixed(2));
            updated.cgst = 0;
            updated.sgst = 0;
            updated.total = Number((updated.taxable + updated.igst).toFixed(2));
          } else {
            updated.cgst = Number((updated.taxable * 0.09).toFixed(2));
            updated.sgst = Number((updated.taxable * 0.09).toFixed(2));
            updated.igst = 0;
            updated.total = Number((updated.taxable + updated.cgst + updated.sgst).toFixed(2));
          }
          return updated;
        }
        return item;
      })
    );
  };

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: "",
        hsn: "",
        qty: 1,
        unit: "PCS",
        price: 0,
        taxable: 0,
        cgst: 0,
        sgst: 0,
        igst: 0,
        total: 0,
      },
    ]);
  };

  const fillTestData = () => {
    setCustomerName("Jaswik Test Customer");
    setAddress("123, Test Street, Okhla Phase 3, New Delhi - 110020");
    setGst("07AAAAA0000A1Z5");
    setCustomerContact("9876543210");
    setEwayBill("EWB12345678");
    setItems([
      {
        id: crypto.randomUUID(),
        name: "Laminated Bag - Small",
        hsn: "3923",
        qty: 500,
        unit: "PCS",
        price: 12.5,
        taxable: 6250,
        cgst: 562.5,
        sgst: 562.5,
        igst: 0,
        total: 7375,
      },
      {
        id: crypto.randomUUID(),
        name: "High Quality Roll - 200m",
        hsn: "3920",
        qty: 10,
        unit: "SET",
        price: 1200,
        taxable: 12000,
        cgst: 1080,
        sgst: 1080,
        igst: 0,
        total: 14160,
      }
    ]);
  };

  // Fetch customers on mount
  React.useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await fetch("/api/customers");
        const data = await res.json();
        if (data.success) {
          setCustomers(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch customers", error);
      }
    };
    fetchCustomers();
  }, []);

  // Close suggestions on click outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".customer-search-container")) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredCustomers = useMemo(() => {
    if (!customerName || isAutoFilled) return [];
    return customers.filter(c => 
      c.customerName.toLowerCase().includes(customerName.toLowerCase())
    ).slice(0, 5);
  }, [customerName, customers, isAutoFilled]);

  const selectCustomer = (customer: any) => {
    setCustomerName(customer.customerName);
    setAddress(customer.address);
    setGst(customer.gst || "");
    setCustomerContact(customer.customerContact || "");
    
    // Also handle shipping if needed, but usually we just fill billing
    // The user can then toggle "Same as Billing"
    
    setIsAutoFilled(true);
    setShowSuggestions(false);
  };

  const clearCustomerDetails = () => {
    // Keep customerName as per user request
    setAddress("");
    setGst("");
    setCustomerContact("");
    setIsAutoFilled(false);
  };

  const clearAddress = () => setAddress("");
  const clearGst = () => setGst("");
  const clearContact = () => setCustomerContact("");

  // Re-calculate all items when tax type changes (Interstate vs Intrastate)
  React.useEffect(() => {
    setItems((prev) =>
      prev.map((item) => {
        const taxable = item.taxable;
        if (isInterstate) {
          const igst = Number((taxable * 0.18).toFixed(2));
          return { ...item, igst, cgst: 0, sgst: 0, total: Number((taxable + igst).toFixed(2)) };
        } else {
          const cgst = Number((taxable * 0.09).toFixed(2));
          const sgst = Number((taxable * 0.09).toFixed(2));
          return { ...item, cgst, sgst, igst: 0, total: Number((taxable + cgst + sgst).toFixed(2)) };
        }
      })
    );
  }, [isInterstate]);

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const { subtotal, cgstTotal, sgstTotal, igstTotal, grandTotal } = useMemo(() => {
    return items.reduce(
      (acc, item) => ({
        subtotal: acc.subtotal + item.taxable,
        cgstTotal: acc.cgstTotal + item.cgst,
        sgstTotal: acc.sgstTotal + item.sgst,
        igstTotal: acc.igstTotal + item.igst,
        grandTotal: acc.grandTotal + item.total,
      }),
      { subtotal: 0, cgstTotal: 0, sgstTotal: 0, igstTotal: 0, grandTotal: 0 }
    );
  }, [items]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const finalShippingName = sameAsBilling ? customerName : shippingName;
    const finalShippingAddress = sameAsBilling ? address : shippingAddress;
    const finalShippingGst = sameAsBilling ? gst : shippingGst;
    const finalShippingContact = sameAsBilling ? customerContact : shippingContact;

    try {
      const response = await fetch("/api/invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          address,
          gst,
          customerContact,
          shippingName: finalShippingName,
          shippingAddress: finalShippingAddress,
          shippingGst: finalShippingGst,
          shippingContact: finalShippingContact,
          ewayBill,
          date,
          items,
          subtotal,
          cgstTotal,
          sgstTotal,
          igstTotal,
          grandTotal,
          sellerName: SELLERS[selectedSeller].name,
          sellerAddress: SELLERS[selectedSeller].address,
          sellerGst: SELLERS[selectedSeller].gstin,
          sellerContact: SELLERS[selectedSeller].contact,
          sellerBankDetails: SELLERS[selectedSeller].bankDetails,
          prefix: SELLERS[selectedSeller].prefix,
        }),
      });

      const data = await response.json();
      if (data.success) {
        router.push(`/invoice/${data.data._id}`);
      } else {
        alert("Failed to create invoice: " + data.error);
        setLoading(false);
      }
    } catch (error) {
      alert("An error occurred");
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    router.push("/login");
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md border border-gray-100">
      <div className="flex items-center justify-between border-b pb-4 mb-6 text-gray-800">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <FileText className="text-blue-600" />
          Create GST Invoice
        </h2>
        <div className="flex gap-2">
          <button
            type="button"
            className="text-sm bg-blue-50 text-blue-600 px-4 py-2 rounded-md hover:bg-blue-100 font-medium"
            onClick={fillTestData}
          >
            Fill Test Data
          </button>
          <button
            className="text-sm bg-gray-100 px-4 py-2 rounded-md hover:bg-gray-200"
            onClick={() => router.push("/history")}
          >
            View History
          </button>
          <button
            className="text-sm bg-red-50 text-red-600 px-4 py-2 rounded-md hover:bg-red-100 font-medium"
            onClick={handleLogout}
          >
            Sign Out
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Seller Selection Section */}
        <div className="bg-gradient-to-r from-slate-50 to-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-slate-600 uppercase tracking-widest flex items-center gap-2 mb-4">
            <Building2 size={18} className="text-blue-600" />
            Select Billing Company (Apni Company Chuno)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(Object.keys(SELLERS) as SellerKey[]).map((key) => (
              <label
                key={key}
                className={`relative flex items-center p-4 cursor-pointer rounded-lg border-2 transition-all duration-200 ${
                  selectedSeller === key
                    ? "border-blue-600 bg-blue-50 ring-4 ring-blue-50"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="seller"
                  value={key}
                  checked={selectedSeller === key}
                  onChange={() => setSelectedSeller(key)}
                  className="sr-only"
                />
                <div className="flex flex-col gap-1">
                  <span className={`font-bold text-sm ${selectedSeller === key ? "text-blue-700" : "text-gray-700"}`}>
                    {SELLERS[key].name}
                  </span>
                  <span className="text-[10px] text-gray-500 font-medium">GSTIN: {SELLERS[key].gstin}</span>
                </div>
                {selectedSeller === key && (
                  <div className="absolute top-2 right-2">
                    <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                )}
              </label>
            ))}
          </div>
        </div>

        {/* Billing and Shipping Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Bill To Section */}
          <div className="space-y-4">
            <h3 className="text-md font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2 border-b pb-1">
              <span className="w-2 h-4 bg-blue-600 rounded-full"></span>
              Bill To
            </h3>
            <div className="space-y-3">
              <div className="relative customer-search-container">
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-semibold text-gray-500">Customer Name *</label>
                  {isAutoFilled && (
                    <button 
                      type="button" 
                      onClick={clearCustomerDetails}
                      className="text-[10px] text-red-500 hover:text-red-700 flex items-center gap-1 font-bold"
                    >
                      <X size={12} /> CLEAR FETCHED DATA
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => {
                      setCustomerName(e.target.value);
                      setIsAutoFilled(false);
                      setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    className="w-full border rounded-md pl-9 pr-3 py-2 text-sm text-gray-900 bg-white focus:outline-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="Search or Enter Billing Name"
                  />
                  <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                </div>

                {showSuggestions && filteredCustomers.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
                    <div className="bg-gray-50 px-3 py-1.5 border-b flex items-center gap-2">
                      <History size={12} className="text-blue-500" />
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Recent Businesses</span>
                    </div>
                    {filteredCustomers.map((c, i) => (
                      <button
                        key={i}
                        type="button"
                        className="w-full text-left px-4 py-3 hover:bg-blue-50 flex flex-col border-b last:border-b-0 transition-colors"
                        onClick={() => selectCustomer(c)}
                      >
                        <div className="flex items-center gap-2">
                          <User size={14} className="text-blue-600" />
                          <span className="font-bold text-gray-800 text-sm">{c.customerName}</span>
                        </div>
                        <div className="flex flex-col ml-5 mt-1">
                          <span className="text-[10px] text-gray-500 line-clamp-1">{c.address}</span>
                          <span className="text-[10px] font-medium text-blue-600/70">{c.gst ? `GST: ${c.gst}` : "No GST"}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-semibold text-gray-500">Billing Address *</label>
                  {address && (
                    <button type="button" onClick={clearAddress} className="text-[10px] text-gray-400 hover:text-red-500 flex items-center gap-1">
                      <X size={10} /> CLEAR
                    </button>
                  )}
                </div>
                <textarea
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full border rounded-md px-3 py-2 text-sm h-20 text-gray-900 bg-white focus:outline-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="Full Billing Address"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-semibold text-gray-500">GSTIN</label>
                    {gst && (
                      <button type="button" onClick={clearGst} className="text-[10px] text-gray-400 hover:text-red-500 flex items-center gap-1">
                        <X size={10} /> CLEAR
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    value={gst}
                    onChange={(e) => setGst(e.target.value.toUpperCase())}
                    className="w-full border rounded-md px-3 py-2 text-sm uppercase text-gray-900 bg-white"
                    placeholder="07AAAAA0000A1Z5"
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-semibold text-gray-500">Contact No</label>
                    {customerContact && (
                      <button type="button" onClick={clearContact} className="text-[10px] text-gray-400 hover:text-red-500 flex items-center gap-1">
                        <X size={10} /> CLEAR
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    value={customerContact}
                    onChange={(e) => setCustomerContact(e.target.value)}
                    className="w-full border rounded-md px-3 py-2 text-sm text-gray-900 bg-white"
                    placeholder="9999988888"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Ship To Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b pb-1">
              <h3 className="text-md font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-4 bg-emerald-500 rounded-full"></span>
                Ship To
              </h3>
              <label className="flex items-center gap-2 text-xs font-medium text-blue-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={sameAsBilling}
                  onChange={(e) => setSameAsBilling(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                Same as Billing
              </label>
            </div>
            
            {!sameAsBilling ? (
              <div className="space-y-3 animate-in fade-in duration-300">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Shipping Name *</label>
                  <input
                    type="text"
                    required={!sameAsBilling}
                    value={shippingName}
                    onChange={(e) => setShippingName(e.target.value)}
                    className="w-full border rounded-md px-3 py-2 text-sm text-gray-900 bg-white focus:outline-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    placeholder="Shipping Name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Shipping Address *</label>
                  <textarea
                    required={!sameAsBilling}
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    className="w-full border rounded-md px-3 py-2 text-sm h-20 text-gray-900 bg-white focus:outline-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    placeholder="Full Shipping Address"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Shipping GSTIN</label>
                    <input
                      type="text"
                      value={shippingGst}
                      onChange={(e) => setShippingGst(e.target.value.toUpperCase())}
                      className="w-full border rounded-md px-3 py-2 text-sm uppercase text-gray-900 bg-white"
                      placeholder="07AAAAA0000A1Z5"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Shipping Contact No</label>
                    <input
                      type="text"
                      value={shippingContact}
                      onChange={(e) => setShippingContact(e.target.value)}
                      className="w-full border rounded-md px-3 py-2 text-sm text-gray-900 bg-white"
                      placeholder="9999977777"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-md p-4 text-sm text-gray-500 border border-dashed border-gray-200 h-[212px] flex items-center justify-center text-center">
                Same as billing details.<br/>Uncheck the box to provide a different<br/>shipping address.
              </div>
            )}
          </div>
        </div>

        {/* Invoice Info Section */}
        <div className="bg-blue-50/50 p-4 rounded-lg grid grid-cols-2 gap-4 border border-blue-100">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Invoice Date *</label>
            <input
              type="datetime-local"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border rounded-md px-3 py-2 text-sm text-gray-900 bg-white focus:outline-blue-500 h-10"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">e-Way Bill No.</label>
            <input
              type="text"
              value={ewayBill}
              onChange={(e) => setEwayBill(e.target.value.toUpperCase())}
              className="w-full border rounded-md px-3 py-2 text-sm text-gray-900 bg-white focus:outline-blue-500 h-10 tracking-widest uppercase"
              placeholder="OPTIONAL EWB NO"
            />
          </div>
        </div>

        {/* Line Items Section */}
        <div className="pt-4">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">2</span>
            Line Items
          </h3>
          <div className="hidden sm:grid grid-cols-12 gap-2 mb-2 px-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            <div className="col-span-1 text-center">#</div>
            <div className="col-span-3">Item Name</div>
            <div className="col-span-2">HSN/SAC</div>
            <div className="col-span-1">Qty</div>
            <div className="col-span-1">Unit</div>
            <div className="col-span-2">Price/Unit (₹)</div>
            <div className="col-span-1 text-right">Total</div>
            <div className="col-span-1 text-center">Action</div>
          </div>

          <div className="space-y-2">
            {items.map((item, index) => (
              <ItemRow
                key={item.id}
                index={index}
                item={item}
                updateItem={updateItem}
                removeItem={removeItem}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={addItem}
            className="mt-4 flex items-center gap-2 text-sm text-blue-600 font-bold hover:bg-blue-50 px-4 py-2 rounded-md transition-all border border-transparent hover:border-blue-200"
          >
            <PlusCircle size={18} /> Add New Row
          </button>
        </div>

        {/* Totals Section */}
        <div className="border-t pt-6 flex flex-col items-end">
          <div className="w-full max-w-xs space-y-3">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Taxable Amount</span>
              <span className="font-semibold text-gray-900">₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
            
            {!isInterstate ? (
              <>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>CGST (9%)</span>
                  <span className="font-semibold text-gray-900">₹{cgstTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>SGST (9%)</span>
                  <span className="font-semibold text-gray-900">₹{sgstTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
              </>
            ) : (
              <div className="flex justify-between text-sm text-gray-600 bg-blue-50 p-2 rounded border border-blue-100 italic">
                <span>IGST (18%)</span>
                <span className="font-bold text-blue-700">₹{igstTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
            )}
            
            <div className="flex justify-between pt-3 border-t-2 border-gray-100 text-lg font-black text-gray-900">
              <span>Grand Total</span>
              <span>₹{grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mt-10 border-t pt-6">
          <p className="text-xs text-gray-400 italic font-medium">
            * Indicates required fields. Tax will switch to IGST automatically for non-{SELLERS[selectedSeller].gstin.startsWith("09") ? "Uttar Pradesh" : "Delhi"} GSTINs.
          </p>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-10 py-3 rounded-lg hover:bg-blue-700 flex items-center gap-2 font-bold shadow-lg shadow-blue-200 transition-all active:scale-95 disabled:opacity-50"
          >
            <Save size={20} />
            {loading ? "PROCESSING..." : "GENERATE INVOICE"}
          </button>
        </div>
      </form>
    </div>
  );
}
