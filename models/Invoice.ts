import mongoose, { Schema, Document } from "mongoose";

export interface IInvoiceItem {
  id: string;
  name: string;
  hsn: string;
  qty: number;
  unit: string;
  price: number;
  taxable: number;
  cgst: number;
  sgst: number;
  total: number;
}

export interface IInvoice extends Document {
  customerName: string;
  address: string;
  gst: string;
  invoiceNumber: string;
  date: Date;
  items: IInvoiceItem[];
  subtotal: number;
  cgstTotal: number;
  sgstTotal: number;
  grandTotal: number;
  createdAt: Date;
}

const ItemSchema = new Schema<IInvoiceItem>({
  id: { type: String, required: true },
  name: { type: String, required: true },
  hsn: { type: String, required: true },
  qty: { type: Number, required: true },
  unit: { type: String, required: true },
  price: { type: Number, required: true },
  taxable: { type: Number, required: true },
  cgst: { type: Number, required: true },
  sgst: { type: Number, required: true },
  total: { type: Number, required: true },
});

const InvoiceSchema = new Schema<IInvoice>({
  customerName: { type: String, required: true },
  address: { type: String, required: true },
  gst: { type: String, required: false },
  invoiceNumber: { type: String, required: true, unique: true },
  date: { type: Date, required: true },
  items: { type: [ItemSchema], required: true },
  subtotal: { type: Number, required: true },
  cgstTotal: { type: Number, required: true },
  sgstTotal: { type: Number, required: true },
  grandTotal: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Since Next.js API routes are serverless, we need to handle model re-registration during development
if (mongoose.models.Invoice) {
  delete mongoose.models.Invoice;
}
export const Invoice = mongoose.model<IInvoice>("Invoice", InvoiceSchema);
