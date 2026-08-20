import { NextResponse } from "next/server";
import { getMenuItems, addMenuItem } from "@/lib/db";

export async function GET() {
  try {
    const items = await getMenuItems();
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch menu items" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    if (!body.name || !body.price) {
      return NextResponse.json(
        { error: "Name and price are required" },
        { status: 400 }
      );
    }
    const newItem = await addMenuItem(body);
    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to add menu item" },
      { status: 500 }
    );
  }
}
