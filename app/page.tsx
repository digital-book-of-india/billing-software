"use client";

import React, { useState } from "react";
import InvoiceForm from "@/components/InvoiceForm";
import PurchaseOrderForm from "@/components/PurchaseOrderForm";
import { FileText, ShoppingCart } from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"invoice" | "po">("invoice");

  return (
    <main className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Modern Tab Switcher */}
        <div className="flex justify-center mb-10">
          <div className="bg-white p-1.5 rounded-2xl shadow-xl border border-gray-100 flex gap-2">
            <button
              onClick={() => setActiveTab("invoice")}
              className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-sm transition-all ${
                activeTab === "invoice"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-200 scale-105"
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              <FileText size={18} />
              TAX INVOICE
            </button>
            {/* <button
              onClick={() => setActiveTab("po")}
              className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-sm transition-all ${
                activeTab === "po"
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-105"
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              <ShoppingCart size={18} />
              PURCHASE ORDER
            </button> */}
          </div>
        </div>

        {activeTab === "invoice" ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="mb-8 text-center">
              <h1 className="text-4xl font-black text-blue-900 tracking-tighter">GST Invoice Generator</h1>
              <p className="mt-2 text-gray-500 font-medium">Create professional GST tax invoices in seconds.</p>
            </header>
            <InvoiceForm />
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="mb-8 text-center">
              <h1 className="text-4xl font-black text-indigo-900 tracking-tighter">Purchase Order System</h1>
              <p className="mt-2 text-gray-500 font-medium">Generate and manage enterprise purchase orders.</p>
            </header>
            <PurchaseOrderForm />
          </div>
        )}
      </div>
    </main>
  );
}
