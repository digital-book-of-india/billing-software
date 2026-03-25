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

    // Auto-generate invoice number with JTI/ prefix
    const lastInvoice = await Invoice.findOne().sort({ createdAt: -1 });
    let newInvoiceNumber = "JTI/0001";
    if (lastInvoice && lastInvoice.invoiceNumber) {
      const match = lastInvoice.invoiceNumber.match(/(\d+)$/);
      const lastNumber = match ? parseInt(match[1], 10) : 0;
      newInvoiceNumber = `JTI/${String(lastNumber + 1).padStart(4, "0")}`;
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
