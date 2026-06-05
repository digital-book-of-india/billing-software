import React from "react";
import { IPurchaseOrder } from "@/models/PurchaseOrder";
import { numberToWords } from "@/utils/numberToWords";

interface Props {
  data: IPurchaseOrder;
}

const PurchaseOrderTemplate = React.forwardRef<HTMLDivElement, Props>(({ data }, ref) => {
  return (
    <div 
      ref={ref} 
      className="bg-white print:p-0"
      style={{
        width: "210mm",
        padding: "10mm",
        boxSizing: "border-box",
        fontSize: "10px",
        color: "#000",
        fontFamily: "Arial, sans-serif"
      }}
    >
      {/* Header */}
      <div className="flex justify-between items-start border-b-2 border-black pb-2 mb-4">
        <div>
          <h1 className="text-3xl font-bold uppercase tracking-tight">Purchase Order</h1>
        </div>
        <div className="text-right">
          <h2 className="text-xl font-bold uppercase">{data.shippedLocationName}</h2>
          <p className="font-bold">Order Number : {data.orderNumber}</p>
          <p className="font-bold">Date : {new Date(data.date).toLocaleDateString("en-IN")}</p>
        </div>
      </div>

      {/* Info Sections */}
      <div className="grid grid-cols-3 gap-2 mb-4 border border-black p-2 bg-gray-50">
        <div className="border-r border-black pr-2">
          <h3 className="font-bold underline mb-1">Supplier Detail</h3>
          <p className="font-bold">{data.supplierName}</p>
          <p className="text-[9px] leading-tight">{data.supplierAddress}</p>
          {data.supplierGst && <p className="mt-1 font-bold">GSTIN : {data.supplierGst}</p>}
          {data.supplierContactNo && <p>Contact No : {data.supplierContactNo}</p>}
          {data.supplierEmail && <p>Email : {data.supplierEmail}</p>}
        </div>
        <div className="border-r border-black px-2">
          <h3 className="font-bold underline mb-1">Shipped Location</h3>
          <p className="font-bold">{data.shippedLocationName}</p>
          <p className="text-[9px] leading-tight">{data.shippedLocationAddress}</p>
        </div>
        <div className="pl-2">
          <h3 className="font-bold underline mb-1">Invoice Location</h3>
          <p className="font-bold">{data.invoiceLocationName}</p>
          <p className="text-[9px] leading-tight">{data.invoiceLocationAddress}</p>
          {data.invoiceLocationGstin && <p className="mt-1 font-bold">GSTIN : {data.invoiceLocationGstin}</p>}
        </div>
      </div>

      {/* Additional Details */}
      <div className="grid grid-cols-2 gap-4 mb-4 text-[9px] border border-black p-2">
        <div className="grid grid-cols-2 gap-y-1">
          <div className="font-bold">Cost Center Code :</div><div>{data.costCenterCode || "N/A"}</div>
          <div className="font-bold">Cost Center Name :</div><div>{data.costCenterName || "N/A"}</div>
          <div className="font-bold">Project ID :</div><div>{data.projectId || "0"}</div>
          <div className="font-bold">PO Category :</div><div>{data.poCategory || "N/A"}</div>
        </div>
        <div className="grid grid-cols-2 gap-y-1">
          <div className="font-bold">Payment Term :</div><div>{data.paymentTerm}</div>
          <div className="font-bold">PO Creation Date :</div><div>{data.poCreationDate ? new Date(data.poCreationDate).toLocaleDateString("en-IN") : "N/A"}</div>
          <div className="font-bold">PO Approval Date :</div><div>{data.poApprovalDate ? new Date(data.poApprovalDate).toLocaleDateString("en-IN") : "N/A"}</div>
          <div className="font-bold">Buyer Name :</div><div className="font-bold">{data.buyerName}</div>
        </div>
      </div>

      {/* Items Table */}
      <table className="w-full border-collapse border border-black mb-4">
        <thead>
          <tr className="bg-gray-100 text-[8px] font-bold">
            <th className="border border-black p-1">Sr.No</th>
            <th className="border border-black p-1">Item Code</th>
            <th className="border border-black p-1">HSN/SAC</th>
            <th className="border border-black p-1">Item Name / Description</th>
            <th className="border border-black p-1">Qty</th>
            <th className="border border-black p-1">UOM</th>
            <th className="border border-black p-1">Basic Rate</th>
            <th className="border border-black p-1">Dis %</th>
            <th className="border border-black p-1">Net Rate</th>
            {(() => {
              const sellerStateCode = data.invoiceLocationGstin ? data.invoiceLocationGstin.substring(0, 2) : "07";
              const supplierStateCode = data.supplierGst ? data.supplierGst.substring(0, 2) : "07";
              const isIntrastate = sellerStateCode === supplierStateCode;
              return isIntrastate ? (
                <>
                  <th className="border border-black p-1">CGST %</th>
                  <th className="border border-black p-1">SGST %</th>
                </>
              ) : (
                <th className="border border-black p-1">IGST %</th>
              );
            })()}
            <th className="border border-black p-1">Total Amount</th>
          </tr>
        </thead>
        <tbody>
          {data.items.map((item, idx) => (
            <tr key={idx} className="text-center text-[9px]">
              <td className="border border-black p-1">{idx + 1}</td>
              <td className="border border-black p-1">{item.itemCode}</td>
              <td className="border border-black p-1">{item.hsn}</td>
              <td className="border border-black p-1 text-left">
                <span className="font-bold">{item.itemName}</span>
                <p className="text-[7px] italic">{item.itemDescription}</p>
              </td>
              <td className="border border-black p-1 font-bold">{item.qty}</td>
              <td className="border border-black p-1">{item.uom}</td>
              <td className="border border-black p-1">{item.basicRate.toFixed(2)}</td>
              <td className="border border-black p-1">{item.discountPercent}%</td>
              <td className="border border-black p-1">{item.netRate.toFixed(2)}</td>
              {(() => {
                const sellerStateCode = data.invoiceLocationGstin ? data.invoiceLocationGstin.substring(0, 2) : "07";
                const supplierStateCode = data.supplierGst ? data.supplierGst.substring(0, 2) : "07";
                const isIntrastate = sellerStateCode === supplierStateCode;
                return isIntrastate ? (
                  <>
                    <td className="border border-black p-1">{(item.igstPercent / 2)}%</td>
                    <td className="border border-black p-1">{(item.igstPercent / 2)}%</td>
                  </>
                ) : (
                  <td className="border border-black p-1">{item.igstPercent}%</td>
                );
              })()}
              <td className="border border-black p-1 font-bold">₹{item.grossTotalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="flex justify-end mb-6">
        <table className="w-1/3 border-collapse border border-black text-[10px]">
          <tbody>
            <tr className="font-bold">
              <td className="border border-black p-1">Total Basic Amount</td>
              <td className="border border-black p-1 text-right">₹{data.totalBasicAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
            </tr>
            {(() => {
              const sellerStateCode = data.invoiceLocationGstin ? data.invoiceLocationGstin.substring(0, 2) : "07";
              const supplierStateCode = data.supplierGst ? data.supplierGst.substring(0, 2) : "07";
              const isIntrastate = sellerStateCode === supplierStateCode;

              if (isIntrastate) {
                return (
                  <>
                    <tr className="font-bold">
                      <td className="border border-black p-1">CGST Amount</td>
                      <td className="border border-black p-1 text-right">₹{(data.totalIgstAmount / 2).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                    </tr>
                    <tr className="font-bold">
                      <td className="border border-black p-1">SGST Amount</td>
                      <td className="border border-black p-1 text-right">₹{(data.totalIgstAmount / 2).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                    </tr>
                  </>
                );
              } else {
                return (
                  <tr className="font-bold">
                    <td className="border border-black p-1">IGST Amount</td>
                    <td className="border border-black p-1 text-right">₹{data.totalIgstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                  </tr>
                );
              }
            })()}
            <tr className="font-bold">
              <td className="border border-black p-1">Other Charges</td>
              <td className="border border-black p-1 text-right">₹{data.totalOtherCharges.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
            </tr>
            <tr className="font-black bg-black text-white text-xs">
              <td className="border border-black p-2">GRAND TOTAL</td>
              <td className="border border-black p-2 text-right">₹{data.grandTotalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mb-4">
        <p className="font-bold">Amount in Words: <span className="uppercase">{numberToWords(data.grandTotalAmount)} ONLY</span></p>
      </div>

      {/* Escalation Details (from Page 2 of image) */}
      <div className="border border-black p-3 rounded bg-gray-50 mb-4">
        <h3 className="font-bold underline mb-2">Escalation Buyer Detail</h3>
        <div className="grid grid-cols-3 gap-4 text-[9px]">
          <div><span className="font-bold">Name:</span> {data.escalationBuyerName || "N/A"}</div>
          <div><span className="font-bold">Mobile No:</span> {data.escalationBuyerMobile || "N/A"}</div>
          <div><span className="font-bold">Email - ID:</span> {data.escalationBuyerEmail || "N/A"}</div>
        </div>
      </div>

      {/* Remarks & Conditions */}
      <div className="grid grid-cols-2 gap-6 mt-10">
        <div>
          <h4 className="font-bold underline text-[9px] mb-1">Standard Terms And Condition :</h4>
          <p className="text-[8px] whitespace-pre-wrap">{data.standardTerms || "1. Discrepancy must be reported within 3 days.\n2. Interest @18% p.a. on delayed payments."}</p>
        </div>
        <div className="text-right">
          <p className="font-bold mb-10">For {data.shippedLocationName}</p>
          <div className="inline-block border-t border-black px-10 pt-1 font-bold">Authorized Signatory</div>
        </div>
      </div>
      
      {data.remarks && (
        <div className="mt-4 border-t pt-2">
          <p className="text-[9px]"><span className="font-bold">Remarks :</span> {data.remarks}</p>
        </div>
      )}
    </div>
  );
});

PurchaseOrderTemplate.displayName = "PurchaseOrderTemplate";
export default PurchaseOrderTemplate;
