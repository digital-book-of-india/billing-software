"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import InvoiceForm from "@/components/InvoiceForm";
import { Loader2, ArrowLeft } from "lucide-react";

export default function EditInvoicePage() {
  const params = useParams();
  const router = useRouter();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params.id) return;

    const fetchInvoice = async () => {
      try {
        const res = await fetch(`/api/invoice/${params.id}`);
        const data = await res.json();
        if (data.success) {
          setInvoice(data.data);
        } else {
          alert("Invoice not found");
          router.push("/history");
        }
      } catch (err) {
        alert("Error loading invoice");
      } finally {
        setLoading(false);
      }
    };
    fetchInvoice();
  }, [params.id, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Fetching Invoice Details...</p>
      </div>
    );
  }

  if (!invoice) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-5xl mx-auto px-4 mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-bold transition-all"
        >
          <ArrowLeft size={20} /> Back to History
        </button>
      </div>
      <InvoiceForm initialData={invoice} />
    </div>
  );
}
