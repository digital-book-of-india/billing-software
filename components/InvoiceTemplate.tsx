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
      className="bg-white print:shadow-none shadow-md mx-auto print:m-0 border print:border-none border-gray-200"
      style={{
        width: "210mm",
        minHeight: "297mm",
        padding: "15mm",
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
          <h2 className="text-xl font-bold text-gray-800">JASWIK TECHNOLOGIES INDIA</h2>
          <p className="text-gray-600 mt-1">Plot no: 142, B-block</p>
          <p className="text-gray-600">kh no: 1175 Rangpuri EXTN</p>
          <p className="text-gray-600 font-medium mt-1">GSTIN: 07AEFPH1117L3ZO, State:-Delhi</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-8">
        <div className="p-4 rounded border" style={{ backgroundColor: "#f8fafc", borderColor: "#f1f5f9" }}>
          <h3 className="text-xs font-bold uppercase mb-2 tracking-wide border-b pb-1" style={{ color: "#64748b", borderColor: "#e2e8f0" }}>Bill To</h3>
          <p className="font-bold text-sm" style={{ color: "#1f2937" }}>{data.customerName}</p>
          <p className="whitespace-pre-wrap mt-1 leading-relaxed" style={{ color: "#4b5563" }}>{data.address}</p>
          {data.gst && (
            <p className="mt-2 bg-white inline-block px-2 border rounded py-0.5 mt-2" style={{ color: "#1f2937" }}>
              <span className="font-semibold">GSTIN:</span> {data.gst}
            </p>
          )}
        </div>
        <div className="p-4 rounded border flex flex-col justify-center" style={{ backgroundColor: "#f8fafc", borderColor: "#f1f5f9" }}>
          <table className="w-full">
            <tbody>
              <tr>
                <td className="font-semibold py-1 border-b text-xs uppercase" style={{ color: "#475569", borderColor: "#e2e8f0" }}>Invoice No</td>
                <td className="text-right font-bold py-1 border-b" style={{ color: "#1f2937", borderColor: "#e2e8f0" }}>{data.invoiceNumber}</td>
              </tr>
              <tr>
                <td className="font-semibold py-1 border-b text-xs uppercase" style={{ color: "#475569", borderColor: "#e2e8f0" }}>Date</td>
                <td className="text-right font-medium py-1 border-b" style={{ color: "#1f2937", borderColor: "#e2e8f0" }}>
                  {new Date(data.date).toLocaleString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </td>
              </tr>
              <tr>
                <td className="font-semibold py-1 text-xs uppercase" style={{ color: "#475569" }}>Place of Supply</td>
                <td className="text-right font-medium py-1" style={{ color: "#1f2937" }}>Delhi</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-6 rounded overflow-hidden border" style={{ borderColor: "#cbd5e1" }}>
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
              <th className="py-2 px-1 border-r w-16 text-right" style={{ borderColor: "#475569", color: "#c7d2fe" }}>CGST (9%)</th>
              <th className="py-2 px-1 border-r w-16 text-right" style={{ borderColor: "#475569", color: "#c7d2fe" }}>SGST (9%)</th>
              <th className="py-2 px-1 text-right w-20" style={{ backgroundColor: "#0f172a" }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item, index) => (
              <tr key={index} className="border-b even:bg-slate-50 last:border-b-0 text-[11px]" style={{ borderColor: "#e2e8f0" }}>
                <td className="py-2 px-1 text-center border-r text-slate-500" style={{ borderColor: "#e2e8f0" }}>{index + 1}</td>
                <td className="py-2 px-2 border-r font-medium text-gray-800" style={{ borderColor: "#e2e8f0" }}>{item.name}</td>
                <td className="py-2 px-1 border-r text-center text-slate-600" style={{ borderColor: "#e2e8f0" }}>{item.hsn}</td>
                <td className="py-2 px-1 border-r text-center font-semibold" style={{ borderColor: "#e2e8f0" }}>{item.qty}</td>
                <td className="py-2 px-1 border-r text-center text-slate-600 font-medium" style={{ borderColor: "#e2e8f0" }}>{item.unit}</td>
                <td className="py-2 px-1 border-r text-right" style={{ borderColor: "#e2e8f0" }}>{item.taxable.toFixed(2)}</td>
                <td className="py-2 px-1 border-r text-right font-semibold text-slate-800" style={{ borderColor: "#e2e8f0", backgroundColor: "#f8fafc" }}>{item.taxable.toFixed(2)}</td>
                <td className="py-2 px-1 border-r text-right text-slate-600" style={{ borderColor: "#e2e8f0" }}>{item.cgst.toFixed(2)}</td>
                <td className="py-2 px-1 border-r text-right text-slate-600" style={{ borderColor: "#e2e8f0" }}>{item.sgst.toFixed(2)}</td>
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
            <h4 className="font-semibold text-xs mb-1 uppercase tracking-wide" style={{ color: "#1f2937" }}>Amount in Words:</h4>
            <p className="italic border p-2 rounded" style={{ color: "#374151", backgroundColor: "#f8fafc", borderColor: "#e2e8f0" }}>
              {numberToWords(data.grandTotal)}
            </p>
          </div>
 
          <div className="mb-4 border p-3 rounded" style={{ borderColor: "#e2e8f0" }}>
            <h4 className="font-semibold text-xs mb-2 uppercase tracking-wide border-b pb-1" style={{ color: "#1f2937", borderColor: "#e2e8f0" }}>Bank Details:</h4>
            <div className="text-sm font-bold mb-1" style={{ color: "#1f2937" }}>JASWIK TECHNOLOGIES INDIA</div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
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
            <h4 className="font-semibold text-xs mb-1 uppercase tracking-wide" style={{ color: "#1f2937" }}>Terms & Conditions:</h4>
            <ul className="text-[10px] sm:text-xs list-decimal pl-4 space-y-0.5" style={{ color: "#4b5563" }}>
              <li>In case of any discrepancy, please bring to our notice within 3 days of receipt of this bill. Failing which no claim will be Entertained.</li>
              <li>50% will be initiated at the time of work order</li>
              <li>Payment of our outstanding bills may kindly be paid within 3 days from the date of receipt of the goods or otherwise interest @ 18% per annum will be charged on all outstanding bills.</li>
              <li>All dispute subject to Delhi jurisdiction.</li>
              <li className="font-bold">PAYMENT SHOULD BE MADE IN FAVOUR OF M/S. JASWIK TECHNOLOGIES INDIA.</li>
            </ul>
          </div>
        </div>

        <div className="w-2/5 drop-shadow-sm">
          <table className="w-full text-right border-collapse border rounded overflow-hidden" style={{ borderColor: "#cbd5e1" }}>
            <tbody>
              <tr className="border-b" style={{ borderColor: "#e2e8f0" }}>
                <td className="py-2 px-3 font-semibold text-xs uppercase" style={{ color: "#475569", backgroundColor: "#f8fafc" }}>Total Taxable Value</td>
                <td className="py-2 px-3 font-bold border-l" style={{ borderColor: "#e2e8f0" }}>₹{data.subtotal.toFixed(2)}</td>
              </tr>
              <tr className="border-b" style={{ borderColor: "#e2e8f0" }}>
                <td className="py-2 px-3 font-semibold text-xs uppercase border-t" style={{ color: "#475569", backgroundColor: "#f8fafc", borderColor: "#e2e8f0" }}>Total CGST</td>
                <td className="py-2 px-3 font-medium border-l border-t" style={{ borderColor: "#e2e8f0" }}>₹{data.cgstTotal.toFixed(2)}</td>
              </tr>
              <tr className="border-b" style={{ borderColor: "#e2e8f0" }}>
                <td className="py-2 px-3 font-semibold text-xs uppercase" style={{ color: "#475569", backgroundColor: "#f8fafc" }}>Total SGST</td>
                <td className="py-2 px-3 font-medium border-l" style={{ borderColor: "#e2e8f0" }}>₹{data.sgstTotal.toFixed(2)}</td>
              </tr>
              <tr className="text-white font-bold text-lg" style={{ backgroundColor: "#1e293b" }}>
                <td className="py-3 px-3 uppercase tracking-wide text-xs">Grand Total</td>
                <td className="py-3 px-3">₹{data.grandTotal.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
          
          <div className="mt-12 text-center border-t-2 border-dashed pt-4 mx-4" style={{ borderColor: "#e2e8f0" }}>
            <p className="font-bold" style={{ color: "#1f2937" }}>For JASWIK TECHNOLOGIES INDIA</p>
            <p className="mt-10 italic" style={{ color: "#6b7280" }}>Authorized Signature</p>
          </div>
        </div>
      </div>
    </div>
  );
});

InvoiceTemplate.displayName = "InvoiceTemplate";
export default InvoiceTemplate;
