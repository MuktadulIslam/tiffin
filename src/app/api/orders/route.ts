import { NextRequest, NextResponse } from "next/server";
import { dbCreateOrder } from "@/lib/db.proxy";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customer, items, subtotal, shipping, total, payment } = body;

    // Basic validation
    if (!customer?.name || !customer?.phone || !customer?.address || !customer?.city)
      return NextResponse.json({ error: "Missing customer info" }, { status: 400 });
    if (!Array.isArray(items) || items.length === 0)
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    if (!payment?.method)
      return NextResponse.json({ error: "Missing payment method" }, { status: 400 });
    if ((payment.method === "bkash" || payment.method === "nagad") && !payment.transactionId)
      return NextResponse.json({ error: "Missing transaction ID" }, { status: 400 });

    const order = await dbCreateOrder({ customer, items, subtotal, shipping, total, payment });
    return NextResponse.json({ success: true, orderNumber: order.orderNumber }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/orders]", err);
    return NextResponse.json({ error: "Failed to place order" }, { status: 500 });
  }
}
