import React from "react";
import { IInvoice } from "@/models/Invoice";
import { numberToWords } from "@/utils/numberToWords";

interface Props {
  data: IInvoice;
}

// Ensure the component references the outer wrapper strictly for Print layouts
const InvoiceTemplate = React.forwardRef<HTMLDivElement, Props>(({ data }, ref) => {
  return (
    <div 
      ref={ref} 
      className="bg-white"
      style={{
        width: "210mm",
        padding: "12mm",
        boxSizing: "border-box",
        fontSize: "12px",
        color: "#000",
        backgroundColor: "#fff",
        fontFamily: "'Inter', 'Roboto', sans-serif"
      }}
    >
      {/* Header section */}
      <div className="flex justify-between items-start pb-4 mb-6" style={{ borderBottom: "2px solid #1e293b" }}>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight uppercase" style={{ color: "#1e3a8a" }}>Tax Invoice</h1>
          <p className="mt-1 font-medium text-xs" style={{ color: "#64748b" }}>Original for Recipient</p>
        </div>
        <div className="text-right">
          <h2 className="text-2xl font-black tracking-tight" style={{ color: "#1e293b" }}>JASWIK TECHNOLOGIES INDIA</h2>
          <div className="text-[11px] leading-tight font-medium mt-1" style={{ color: "#475569" }}>
            <p>Plot no: 142, B-block</p>
            <p>kh no: 1175 Rangpuri EXTN, New Delhi-110037</p>
            <p className="font-bold text-gray-900 mt-1">Contact: +91 9711933958</p>
            <p className="mt-1 font-semibold border-t pt-1 inline-block border-slate-200">
              GSTIN: <span className="text-blue-700">07AEFPH1117L3ZO</span>, State: <span className="text-gray-900">Delhi</span>
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-4">
        <div className="p-4 rounded border" style={{ backgroundColor: "#f8fafc", borderColor: "#f1f5f9" }}>
          <h3 className="text-xs font-bold uppercase mb-2 tracking-wide border-b pb-1" style={{ color: "#64748b", borderColor: "#e2e8f0" }}>Bill To</h3>
          <p className="font-bold text-sm uppercase" style={{ color: "#1f2937" }}>{data.customerName}</p>
          <p className="whitespace-pre-wrap mt-1 leading-relaxed text-[11px]" style={{ color: "#4b5563" }}>{data.address}</p>
          <div className="mt-2 space-y-1">
            {data.gst && (
              <p className="bg-white inline-block px-1 border rounded text-[10px] font-medium" style={{ color: "#1f2937" }}>
                <span className="text-gray-400 font-semibold mr-1">GSTIN:</span>{data.gst}
              </p>
            )}
            {data.customerContact && (
              <p className="text-[10px] block" style={{ color: "#475569" }}>
                <span className="font-semibold text-gray-400 mr-1 uppercase">Contact:</span>{data.customerContact}
              </p>
            )}
          </div>
        </div>
        <div className="p-4 rounded border" style={{ backgroundColor: "#f8fafc", borderColor: "#f1f5f9" }}>
          <h3 className="text-xs font-bold uppercase mb-2 tracking-wide border-b pb-1" style={{ color: "#10b981", borderColor: "#e2e8f0" }}>Ship To</h3>
          <p className="font-bold text-sm uppercase" style={{ color: "#1f2937" }}>{data.shippingName || data.customerName}</p>
          <p className="whitespace-pre-wrap mt-1 leading-relaxed text-[11px]" style={{ color: "#4b5563" }}>{data.shippingAddress || data.address}</p>
          <div className="mt-2 space-y-1">
            {(data.shippingGst || data.gst) && (
              <p className="bg-white inline-block px-1 border rounded text-[10px] font-medium" style={{ color: "#1f2937" }}>
                <span className="text-gray-400 font-semibold mr-1">GSTIN:</span>{data.shippingGst || data.gst}
              </p>
            )}
            {(data.shippingContact || data.customerContact) && (
              <p className="text-[10px] block" style={{ color: "#475569" }}>
                <span className="font-semibold text-gray-400 mr-1 uppercase">Contact:</span>{data.shippingContact || data.customerContact}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-4 p-4 border rounded bg-slate-50" style={{ borderColor: "#e2e8f0" }}>
        <table className="w-full text-[11px]">
          <tbody>
            <tr>
              <td className="font-semibold py-1 text-gray-500 uppercase">Invoice No:</td>
              <td className="text-right font-bold text-gray-900">{data.invoiceNumber}</td>
            </tr>
            <tr>
              <td className="font-semibold py-1 text-gray-500 uppercase">Date:</td>
              <td className="text-right font-bold text-gray-900">
                {new Date(data.date).toLocaleString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric"
                })}
              </td>
            </tr>
          </tbody>
        </table>
        <table className="w-full text-[11px]">
          <tbody>
            {data.ewayBill && (
              <tr>
                <td className="font-semibold py-1 text-gray-500 uppercase">e-Way Bill No:</td>
                <td className="text-right font-bold text-gray-900 tracking-wider">{data.ewayBill}</td>
              </tr>
            )}
            <tr>
              <td className="font-semibold py-1 text-gray-500 uppercase">Place of Supply:</td>
              <td className="text-right font-bold text-gray-900">
                {data.shippingGst?.startsWith("07") || data.gst?.[0] === '0' && data.gst?.[1] === '7' ? "Delhi" : "Inter-State"}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Items Table */}
      <div className="mb-4 rounded overflow-hidden border" style={{ borderColor: "#cbd5e1" }}>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-white text-[10px]" style={{ backgroundColor: "#1e293b" }}>
              <th className="py-2 px-1 text-center border-r w-8" style={{ borderColor: "#475569" }}>#</th>
              <th className="py-2 px-2 border-r" style={{ borderColor: "#475569" }}>Item Name</th>
              <th className="py-2 px-1 border-r w-16 text-center" style={{ borderColor: "#475569" }}>HSN/SAC</th>
              <th className="py-2 px-1 border-r w-10 text-center" style={{ borderColor: "#475569" }}>Qty</th>
              <th className="py-2 px-1 border-r w-14 text-center" style={{ borderColor: "#475569" }}>Unit</th>
              <th className="py-2 px-1 border-r w-20 text-right" style={{ borderColor: "#475569" }}>Price</th>
              <th className="py-2 px-1 border-r w-20 text-right" style={{ borderColor: "#475569", backgroundColor: "#334155" }}>Taxable</th>
              <th className="py-2 px-1 border-r w-14 text-right" style={{ borderColor: "#475569", color: "#c7d2fe" }}>CGST</th>
              <th className="py-2 px-1 border-r w-14 text-right" style={{ borderColor: "#475569", color: "#c7d2fe" }}>SGST</th>
              <th className="py-2 px-1 border-r w-14 text-right" style={{ borderColor: "#475569", color: "#c7d2fe" }}>IGST</th>
              <th className="py-2 px-1 text-right w-24" style={{ backgroundColor: "#0f172a" }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item, index) => (
              <tr key={index} className="border-b even:bg-slate-50 last:border-b-0 text-[10px]" style={{ borderColor: "#e2e8f0" }}>
                <td className="py-2 px-1 text-center border-r text-slate-500" style={{ borderColor: "#e2e8f0" }}>{index + 1}</td>
                <td className="py-2 px-2 border-r font-medium text-gray-800" style={{ borderColor: "#e2e8f0" }}>{item.name}</td>
                <td className="py-2 px-1 border-r text-center text-slate-600" style={{ borderColor: "#e2e8f0" }}>{item.hsn}</td>
                <td className="py-2 px-1 border-r text-center font-semibold" style={{ borderColor: "#e2e8f0" }}>{item.qty}</td>
                <td className="py-2 px-1 border-r text-center text-slate-600 font-medium" style={{ borderColor: "#e2e8f0" }}>{item.unit}</td>
                <td className="py-2 px-1 border-r text-right" style={{ borderColor: "#e2e8f0" }}>{item.taxable.toFixed(2)}</td>
                <td className="py-2 px-1 border-r text-right font-semibold text-slate-800" style={{ borderColor: "#e2e8f0", backgroundColor: "#f8fafc" }}>{item.taxable.toFixed(2)}</td>
                <td className="py-2 px-1 border-r text-right text-slate-600" style={{ borderColor: "#e2e8f0" }}>{item.cgst.toFixed(2)}</td>
                <td className="py-2 px-1 border-r text-right text-slate-600" style={{ borderColor: "#e2e8f0" }}>{item.sgst.toFixed(2)}</td>
                <td className="py-2 px-1 border-r text-right text-slate-600 font-bold" style={{ borderColor: "#e2e8f0", color: item.igst > 0 ? "#1e40af" : "inherit" }}>{item.igst.toFixed(2)}</td>
                <td className="py-2 px-1 text-right font-bold text-gray-900" style={{ backgroundColor: "#f1f5f9" }}>{item.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary Footer */}
      <div className="flex justify-between items-start mt-4">
        <div className="w-3/5 pr-8">
          <div className="mb-4">
            <h4 className="font-bold text-[10px] mb-1 uppercase tracking-wider" style={{ color: "#64748b" }}>Amount in Words:</h4>
            <p className="italic font-bold text-xs p-2 border rounded bg-slate-50" style={{ color: "#1e293b", borderColor: "#e2e8f0" }}>
              {numberToWords(data.grandTotal)} ONLY
            </p>
          </div>
  
          <div className="mb-4 border p-3 rounded bg-slate-50" style={{ borderColor: "#e2e8f0" }}>
            <h4 className="font-bold text-[10px] mb-2 uppercase tracking-wide border-b pb-1" style={{ color: "#64748b", borderColor: "#cbd5e1" }}>Bank Details:</h4>
            <div className="text-sm font-bold mb-1" style={{ color: "#1f2937" }}>JASWIK TECHNOLOGIES INDIA</div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px]">
              <div style={{ color: "#64748b" }}>Bank Name:</div>
              <div className="font-semibold" style={{ color: "#1f2937" }}>HDFC BANK, PATEL NAGAR (NEW DELHI)</div>
              <div style={{ color: "#64748b" }}>Account No:</div>
              <div className="font-semibold" style={{ color: "#1f2937" }}>50200079881127</div>
              <div style={{ color: "#64748b" }}>IFSC Code:</div>
              <div className="font-semibold" style={{ color: "#1f2937" }}>HDFC0000144</div>
              <div style={{ color: "#64748b" }}>VPA:</div>
              <div className="font-semibold" style={{ color: "#1d4ed8" }}>9711933958@hdfcbank</div>
            </div>
          </div>
  
          <div>
            <h4 className="font-bold text-[10px] mb-1 uppercase tracking-wide italic" style={{ color: "#64748b" }}>Terms & Conditions:</h4>
            <ul className="text-[10px] list-decimal pl-4 space-y-0.5 font-medium" style={{ color: "#64748b" }}>
              <li>Discrepancy must be reported within 3 days.</li>
              <li>50% advance with work order.</li>
              <li>Interest @18% p.a. on delayed payments.</li>
              <li>Subject to Delhi jurisdiction.</li>
              <li className="font-bold text-gray-800">PAYMENT IN FAVOUR OF M/S. JASWIK TECHNOLOGIES INDIA.</li>
            </ul>
          </div>
        </div>

        <div className="w-2/5">
          <table className="w-full text-right border-collapse border rounded overflow-hidden" style={{ borderColor: "#1e293b" }}>
            <tbody>
              <tr className="border-b" style={{ borderColor: "#e2e8f0" }}>
                <td className="py-2 px-3 font-bold text-[10px] uppercase text-gray-500" style={{ backgroundColor: "#f8fafc" }}>Taxable Value</td>
                <td className="py-2 px-3 font-bold border-l" style={{ borderColor: "#e2e8f0" }}>₹{data.subtotal.toFixed(2)}</td>
              </tr>
              {data.igstTotal > 0 ? (
                <tr className="border-b" style={{ borderColor: "#e2e8f0" }}>
                  <td className="py-2 px-3 font-bold text-[10px] uppercase text-gray-500" style={{ backgroundColor: "#f1f5f9" }}>Total IGST (18%)</td>
                  <td className="py-2 px-3 font-bold border-l" style={{ borderColor: "#e2e8f0", color: "#1e40af" }}>₹{data.igstTotal.toFixed(2)}</td>
                </tr>
              ) : (
                <>
                  <tr className="border-b" style={{ borderColor: "#e2e8f0" }}>
                    <td className="py-2 px-3 font-bold text-[10px] uppercase text-gray-500" style={{ backgroundColor: "#f8fafc" }}>Total CGST (9%)</td>
                    <td className="py-2 px-3 font-bold border-l" style={{ borderColor: "#e2e8f0" }}>₹{data.cgstTotal.toFixed(2)}</td>
                  </tr>
                  <tr className="border-b" style={{ borderColor: "#e2e8f0" }}>
                    <td className="py-2 px-3 font-bold text-[10px] uppercase text-gray-500" style={{ backgroundColor: "#f8fafc" }}>Total SGST (9%)</td>
                    <td className="py-2 px-3 font-bold border-l" style={{ borderColor: "#e2e8f0" }}>₹{data.sgstTotal.toFixed(2)}</td>
                  </tr>
                </>
              )}
              <tr className="text-white font-bold text-lg" style={{ backgroundColor: "#1e293b" }}>
                <td className="py-3 px-3 uppercase tracking-widest text-[10px]">Grand Total</td>
                <td className="py-3 px-3">₹{data.grandTotal.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
          
          <div className="mt-8 text-center border-t border-dashed pt-4" style={{ borderColor: "#cbd5e1" }}>
            <p className="font-bold text-[10px]" style={{ color: "#1e293b" }}>For JASWIK TECHNOLOGIES INDIA</p>
            <div className="h-12"></div>
            <p className="text-[10px] font-bold italic" style={{ color: "#64748b" }}>Authorized Signature</p>
          </div>
        </div>
      </div>
    </div>
  );
});

InvoiceTemplate.displayName = "InvoiceTemplate";
export default InvoiceTemplate;
