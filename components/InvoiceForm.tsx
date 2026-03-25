"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { PlusCircle, Save, FileText } from "lucide-react";
import ItemRow from "./ItemRow";
import { IInvoiceItem } from "@/models/Invoice";

export default function InvoiceForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [address, setAddress] = useState("");
  const [gst, setGst] = useState("");
  const [date, setDate] = useState(() => {
    const now = new Date();
    // Offset for local time format YYYY-MM-DDTHH:mm
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
      total: 0,
    },
  ]);

  const updateItem = (id: string, field: keyof IInvoiceItem, value: any) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          // Auto calculate taxes for this item
          updated.taxable = Number((updated.qty * updated.price).toFixed(2));
          updated.cgst = Number((updated.taxable * 0.09).toFixed(2));
          updated.sgst = Number((updated.taxable * 0.09).toFixed(2));
          updated.total = Number((updated.taxable + updated.cgst + updated.sgst).toFixed(2));
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
        total: 0,
      },
    ]);
  };

  const fillTestData = () => {
    setCustomerName("Jaswik Test Customer");
    setAddress("123, Test Street, Okhla Phase 3, New Delhi - 110020");
    setGst("07AAAAA0000A1Z5");
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
        total: 14160,
      }
    ]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const { subtotal, cgstTotal, sgstTotal, grandTotal } = useMemo(() => {
    return items.reduce(
      (acc, item) => ({
        subtotal: acc.subtotal + item.taxable,
        cgstTotal: acc.cgstTotal + item.cgst,
        sgstTotal: acc.sgstTotal + item.sgst,
        grandTotal: acc.grandTotal + item.total,
      }),
      { subtotal: 0, cgstTotal: 0, sgstTotal: 0, grandTotal: 0 }
    );
  }, [items]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          address,
          gst,
          date,
          items,
          subtotal,
          cgstTotal,
          sgstTotal,
          grandTotal,
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

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name *</label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full border rounded-md px-3 py-2 text-gray-900 bg-white placeholder-gray-400 focus:outline-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="Business or Individual Name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
              <textarea
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full border rounded-md px-3 py-2 h-20 text-gray-900 bg-white placeholder-gray-400 focus:outline-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="Billing Address"
              />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">GSTIN (Optional)</label>
              <input
                type="text"
                value={gst}
                onChange={(e) => setGst(e.target.value.toUpperCase())}
                className="w-full border rounded-md px-3 py-2 uppercase text-gray-900 bg-white placeholder-gray-400 focus:outline-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="22AAAAA0000A1Z5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Date *</label>
              <input
                type="datetime-local"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full border rounded-md px-3 py-2 text-gray-900 bg-white focus:outline-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Line Items</h3>
          <div className="hidden sm:grid grid-cols-12 gap-2 mb-2 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
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
            className="mt-4 flex items-center gap-2 text-sm text-blue-600 font-medium hover:text-blue-800 transition-colors bg-blue-50 px-3 py-1.5 rounded-md"
          >
            <PlusCircle size={16} /> Add Item
          </button>
        </div>

        <div className="border-t pt-4 flex flex-col items-end">
          <div className="w-64 space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Taxable Amount:</span>
              <span className="font-medium text-gray-800">₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>CGST (9%):</span>
              <span className="font-medium text-gray-800">₹{cgstTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>SGST (9%):</span>
              <span className="font-medium text-gray-800">₹{sgstTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t text-base font-bold text-gray-900">
              <span>Grand Total:</span>
              <span>₹{grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-8 border-t pt-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-md hover:bg-blue-700 flex items-center gap-2 font-medium disabled:opacity-70 transition-colors"
          >
            <Save size={18} />
            {loading ? "Saving..." : "Generate Invoice"}
          </button>
        </div>
      </form>
    </div>
  );
}
