import mongoose, { Schema, Document } from "mongoose";

export interface IPOItem {
  id: string;
  itemCode: string;
  hsn: string;
  itemName: string;
  itemDescription: string;
  purGrp: string;
  qty: number;
  uom: string;
  basicRate: number;
  discountPercent: number;
  netRate: number;
  totalAmount: number;
  igstPercent: number;
  grossTotalAmount: number;
}

export interface IPurchaseOrder extends Document {
  orderNumber: string;
  date: Date;
  
  // Supplier Detail
  supplierName: string;
  supplierCode: string;
  supplierAddress: string;
  supplierGst: string;
  supplierContactNo: string;
  contactPerson: string;
  supplierEmail: string;
  orderAddressCode: string;

  // Shipped Location
  shippedLocationName: string;
  shippedLocationAddress: string;

  // Invoice Location
  invoiceLocationName: string;
  invoiceLocationAddress: string;
  invoiceLocationGstin: string;

  // PO Details
  costCenterCode: string;
  costCenterName: string;
  projectId: string;
  poCategory: string;

  // Payment & Dates
  paymentTerm: string;
  poCreationDate: Date;
  poApprovalDate: Date;
  poCurrency: string;
  buyerName: string;
  
  // Escalation Buyer Detail
  escalationBuyerName: string;
  escalationBuyerMobile: string;
  escalationBuyerEmail: string;

  items: IPOItem[];
  
  totalBasicAmount: number;
  totalOtherCharges: number;
  totalIgstAmount: number;
  grandTotalAmount: number;
  
  amountInWords: string;
  remarks: string;
  standardTerms: string;
  
  createdAt: Date;
}

const ItemSchema = new Schema<IPOItem>({
  id: { type: String, required: true },
  itemCode: { type: String, required: true },
  hsn: { type: String, required: true },
  itemName: { type: String, required: true },
  itemDescription: { type: String, required: true },
  purGrp: { type: String, required: false },
  qty: { type: Number, required: true },
  uom: { type: String, required: true },
  basicRate: { type: Number, required: true },
  discountPercent: { type: Number, required: true, default: 0 },
  netRate: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  igstPercent: { type: Number, required: true, default: 0 },
  grossTotalAmount: { type: Number, required: true },
});

const POSchema = new Schema<IPurchaseOrder>({
  orderNumber: { type: String, required: true, unique: true },
  date: { type: Date, required: true },
  
  supplierName: { type: String, required: true },
  supplierCode: { type: String, required: false },
  supplierAddress: { type: String, required: true },
  supplierGst: { type: String, required: false },
  supplierContactNo: { type: String, required: false },
  contactPerson: { type: String, required: false },
  supplierEmail: { type: String, required: false },
  orderAddressCode: { type: String, required: false },

  shippedLocationName: { type: String, required: true },
  shippedLocationAddress: { type: String, required: true },

  invoiceLocationName: { type: String, required: true },
  invoiceLocationAddress: { type: String, required: true },
  invoiceLocationGstin: { type: String, required: false },

  costCenterCode: { type: String, required: false },
  costCenterName: { type: String, required: false },
  projectId: { type: String, required: false },
  poCategory: { type: String, required: false },

  paymentTerm: { type: String, required: false },
  poCreationDate: { type: Date, required: false },
  poApprovalDate: { type: Date, required: false },
  poCurrency: { type: String, required: false, default: "INR" },
  buyerName: { type: String, required: false },

  escalationBuyerName: { type: String, required: false },
  escalationBuyerMobile: { type: String, required: false },
  escalationBuyerEmail: { type: String, required: false },

  items: { type: [ItemSchema], required: true },
  
  totalBasicAmount: { type: Number, required: true },
  totalOtherCharges: { type: Number, required: true, default: 0 },
  totalIgstAmount: { type: Number, required: true },
  grandTotalAmount: { type: Number, required: true },
  
  amountInWords: { type: String, required: false },
  remarks: { type: String, required: false },
  standardTerms: { type: String, required: false },
  
  createdAt: { type: Date, default: Date.now },
});

if (mongoose.models.PurchaseOrder) {
  delete mongoose.models.PurchaseOrder;
}
export const PurchaseOrder = mongoose.model<IPurchaseOrder>("PurchaseOrder", POSchema);
