import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { PurchaseOrder } from "@/models/PurchaseOrder";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    const po = await PurchaseOrder.findById(id);
    if (!po) {
      return NextResponse.json({ success: false, error: "PO not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: po }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await dbConnect();
    const body = await req.json();
    const po = await PurchaseOrder.findByIdAndUpdate(id, body, { new: true });
    if (!po) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, data: po });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await dbConnect();
    const po = await PurchaseOrder.findByIdAndDelete(id);
    if (!po) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, message: "Deleted" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
