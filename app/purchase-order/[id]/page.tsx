"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Printer, Download, ArrowLeft, Loader2 } from "lucide-react";
import PurchaseOrderTemplate from "@/components/PurchaseOrderTemplate";
import { IPurchaseOrder } from "@/models/PurchaseOrder";

export default function PurchaseOrderPreviewPage() {
  const params = useParams();
  const router = useRouter();
  const poRef = useRef<HTMLDivElement>(null);

  const [po, setPo] = useState<IPurchaseOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!params.id) return;

    const fetchPO = async () => {
      try {
        const response = await fetch(`/api/purchase-order/${params.id}`);
        const data = await response.json();
        if (data.success) {
          setPo(data.data);
        } else {
          alert("Purchase Order not found.");
          router.push("/");
        }
      } catch (error) {
        alert("Error loading Purchase Order");
      } finally {
        setLoading(false);
      }
    };

    fetchPO();
  }, [params.id, router]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    if (!po) return;
    setDownloading(true);

    try {
      // Use the professional backend PDF generator
      const response = await fetch(`/api/generate-pdf?id=${params.id}&type=po`);
      
      if (!response.ok) throw new Error("Backend failed");
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `PO_${po.orderNumber.replace(/[/]/g, "_")}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

    } catch (error: any) {
      console.error("PDF Error:", error);
      alert(`Bhai, Server-side PDF generate nahi ho pa raha. Aap 'Print' button daba kar 'Save as PDF' karlo, wo best quality dega.`);
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Loading PO Data...</p>
      </div>
    );
  }

  if (!po) return null;

  return (
    <main className="min-h-screen py-8 print:py-0 bg-slate-100">
      <div className="max-w-5xl mx-auto mb-6 px-4 print:hidden flex flex-col sm:flex-row justify-between items-center gap-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-black uppercase text-xs transition-colors p-2"
        >
          <ArrowLeft size={18} /> Back
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-white text-slate-800 border-2 border-slate-200 px-6 py-2.5 rounded-xl shadow-sm hover:bg-slate-50 transition-all font-black uppercase text-xs"
          >
            <Printer size={18} /> Print PO
          </button>
          <button
            onClick={handleDownloadPDF}
            disabled={downloading}
            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-xl shadow-lg shadow-indigo-100 transition-all hover:bg-indigo-700 disabled:opacity-75 font-black uppercase text-xs"
          >
            {downloading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Download size={18} />
            )}
            {downloading ? "Generating..." : "Download PDF"}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto pb-10 print:pb-0 px-2 sm:px-0 flex justify-center" data-pdf-content="true">
        <div className="bg-white shadow-2xl shadow-slate-200 rounded-lg overflow-hidden">
          <PurchaseOrderTemplate data={po} ref={poRef} />
        </div>
      </div>
    </main>
  );
}
