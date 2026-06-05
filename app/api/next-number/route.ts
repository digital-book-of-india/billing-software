import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { PurchaseOrder } from "@/models/PurchaseOrder";
import { Invoice } from "@/models/Invoice";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type"); // po or invoice
  const sellerPrefix = searchParams.get("prefix") || "JTI";

  try {
    await dbConnect();

    // Get Current Financial Year (e.g. 24-25)
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth(); // 0-indexed
    let fy = "";
    if (month >= 3) { // April onwards
      fy = `${year % 100}-${(year + 1) % 100}`;
    } else {
      fy = `${(year - 1) % 100}-${year % 100}`;
    }

    let nextNumber = "";
    
    if (type === "po") {
      const lastPO = await PurchaseOrder.findOne({
        orderNumber: new RegExp(`^${sellerPrefix}/PO/${fy}/`)
      }).sort({ orderNumber: -1 });

      let serial = 1;
      if (lastPO) {
        const parts = lastPO.orderNumber.split("/");
        const lastSerial = parseInt(parts[parts.length - 1]);
        if (!isNaN(lastSerial)) serial = lastSerial + 1;
      }
      nextNumber = `${sellerPrefix}/PO/${fy}/${String(serial).padStart(5, "0")}`;
    } else if (type === "invoice") {
      const lastInvoice = await Invoice.findOne({
        invoiceNumber: new RegExp(`^${sellerPrefix}/INV/${fy}/`)
      }).sort({ invoiceNumber: -1 });

      let serial = 1;
      if (lastInvoice) {
        const parts = lastInvoice.invoiceNumber.split("/");
        const lastSerial = parseInt(parts[parts.length - 1]);
        if (!isNaN(lastSerial)) serial = lastSerial + 1;
      }
      nextNumber = `${sellerPrefix}/INV/${fy}/${String(serial).padStart(5, "0")}`;
    } else {
      return NextResponse.json({ success: false, error: "Invalid type" }, { status: 400 });
    }

    return NextResponse.json({ success: true, nextNumber });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
