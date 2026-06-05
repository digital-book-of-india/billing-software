"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Eye, ArrowLeft, Clock, ShoppingBag, Download } from "lucide-react";
import { IPurchaseOrder } from "@/models/PurchaseOrder";

export default function POHistoryPage() {
  const [pos, setPos] = useState<IPurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"JTI" | "DBI">("JTI");

  // Load active tab from localStorage on mount
  useEffect(() => {
    const savedTab = localStorage.getItem("poActiveTab") as "JTI" | "DBI";
    if (savedTab && (savedTab === "JTI" || savedTab === "DBI")) {
      setActiveTab(savedTab);
    }
  }, []);

  // Save active tab to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("poActiveTab", activeTab);
  }, [activeTab]);

  useEffect(() => {
    const fetchPOs = async () => {
      try {
        const response = await fetch("/api/purchase-order");
        const data = await response.json();
        if (data.success) {
          setPos(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch POs", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPOs();
  }, []);

  const filteredPOs = pos.filter((po) => {
    const isDBI = po.orderNumber.startsWith("DBI") || 
                 (po.shippedLocationName && po.shippedLocationName.includes("DIGITAL"));
                      
    if (activeTab === "DBI") {
      return isDBI;
    } else {
      return !isDBI;
    }
  });

  return (
    <main className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-black flex items-center gap-3 text-slate-800 tracking-tighter">
            <ShoppingBag className="text-indigo-600 w-10 h-10" /> Purchase Order History
          </h1>
          <Link href="/" className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border-2 border-slate-100 text-sm text-indigo-600 hover:bg-indigo-50 font-black transition-all">
            <ArrowLeft size={16} /> BACK TO CREATE
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-white p-1.5 rounded-2xl shadow-xl shadow-slate-200 border border-slate-100 w-fit">
          <button
            onClick={() => setActiveTab("JTI")}
            className={`px-8 py-3 rounded-xl text-sm font-black transition-all tracking-widest uppercase ${
              activeTab === "JTI"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100"
                : "text-slate-400 hover:bg-slate-50"
            }`}
          >
            Jaswik Technologies
          </button>
          <button
            onClick={() => setActiveTab("DBI")}
            className={`px-8 py-3 rounded-xl text-sm font-black transition-all tracking-widest uppercase ${
              activeTab === "DBI"
                ? "bg-emerald-600 text-white shadow-lg shadow-emerald-100"
                : "text-slate-400 hover:bg-slate-50"
            }`}
          >
            Digital Book of India
          </button>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200 overflow-hidden border border-slate-100">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                  <th className="py-5 px-6 border-b">PO Number</th>
                  <th className="py-5 px-6 border-b">Date</th>
                  <th className="py-5 px-6 border-b">Supplier Name</th>
                  <th className="py-5 px-6 border-b text-right">Grand Total</th>
                  <th className="py-5 px-6 border-b text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Loading Records...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredPOs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-20 text-center text-slate-400 font-bold italic">
                      No purchase orders found for {activeTab === "JTI" ? "Jaswik" : "Digital Book"}.
                    </td>
                  </tr>
                ) : (
                  filteredPOs.map((po) => (
                    <tr key={String(po._id)} className="hover:bg-indigo-50/30 transition-colors group">
                      <td className="py-5 px-6 font-black text-slate-900 border-b">
                        {po.orderNumber}
                      </td>
                      <td className="py-5 px-6 text-slate-500 font-medium border-b text-sm">
                        {new Date(po.date).toLocaleString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric"
                        })}
                      </td>
                      <td className="py-5 px-6 text-slate-800 font-bold border-b">
                        {po.supplierName}
                      </td>
                      <td className="py-5 px-6 text-right font-black text-indigo-600 border-b text-lg">
                        ₹{po.grandTotalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-5 px-6 text-center border-b flex items-center justify-center gap-2">
                        <Link
                          href={`/purchase-order/${po._id}`}
                          className="inline-flex items-center justify-center bg-white text-indigo-600 border-2 border-indigo-100 hover:bg-indigo-600 hover:text-white w-10 h-10 rounded-xl transition-all shadow-sm"
                          title="View PO"
                        >
                          <Eye size={18} />
                        </Link>
                        <Link
                          href={`/purchase-order/edit/${po._id}`}
                          className="inline-flex items-center justify-center bg-white text-amber-600 border-2 border-amber-100 hover:bg-amber-600 hover:text-white w-10 h-10 rounded-xl transition-all shadow-sm"
                          title="Edit PO"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        </Link>
                        <a
                          href={`/api/generate-pdf?id=${po._id}&type=po`}
                          className="inline-flex items-center justify-center bg-white text-emerald-600 border-2 border-emerald-100 hover:bg-emerald-600 hover:text-white w-10 h-10 rounded-xl transition-all shadow-sm"
                          title="Download PDF"
                        >
                          <Download size={18} />
                        </a>
                        <button
                          onClick={() => {
                            if (confirm("Bhai, PO delete kardu?")) {
                              fetch(`/api/purchase-order/${po._id}`, { method: "DELETE" })
                                .then(res => res.json())
                                .then(data => {
                                  if (data.success) {
                                    setPos(prev => prev.filter(p => p._id !== po._id));
                                  } else {
                                    alert("Error: " + data.error);
                                  }
                                });
                            }
                          }}
                          className="inline-flex items-center justify-center bg-white text-rose-500 border-2 border-rose-100 hover:bg-rose-500 hover:text-white w-10 h-10 rounded-xl transition-all shadow-sm"
                          title="Delete PO"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
