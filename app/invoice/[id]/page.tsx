"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Printer, Download, ArrowLeft, Loader2 } from "lucide-react";
import InvoiceTemplate from "@/components/InvoiceTemplate";
import { IInvoice } from "@/models/Invoice";

export default function InvoicePreviewPage() {
  const params = useParams();
  const router = useRouter();
  const invoiceRef = useRef<HTMLDivElement>(null);

  const [invoice, setInvoice] = useState<IInvoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!params.id) return;

    const fetchInvoice = async () => {
      try {
        const response = await fetch(`/api/invoice/${params.id}`);
        const data = await response.json();
        if (data.success) {
          setInvoice(data.data);
        } else {
          alert("Invoice not found.");
          router.push("/history");
        }
      } catch (error) {
        alert("Error loading invoice");
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [params.id, router]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    if (!invoice || !invoiceRef.current) return;
    setDownloading(true);

    try {
      // Import libraries dynamically
      const html2canvas = (await import("html2canvas")).default;
      const { jsPDF } = await import("jspdf");

      const element = invoiceRef.current;
      
      // Wait a moment for any final font rendering
      await new Promise(resolve => setTimeout(resolve, 500));

      const canvas = await html2canvas(element, {
        scale: 2, // 2 is usually enough and more stable
        useCORS: true,
        logging: true, // Enable logging for debugging
        backgroundColor: "#ffffff",
        allowTaint: true,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight, undefined, "FAST");
      pdf.save(`Invoice_${invoice.invoiceNumber.replace(/[/]/g, "_")}.pdf`);

    } catch (error: any) {
      console.error("Detailed PDF Error:", error);
      alert(`Bhai, PDF nahi ban paa raha: ${error.message || "Unknown Error"}. Aap 'Print' button daba kar 'Save as PDF' karlo, wo best quality dega.`);
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Loading Invoice Data...</p>
      </div>
    );
  }

  if (!invoice) return null;

  return (
    <main className="min-h-screen py-8 print:py-0" style={{ backgroundColor: "#f3f4f6" }}>
      {/* Controls Container (Hidden on Print) */}
      <div className="max-w-4xl mx-auto mb-6 px-4 print:hidden flex flex-col sm:flex-row justify-between items-center gap-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors p-2"
        >
          <ArrowLeft size={18} /> Back
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-white text-gray-800 border border-gray-300 px-4 py-2 rounded shadow-sm hover:bg-gray-50 transition-colors font-medium"
          >
            <Printer size={18} /> Print Invoice
          </button>
          <button
            onClick={handleDownloadPDF}
            disabled={downloading}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded shadow transition-colors hover:bg-blue-700 disabled:opacity-75 font-medium"
          >
            {downloading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Download size={18} />
            )}
            {downloading ? "Generating PDF..." : "Download PDF"}
          </button>
        </div>
      </div>

      {/* Invoice Wrapper */}
      <div className="overflow-x-auto pb-10 print:pb-0 px-2 sm:px-0 flex justify-center">
        <InvoiceTemplate data={invoice} ref={invoiceRef} />
      </div>
    </main>
  );
}
