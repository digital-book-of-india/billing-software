"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Eye, ArrowLeft, Clock } from "lucide-react";
import { IInvoice } from "@/models/Invoice";

export default function HistoryPage() {
  const [invoices, setInvoices] = useState<IInvoice[]>([]);
  const [loading, setLoading] = useState(true);

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
                ) : invoices.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-500">
                      No invoices found. Create one to get started.
                    </td>
                  </tr>
                ) : (
                  invoices.map((invoice) => (
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
                        <Link
                          href={`/invoice/${invoice._id}`}
                          className="inline-flex items-center justify-center text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-2 rounded-full transition-colors"
                          title="View Invoice"
                        >
                          <Eye size={18} />
                        </Link>
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
