"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import PurchaseOrderForm from "@/components/PurchaseOrderForm";
import { Loader2, ArrowLeft } from "lucide-react";

export default function EditPOPage() {
  const params = useParams();
  const router = useRouter();
  const [po, setPo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params.id) return;

    const fetchPO = async () => {
      try {
        const res = await fetch(`/api/purchase-order/${params.id}`);
        const data = await res.json();
        if (data.success) {
          setPo(data.data);
        } else {
          alert("PO not found");
          router.push("/purchase-order/history");
        }
      } catch (err) {
        alert("Error loading PO");
      } finally {
        setLoading(false);
      }
    };
    fetchPO();
  }, [params.id, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Fetching PO Details...</p>
      </div>
    );
  }

  if (!po) return null;

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
      <PurchaseOrderForm initialData={po} />
    </div>
  );
}
