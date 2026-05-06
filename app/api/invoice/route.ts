import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Invoice } from "@/models/Invoice";

export async function GET() {
  try {
    await dbConnect();
    const invoices = await Invoice.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: invoices }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();

    // Auto-generate invoice number with prefix
    const prefix = body.prefix || "JTI";
    
    // Find last invoice with this prefix
    const lastInvoice = await Invoice.findOne({ 
      invoiceNumber: new RegExp(`^${prefix}/`) 
    }).sort({ createdAt: -1 });

    let newInvoiceNumber;
    if (prefix === "DBI") {
      if (lastInvoice && lastInvoice.invoiceNumber) {
        const match = lastInvoice.invoiceNumber.match(/(\d+)$/);
        const lastNumber = match ? parseInt(match[1], 10) : 11110;
        newInvoiceNumber = `${prefix}/${String(lastNumber + 1).padStart(5, "0")}`;
      } else {
        newInvoiceNumber = `${prefix}/11111`;
      }
    } else {
      // Logic for JTI and others
      if (lastInvoice && lastInvoice.invoiceNumber) {
        const match = lastInvoice.invoiceNumber.match(/(\d+)$/);
        const lastNumber = match ? parseInt(match[1], 10) : 0;
        newInvoiceNumber = `${prefix}/${String(lastNumber + 1).padStart(4, "0")}`;
      } else {
        newInvoiceNumber = `${prefix}/0001`;
      }
    }

    const invoiceData = {
      ...body,
      invoiceNumber: newInvoiceNumber,
      date: body.date ? new Date(body.date) : new Date(),
    };

    const newInvoice = await Invoice.create(invoiceData);
    return NextResponse.json({ success: true, data: newInvoice }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
