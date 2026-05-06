import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Invoice } from "@/models/Invoice";

export async function GET() {
  try {
    await dbConnect();
    
    // Get unique customers with their most recent details
    const customers = await Invoice.aggregate([
      { $sort: { date: -1 } },
      {
        $group: {
          _id: { name: "$customerName", gst: "$gst" },
          address: { $first: "$address" },
          gst: { $first: "$gst" },
          customerContact: { $first: "$customerContact" },
          shippingName: { $first: "$shippingName" },
          shippingAddress: { $first: "$shippingAddress" },
          shippingGst: { $first: "$shippingGst" },
          shippingContact: { $first: "$shippingContact" },
          customerName: { $first: "$customerName" },
        }
      },
      { $sort: { customerName: 1 } }
    ]);

    return NextResponse.json({ success: true, data: customers }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
