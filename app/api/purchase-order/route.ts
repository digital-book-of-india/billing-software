import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { PurchaseOrder } from "@/models/PurchaseOrder";

export async function GET() {
  try {
    await dbConnect();
    const pos = await PurchaseOrder.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: pos }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();

    // Auto-generate order number if not provided
    let finalOrderNumber = body.orderNumber;
    if (!finalOrderNumber) {
      const sellerPrefix = body.sellerPrefix || "JTI";
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth();
      let fy = month >= 3 ? `${year % 100}-${(year + 1) % 100}` : `${(year - 1) % 100}-${year % 100}`;
      
      const lastPO = await PurchaseOrder.findOne({
        orderNumber: new RegExp(`^${sellerPrefix}/PO/${fy}/`)
      }).sort({ orderNumber: -1 });

      let serial = 1;
      if (lastPO) {
        const parts = lastPO.orderNumber.split("/");
        const lastSerial = parseInt(parts[parts.length - 1]);
        if (!isNaN(lastSerial)) serial = lastSerial + 1;
      }
      finalOrderNumber = `${sellerPrefix}/PO/${fy}/${String(serial).padStart(5, "0")}`;
    }

    const poData = {
      ...body,
      orderNumber: finalOrderNumber,
      date: body.date ? new Date(body.date) : new Date(),
      poCreationDate: body.poCreationDate ? new Date(body.poCreationDate) : new Date(),
      poApprovalDate: body.poApprovalDate ? new Date(body.poApprovalDate) : new Date(),
    };

    const newPO = await PurchaseOrder.create(poData);
    return NextResponse.json({ success: true, data: newPO }, { status: 201 });
  } catch (error: any) {
    console.error("PO Creation Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
