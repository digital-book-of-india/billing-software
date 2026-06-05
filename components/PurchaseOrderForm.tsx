"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { PlusCircle, Save, FileText, Building2, User, History, X, Mail, Phone, MapPin, Briefcase, ShoppingBag, Globe } from "lucide-react";
import PORow from "./PORow";
import { IPOItem } from "@/models/PurchaseOrder";
import { numberToWords } from "@/utils/numberToWords";
import { SELLERS, SellerKey } from "@/lib/constants";

export default function PurchaseOrderForm({ initialData }: { initialData?: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [nextLoading, setNextLoading] = useState(!initialData);
  const [selectedSeller, setSelectedSeller] = useState<SellerKey>(initialData?.prefix || "JASWIK");

  // PO Basic Info
  const [orderNumber, setOrderNumber] = useState(initialData?.orderNumber || "");
  const [date, setDate] = useState(() => {
    const pad = (n: number) => n.toString().padStart(2, '0');
    const toLocalISO = (d: Date) => 
      `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;

    if (initialData?.date) {
      return toLocalISO(new Date(initialData.date));
    }
    return toLocalISO(new Date());
  });

  // Shipped & Invoice Locations
  const [shippedLocationName, setShippedLocationName] = useState(initialData?.shippedLocationName || "Jaswik Technologies India");
  const [shippedLocationAddress, setShippedLocationAddress] = useState(initialData?.shippedLocationAddress || "");
  const [invoiceLocationName, setInvoiceLocationName] = useState(initialData?.invoiceLocationName || "Jaswik Technologies India");
  const [invoiceLocationAddress, setInvoiceLocationAddress] = useState(initialData?.invoiceLocationAddress || "");
  const [invoiceLocationGstin, setInvoiceLocationGstin] = useState(initialData?.invoiceLocationGstin || "");
  const [sameAsShipped, setSameAsShipped] = useState(initialData ? (initialData.shippedLocationName === initialData.invoiceLocationName) : false);

  // Supplier Detail
  const [supplierName, setSupplierName] = useState(initialData?.supplierName || "");
  const [supplierCode, setSupplierCode] = useState(initialData?.supplierCode || "");
  const [supplierAddress, setSupplierAddress] = useState(initialData?.supplierAddress || "");
  const [supplierGst, setSupplierGst] = useState(initialData?.supplierGst || "");
  const [supplierContactNo, setSupplierContactNo] = useState(initialData?.supplierContactNo || "");
  const [contactPerson, setContactPerson] = useState(initialData?.contactPerson || "");
  const [supplierEmail, setSupplierEmail] = useState(initialData?.supplierEmail || "");
  const [orderAddressCode, setOrderAddressCode] = useState(initialData?.orderAddressCode || "");

  // PO Specifics
  const [costCenterCode, setCostCenterCode] = useState(initialData?.costCenterCode || "");
  const [costCenterName, setCostCenterName] = useState(initialData?.costCenterName || "");
  const [projectId, setProjectId] = useState(initialData?.projectId || "0");
  const [poCategory, setPoCategory] = useState(initialData?.poCategory || "SOE");

  // Payment & Terms
  const [paymentTerm, setPaymentTerm] = useState(initialData?.paymentTerm || "30 Days from Invoice Date");
  const [poCreationDate, setPoCreationDate] = useState(initialData?.poCreationDate || (() => new Date().toISOString().slice(0, 10)));
  const [poApprovalDate, setPoApprovalDate] = useState(initialData?.poApprovalDate || (() => new Date().toISOString().slice(0, 10)));
  const [poCurrency, setPoCurrency] = useState(initialData?.poCurrency || "INR");
  const [buyerName, setBuyerName] = useState(initialData?.buyerName || "");

  // Escalation Details
  const [escalationBuyerName, setEscalationBuyerName] = useState(initialData?.escalationBuyerName || "");
  const [escalationBuyerMobile, setEscalationBuyerMobile] = useState(initialData?.escalationBuyerMobile || "");
  const [escalationBuyerEmail, setEscalationBuyerEmail] = useState(initialData?.escalationBuyerEmail || "");

  // PO Financial Details
  const [remarks, setRemarks] = useState(initialData?.remarks || "Ok");
  const [standardTerms, setStandardTerms] = useState(initialData?.standardTerms || "");
  const [otherCharges, setOtherCharges] = useState(initialData?.otherCharges || 0);

  // Fetch next PO number and update locations when seller changes
  React.useEffect(() => {
    async function fetchNextPO() {
      setNextLoading(true);
      try {
        const prefix = SELLERS[selectedSeller].prefix;
        const res = await fetch(`/api/next-number?type=po&prefix=${prefix}`);
        const data = await res.json();
        if (data.success) {
          setOrderNumber(data.nextNumber);
        }
      } catch (err) {
        console.error("Failed to fetch next PO:", err);
      } finally {
        setNextLoading(false);
      }
    }
    fetchNextPO();
    
    // Auto-update locations based on seller
    const seller = SELLERS[selectedSeller];
    setShippedLocationName(seller.name);
    setShippedLocationAddress(seller.address);
    
    if (sameAsShipped) {
      setInvoiceLocationName(seller.name);
      setInvoiceLocationAddress(seller.address);
      setInvoiceLocationGstin(seller.gstin);
    }
  }, [selectedSeller, sameAsShipped]);

  // Keep invoice location in sync if "Same as Shipping" is enabled
  React.useEffect(() => {
    if (sameAsShipped) {
      setInvoiceLocationName(shippedLocationName);
      setInvoiceLocationAddress(shippedLocationAddress);
    }
  }, [sameAsShipped, shippedLocationName, shippedLocationAddress]);

  const fillTestData = () => {
    setOrderNumber("JTI/PO/2024/001");
    setSupplierName("Global Tech Solutions");
    setSupplierAddress("123, Business Park, Okhla Phase 3, New Delhi - 110020");
    setSupplierGst("07AAAAA0000A1Z5");
    setSupplierCode("GTS-001");
    setSupplierEmail("contact@globaltech.com");
    setContactPerson("Mr. Rajesh Sharma");
    
    setShippedLocationName("Jaswik Technologies India");
    setShippedLocationAddress("Plot No 45, Sector 18, Gurugram, Haryana");
    setSameAsShipped(true);
    setInvoiceLocationName("Jaswik Technologies India");
    setInvoiceLocationAddress("Plot No 45, Sector 18, Gurugram, Haryana");
    setInvoiceLocationGstin("06BBBBB0000B1Z5");

    setCostCenterCode("CC-DEL-01");
    setCostCenterName("IT Infrastructure");
    setProjectId("PROJ-999");
    setPoCategory("CAPEX");
    setPaymentTerm("Net 30 Days");
    setBuyerName("Prabhjot Singh");

    setEscalationBuyerName("Admin Head");
    setEscalationBuyerMobile("9876543210");
    setEscalationBuyerEmail("admin@jaswik.com");
    
    setItems([
      {
        id: crypto.randomUUID(),
        itemCode: "HW-001",
        itemName: "MacBook Pro M3",
        itemDescription: "14-inch, 16GB RAM, 512GB SSD",
        purGrp: "E01",
        qty: 2,
        uom: "NOS",
        basicRate: 150000,
        discountPercent: 5,
        hsn: "8471",
        netRate: 142500,
        totalAmount: 285000,
        igstPercent: 18,
        grossTotalAmount: 336300
      },
      {
        id: crypto.randomUUID(),
        itemCode: "SW-002",
        itemName: "Adobe Creative Cloud",
        itemDescription: "Annual Subscription - Team License",
        purGrp: "E01",
        qty: 1,
        uom: "NOS",
        basicRate: 45000,
        discountPercent: 0,
        hsn: "9983",
        netRate: 45000,
        totalAmount: 45000,
        igstPercent: 18,
        grossTotalAmount: 53100
      }
    ]);
  };

  // Determine if it's Interstate (Outside Delhi)
  const isInterstate = useMemo(() => {
    if (!supplierGst || supplierGst.length < 2) return false;
    
    // Get seller's state code (first 2 digits of GSTIN)
    const sellerGst = SELLERS[selectedSeller].gstin;
    const sellerStateCode = sellerGst.substring(0, 2);
    
    // Compare with supplier's state code
    const supplierStateCode = supplierGst.substring(0, 2);
    return sellerStateCode !== supplierStateCode;
  }, [supplierGst, selectedSeller]);

  const [items, setItems] = useState<IPOItem[]>([
    {
      id: crypto.randomUUID(),
      itemCode: "",
      hsn: "",
      itemName: "",
      itemDescription: "",
      purGrp: "E01",
      qty: 1,
      uom: "NOS",
      basicRate: 0,
      discountPercent: 0,
      netRate: 0,
      totalAmount: 0,
      igstPercent: 18,
      grossTotalAmount: 0,
    },
  ]);

  const updateItem = (id: string, field: keyof IPOItem, value: any) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          
          const basicRate = Number(updated.basicRate) || 0;
          const discountPercent = Number(updated.discountPercent) || 0;
          const qty = Number(updated.qty) || 0;
          const igstPercent = Number(updated.igstPercent) || 0;

          // Calculate Net Rate
          updated.netRate = Number((basicRate * (1 - discountPercent / 100)).toFixed(2));
          
          // Calculate Total Amount (Taxable)
          updated.totalAmount = Number((qty * updated.netRate).toFixed(2));
          
          // Calculate Gross Total Amount (Incl. GST)
          const gstAmount = updated.totalAmount * (igstPercent / 100);
          updated.grossTotalAmount = Number((updated.totalAmount + gstAmount).toFixed(2));
          
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
        itemCode: "",
        hsn: "",
        itemName: "",
        itemDescription: "",
        purGrp: "E01",
        qty: 1,
        uom: "NOS",
        basicRate: 0,
        discountPercent: 0,
        netRate: 0,
        totalAmount: 0,
        igstPercent: 18,
        grossTotalAmount: 0,
      },
    ]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const totals = useMemo(() => {
    return items.reduce(
      (acc, item) => {
        const qty = Number(item.qty) || 0;
        const basicRate = Number(item.basicRate) || 0;
        const discountPercent = Number(item.discountPercent) || 0;
        const igstPercent = Number(item.igstPercent) || 0;

        const netRate = basicRate * (1 - discountPercent / 100);
        const taxable = qty * netRate;
        const gst = taxable * (igstPercent / 100);
        const gross = taxable + gst;

        return {
          basicAmount: acc.basicAmount + taxable,
          igstAmount: acc.igstAmount + gst,
          grandTotal: acc.grandTotal + gross,
        };
      },
      { basicAmount: 0, igstAmount: 0, grandTotal: 0 }
    );
  }, [items]);

  const finalGrandTotal = totals.grandTotal + (Number(otherCharges) || 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = initialData ? `/api/purchase-order/${initialData._id}` : "/api/purchase-order";
      const response = await fetch(url, {
        method: initialData ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderNumber,
          date: date ? new Date(date).toISOString() : new Date().toISOString(),
          supplierName,
          supplierCode,
          supplierAddress,
          supplierGst,
          supplierContactNo,
          contactPerson,
          supplierEmail,
          orderAddressCode,
          shippedLocationName,
          shippedLocationAddress,
          invoiceLocationName,
          invoiceLocationAddress,
          invoiceLocationGstin,
          costCenterCode,
          costCenterName,
          projectId,
          poCategory,
          paymentTerm,
          poCreationDate,
          poApprovalDate,
          poCurrency,
          buyerName,
          escalationBuyerName,
          escalationBuyerMobile,
          escalationBuyerEmail,
          items: items.map(item => {
            const qty = Number(item.qty) || 0;
            const basicRate = Number(item.basicRate) || 0;
            const discountPercent = Number(item.discountPercent) || 0;
            const igstPercent = Number(item.igstPercent) || 0;
            const netRate = Number((basicRate * (1 - discountPercent / 100)).toFixed(2));
            const totalAmount = Number((qty * netRate).toFixed(2));
            const gstAmount = totalAmount * (igstPercent / 100);
            
            return {
              ...item,
              netRate,
              totalAmount,
              grossTotalAmount: Number((totalAmount + gstAmount).toFixed(2))
            };
          }),
          totalBasicAmount: totals.basicAmount,
          totalOtherCharges: Number(otherCharges) || 0,
          totalIgstAmount: totals.igstAmount,
          grandTotalAmount: finalGrandTotal,
          amountInWords: numberToWords(finalGrandTotal) + " ONLY",
          remarks,
          standardTerms,
        }),
      });

      const data = await response.json();
      if (data.success) {
        router.push(`/purchase-order/${data.data._id}`);
      } else {
        alert("Failed to create PO: " + data.error);
        setLoading(false);
      }
    } catch (error) {
      alert("An error occurred");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto bg-white p-8 rounded-xl shadow-2xl border border-gray-100">
      <div className="flex items-center justify-between border-b pb-6 mb-8 text-gray-800">
        <h2 className="text-3xl font-black flex items-center gap-3 tracking-tighter uppercase">
          <Briefcase className="text-indigo-600 w-8 h-8" />
          PURCHASE ORDER GENERATOR
        </h2>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={fillTestData}
            className="text-sm font-bold bg-indigo-50 text-indigo-600 px-6 py-2.5 rounded-lg hover:bg-indigo-100 border-2 border-indigo-100 transition-all"
          >
            FILL TEST DATA
          </button>
          <button
            type="button"
            className="text-sm font-bold bg-gray-100 px-6 py-2.5 rounded-lg hover:bg-gray-200 border-2 border-gray-100 transition-all flex items-center gap-2"
            onClick={() => router.push("/purchase-order/history")}
          >
            <History size={16} /> PO History
          </button>
        </div>
      </div>

      {/* Entity Selection (Seller) */}
      <div className="mb-8 bg-slate-50 p-6 rounded-2xl border-2 border-slate-100">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
          <Globe size={14} className="text-indigo-500" /> Issuing Entity (Seller)
        </h3>
        <div className="flex flex-col sm:flex-row gap-4">
          {Object.entries(SELLERS).map(([key, seller]) => (
            <button
              key={key}
              type="button"
              onClick={() => setSelectedSeller(key as SellerKey)}
              className={`flex-1 relative flex items-center gap-4 p-4 rounded-xl border-2 transition-all group ${
                selectedSeller === key
                  ? "bg-white border-indigo-600 shadow-lg shadow-indigo-100 -translate-y-1"
                  : "bg-white/50 border-slate-200 hover:border-slate-300 opacity-60 hover:opacity-100"
              }`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-black text-lg ${
                selectedSeller === key ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-400"
              }`}>
                {seller.prefix[0]}
              </div>
              <div className="text-left">
                <p className={`text-[10px] font-black uppercase tracking-tighter ${
                  selectedSeller === key ? "text-indigo-600" : "text-slate-400"
                }`}>
                  {seller.prefix} Profile
                </p>
                <p className="font-bold text-slate-800 text-sm">{seller.name}</p>
              </div>
              {selectedSeller === key && (
                <div className="absolute top-2 right-2">
                  <div className="w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center shadow-sm">
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Header Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100">
          <div>
            <label className="block text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Order Number *</label>
            <input
              type="text"
              required
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
              className="w-full border-2 border-indigo-100 rounded-xl px-4 py-3 text-sm font-bold focus:border-indigo-500 focus:ring-0 outline-none text-gray-900 placeholder:text-gray-400"
              placeholder="e.g. DCPL/PO/26-27/000177"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Order Date *</label>
            <input
              type="datetime-local"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border-2 border-indigo-100 rounded-xl px-4 py-3 text-sm font-bold focus:border-indigo-500 outline-none text-gray-900"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">PO Currency</label>
            <select
              value={poCurrency}
              onChange={(e) => setPoCurrency(e.target.value)}
              className="w-full border-2 border-indigo-100 rounded-xl px-4 py-3 text-sm font-bold focus:border-indigo-500 outline-none bg-white text-gray-900"
            >
              <option value="INR">INR - Indian Rupee</option>
              <option value="USD">USD - US Dollar</option>
            </select>
          </div>
        </div>

        {/* Sections Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Supplier Details */}
          <div className="space-y-6">
            <h3 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2 border-b-2 border-gray-100 pb-2">
              <User size={16} className="text-indigo-500" /> Supplier Details
            </h3>
            <div className="grid grid-cols-1 gap-5">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Supplier Name *</label>
                <input
                  type="text"
                  placeholder="Enter Supplier Name"
                  required
                  value={supplierName}
                  onChange={(e) => setSupplierName(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 focus:border-indigo-500 outline-none transition-all placeholder:text-gray-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Supplier Address *</label>
                <textarea
                  placeholder="Full Address"
                  required
                  value={supplierAddress}
                  onChange={(e) => setSupplierAddress(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 h-24 focus:border-indigo-500 outline-none resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Supplier Code</label>
                  <input
                    type="text"
                    placeholder="CODE"
                    value={supplierCode}
                    onChange={(e) => setSupplierCode(e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 focus:border-indigo-500 outline-none transition-all placeholder:text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Supplier GSTIN</label>
                  <input
                    type="text"
                    placeholder="07AAAAA..."
                    value={supplierGst}
                    onChange={(e) => setSupplierGst(e.target.value.toUpperCase())}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 focus:border-indigo-500 outline-none transition-all placeholder:text-gray-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Contact Person</label>
                  <input
                    type="text"
                    placeholder="Name"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 focus:border-indigo-500 outline-none transition-all placeholder:text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Supplier Email</label>
                  <input
                    type="email"
                    placeholder="email@example.com"
                    value={supplierEmail}
                    onChange={(e) => setSupplierEmail(e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 focus:border-indigo-500 outline-none transition-all placeholder:text-gray-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Locations */}
          <div className="space-y-8">
            {/* Shipped Location */}
            <div className="space-y-4">
              <h3 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2 border-b-2 border-gray-100 pb-2">
                <MapPin size={16} className="text-rose-500" /> Shipped Location
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Location Name</label>
                  <input
                    type="text"
                    placeholder="Shipping Entity Name"
                    value={shippedLocationName}
                    onChange={(e) => setShippedLocationName(e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 focus:border-rose-500 outline-none placeholder:text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Full Shipping Address</label>
                  <textarea
                    placeholder="Address"
                    value={shippedLocationAddress}
                    onChange={(e) => setShippedLocationAddress(e.target.value)}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 h-20 focus:border-rose-500 outline-none resize-none"
                  />
                </div>
              </div>
            </div>
            {/* Invoice Location */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b-2 border-gray-100 pb-2">
                <h3 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                  <FileText size={16} className="text-emerald-500" /> Invoice Location
                </h3>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={sameAsShipped}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setSameAsShipped(checked);
                      if (checked) {
                        setInvoiceLocationName(shippedLocationName);
                        setInvoiceLocationAddress(shippedLocationAddress);
                      } else {
                        // Clear if unchecked as per user request
                        setInvoiceLocationName("");
                        setInvoiceLocationAddress("");
                        setInvoiceLocationGstin("");
                      }
                    }}
                    className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-[10px] font-black text-gray-400 uppercase group-hover:text-emerald-600 transition-colors">Same as Shipping</span>
                </label>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Invoice Entity Name</label>
                  <input
                    type="text"
                    placeholder="Billing Entity"
                    value={sameAsShipped ? shippedLocationName : invoiceLocationName}
                    onChange={(e) => !sameAsShipped && setInvoiceLocationName(e.target.value)}
                    disabled={sameAsShipped}
                    className={`w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 focus:border-emerald-500 outline-none placeholder:text-gray-500 ${sameAsShipped ? 'bg-gray-50 opacity-75' : ''}`}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Invoice Address</label>
                    <input
                      type="text"
                      placeholder="Address"
                      value={sameAsShipped ? shippedLocationAddress : invoiceLocationAddress}
                      onChange={(e) => !sameAsShipped && setInvoiceLocationAddress(e.target.value)}
                      disabled={sameAsShipped}
                      className={`w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 focus:border-emerald-500 outline-none placeholder:text-gray-500 ${sameAsShipped ? 'bg-gray-50 opacity-75' : ''}`}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase mb-1">Invoice GSTIN</label>
                    <input
                      type="text"
                      placeholder="GSTIN"
                      value={invoiceLocationGstin}
                      onChange={(e) => setInvoiceLocationGstin(e.target.value.toUpperCase())}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 focus:border-emerald-500 outline-none placeholder:text-gray-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PO Logistics & Financials */}
        <div className="bg-gray-100 p-8 rounded-3xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-gray-500 uppercase">Cost Center Code</label>
            <input type="text" placeholder="CODE" value={costCenterCode} onChange={(e) => setCostCenterCode(e.target.value)} className="w-full bg-white border-2 border-gray-300 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 placeholder:text-gray-600 focus:border-indigo-500 outline-none" />
          </div>
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-gray-500 uppercase">Cost Center Name</label>
            <input type="text" placeholder="NAME" value={costCenterName} onChange={(e) => setCostCenterName(e.target.value)} className="w-full bg-white border-2 border-gray-300 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 placeholder:text-gray-600 focus:border-indigo-500 outline-none" />
          </div>
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-gray-500 uppercase">Project ID</label>
            <input type="text" placeholder="0" value={projectId} onChange={(e) => setProjectId(e.target.value)} className="w-full bg-white border-2 border-gray-300 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 placeholder:text-gray-600 focus:border-indigo-500 outline-none" />
          </div>
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-gray-500 uppercase">PO Category</label>
            <input type="text" placeholder="SOE" value={poCategory} onChange={(e) => setPoCategory(e.target.value)} className="w-full bg-white border-2 border-gray-300 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 placeholder:text-gray-600 focus:border-indigo-500 outline-none" />
          </div>
          
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-gray-500 uppercase">Payment Terms</label>
            <input type="text" placeholder="e.g. 30 Days" value={paymentTerm} onChange={(e) => setPaymentTerm(e.target.value)} className="w-full bg-white border-2 border-gray-300 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 placeholder:text-gray-600 focus:border-indigo-500 outline-none" />
          </div>
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-gray-500 uppercase">Creation Date</label>
            <input type="date" value={poCreationDate} onChange={(e) => setPoCreationDate(e.target.value)} className="w-full bg-white border-2 border-gray-300 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 focus:border-indigo-500 outline-none" />
          </div>
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-gray-500 uppercase">Approval Date</label>
            <input type="date" value={poApprovalDate} onChange={(e) => setPoApprovalDate(e.target.value)} className="w-full bg-white border-2 border-gray-300 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 focus:border-indigo-500 outline-none" />
          </div>
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-gray-500 uppercase">Buyer Name</label>
            <input type="text" value={buyerName} onChange={(e) => setBuyerName(e.target.value)} className="w-full bg-white border-2 border-gray-300 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 placeholder:text-gray-600 focus:border-indigo-500 outline-none" placeholder="e.g. Santosh Sawant" />
          </div>
        </div>

        {/* Line Items */}
        <div className="pt-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-black text-gray-800 flex items-center gap-3">
              <span className="w-8 h-8 bg-black text-white rounded-xl flex items-center justify-center text-sm shadow-lg shadow-gray-200">ITEM</span>
              Line Items
            </h3>
            <button
              type="button"
              onClick={addItem}
              className="flex items-center gap-2 text-xs font-black bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100"
            >
              <PlusCircle size={14} /> ADD PRODUCT
            </button>
          </div>

          <div className="hidden lg:grid grid-cols-12 gap-3 mb-4 px-2 text-[9px] font-black text-gray-400 uppercase tracking-widest text-center border-b pb-3">
            <div className="col-span-1">Sr.</div>
            <div className="col-span-2 text-left">Item Code</div>
            <div className="col-span-3 text-left">Item Details</div>
            <div className="col-span-1">Qty</div>
            <div className="col-span-1">UOM</div>
            <div className="col-span-1">Rate</div>
            <div className="col-span-1">Dis%</div>
            <div className="col-span-1">GST%</div>
            <div className="col-span-1">Action</div>
          </div>

          <div className="space-y-3">
            {items.map((item, index) => (
              <PORow
                key={item.id}
                index={index}
                item={item}
                updateItem={updateItem}
                removeItem={removeItem}
              />
            ))}
          </div>
        </div>

        {/* Footer Grid: Totals and Escalation */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 border-t pt-10">
          {/* Escalation Details */}
          <div className="bg-gray-100 p-8 rounded-3xl border-2 border-gray-200">
            <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Phone size={14} className="text-blue-500" /> Escalation Buyer Details
            </h4>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Escalation Person Name"
                value={escalationBuyerName}
                onChange={(e) => setEscalationBuyerName(e.target.value)}
                className="w-full bg-white border-2 border-gray-300 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 placeholder:text-gray-600 focus:border-blue-400 outline-none"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Mobile No"
                  value={escalationBuyerMobile}
                  onChange={(e) => setEscalationBuyerMobile(e.target.value)}
                  className="w-full bg-white border-2 border-gray-300 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 placeholder:text-gray-600 focus:border-blue-400 outline-none"
                />
                <input
                  type="email"
                  placeholder="Email ID"
                  value={escalationBuyerEmail}
                  onChange={(e) => setEscalationBuyerEmail(e.target.value)}
                  className="w-full bg-white border-2 border-gray-300 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 placeholder:text-gray-600 focus:border-blue-400 outline-none"
                />
              </div>
            </div>
            
            <div className="mt-8 space-y-4">
               <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                <FileText size={14} className="text-gray-400" /> Terms & Remarks
              </h4>
              <textarea
                placeholder="Remarks (e.g. Ok)"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="w-full bg-white border-2 border-gray-300 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 placeholder:text-gray-600 focus:border-gray-500 outline-none resize-none h-24"
              />
              <textarea
                placeholder="Standard Terms and Conditions"
                value={standardTerms}
                onChange={(e) => setStandardTerms(e.target.value)}
                className="w-full bg-white border-2 border-gray-300 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 placeholder:text-gray-600 focus:border-gray-500 outline-none resize-none h-32"
              />
            </div>
          </div>

          {/* Summary */}
          <div className="space-y-6">
            <div className="bg-indigo-600 p-8 rounded-3xl text-white shadow-2xl shadow-indigo-200">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-6 opacity-60">PO Financial Summary</h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center opacity-90 font-medium text-xs">
                  <span className="font-bold">Total Basic Amount</span>
                  <span className="text-sm">₹{totals.basicAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
                
                {!isInterstate ? (
                  <>
                    <div className="flex justify-between items-center opacity-90 font-medium text-xs">
                      <span className="font-bold">CGST (9%)</span>
                      <span className="text-sm">₹{(totals.igstAmount / 2).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between items-center opacity-90 font-medium text-xs">
                      <span className="font-bold">SGST (9%)</span>
                      <span className="text-sm">₹{(totals.igstAmount / 2).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-between items-center opacity-90 font-medium text-xs bg-white/10 p-2 rounded">
                    <span className="font-bold">IGST (18%)</span>
                    <span className="text-sm">₹{totals.igstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                )}
                
                <div className="flex justify-between items-center border-t border-white/20 pt-4">
                  <span className="text-xs font-bold uppercase tracking-widest">Other Charges</span>
                  <input
                    type="number"
                    value={otherCharges}
                    onChange={(e) => setOtherCharges(Number(e.target.value))}
                    className="w-32 bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-right font-black text-lg focus:bg-white/20 outline-none transition-all text-white"
                  />
                </div>
                <div className="flex justify-between items-end pt-6">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] mb-1 opacity-60">Grand Total</span>
                    <span className="text-3xl font-black tracking-tighter">
                      ₹{finalGrandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-6 rounded-3xl font-black text-lg tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl shadow-gray-200 disabled:opacity-50 flex items-center justify-center gap-3"
            >
              <Save size={24} />
              {loading ? "GENERATING PO..." : "CREATE PURCHASE ORDER"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
