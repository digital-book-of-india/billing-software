import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Invoice } from "@/models/Invoice";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    await dbConnect();
    
    const invoice = await Invoice.findById(resolvedParams.id);
    if (!invoice) {
      return NextResponse.json({ success: false, error: "Invoice not found" }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: invoice }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
