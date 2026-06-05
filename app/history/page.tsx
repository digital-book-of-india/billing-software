"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Eye, ArrowLeft, Clock } from "lucide-react";
import { IInvoice } from "@/models/Invoice";

export default function HistoryPage() {
  const [invoices, setInvoices] = useState<IInvoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"JTI" | "DBI">("JTI");

  // Load active tab from localStorage on mount
  useEffect(() => {
    const savedTab = localStorage.getItem("invoiceActiveTab") as "JTI" | "DBI";
    if (savedTab && (savedTab === "JTI" || savedTab === "DBI")) {
      setActiveTab(savedTab);
    }
  }, []);

  // Save active tab to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("invoiceActiveTab", activeTab);
  }, [activeTab]);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await fetch("/api/invoice");
        const data = await response.json();
        if (data.success) {
          setInvoices(data.data);
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, []);

  const filteredInvoices = invoices.filter((invoice) => {
    const isDBI = invoice.prefix === "DBI" || 
                 invoice.invoiceNumber.startsWith("DBI") || 
                 (invoice.sellerName && invoice.sellerName.includes("DIGITAL"));
                     
    if (activeTab === "DBI") {
      return isDBI;
    } else {
      return !isDBI;
    }
  });

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-2 text-gray-800">
            <Clock className="text-blue-600" /> Invoice History
          </h1>
          <Link href="/" className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-medium">
            <ArrowLeft size={16} /> Back to Create
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-white p-1 rounded-lg shadow-sm border border-gray-100 w-fit">
          <button
            onClick={() => setActiveTab("JTI")}
            className={`px-6 py-2 rounded-md text-sm font-bold transition-all ${
              activeTab === "JTI"
                ? "bg-blue-600 text-white shadow-md"
                : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            Jaswik Technologies
          </button>
          <button
            onClick={() => setActiveTab("DBI")}
            className={`px-6 py-2 rounded-md text-sm font-bold transition-all ${
              activeTab === "DBI"
                ? "bg-emerald-600 text-white shadow-md"
                : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            Digital Book of India
          </button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-600 text-sm font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4 border-b">Invoice No</th>
                  <th className="py-3 px-4 border-b">Date</th>
                  <th className="py-3 px-4 border-b">Customer Name</th>
                  <th className="py-3 px-4 border-b text-right">Amount</th>
                  <th className="py-3 px-4 border-b text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-500">
                      Loading invoices...
                    </td>
                  </tr>
                ) : filteredInvoices.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-500">
                      No invoices found for this company.
                    </td>
                  </tr>
                ) : (
                  filteredInvoices.map((invoice) => (
                    <tr key={String(invoice._id)} className="hover:bg-gray-50 transition-colors text-sm">
                      <td className="py-3 px-4 font-medium text-gray-900 border-b">
                        {invoice.invoiceNumber}
                      </td>
                      <td className="py-3 px-4 text-gray-600 border-b">
                        {new Date(invoice.date).toLocaleString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </td>
                      <td className="py-3 px-4 text-gray-800 font-medium border-b">
                        {invoice.customerName}
                      </td>
                      <td className="py-3 px-4 text-right font-semibold text-gray-900 border-b">
                        ₹{invoice.grandTotal.toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-center border-b">
                        <div className="flex items-center justify-center gap-2">
                          <Link
                            href={`/invoice/${invoice._id}`}
                            className="inline-flex items-center justify-center text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-2 rounded-full transition-colors"
                            title="View Invoice"
                          >
                            <Eye size={18} />
                          </Link>
                          <Link
                            href={`/invoice/edit/${invoice._id}`}
                            className="inline-flex items-center justify-center text-amber-600 hover:text-amber-800 hover:bg-amber-50 p-2 rounded-full transition-colors"
                            title="Edit Invoice"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                          </Link>
                          <button
                            onClick={() => {
                              if (confirm("Bhai, pakka delete karna hai?")) {
                                fetch(`/api/invoice/${invoice._id}`, { method: "DELETE" })
                                  .then(res => res.json())
                                  .then(data => {
                                    if (data.success) {
                                      setInvoices(prev => prev.filter(inv => inv._id !== invoice._id));
                                    } else {
                                      alert("Error: " + data.error);
                                    }
                                  });
                              }
                            }}
                            className="inline-flex items-center justify-center text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-full transition-colors"
                            title="Delete Invoice"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                          </button>
                        </div>
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
