import { NextResponse } from "next/server";
import { getOrder, updateOrderStatus } from "@/lib/db";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const order = await getOrder(id);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 }
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    if (!body.status) {
      return NextResponse.json(
        { error: "Status is required" },
        { status: 400 }
      );
    }
    const updated = await updateOrderStatus(id, body.status);
    if (!updated) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}
