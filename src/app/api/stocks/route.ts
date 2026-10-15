import { NextResponse } from "next/server";
import { INDIAN_STOCKS } from "@/lib/stockData";

export async function GET() {
  const list = Object.entries(INDIAN_STOCKS).map(([symbol, name]) => ({
    symbol,
    name,
  }));
  return NextResponse.json({ stocks: list });
}
