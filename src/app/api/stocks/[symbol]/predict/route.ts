import { NextResponse } from "next/server";
import { getStockPrediction } from "@/lib/stockData";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ symbol: string }> }
) {
  try {
    const { symbol } = await params;
    const body = (await req.json().catch(() => ({}))) || {};
    const fromDate = body.from_date;
    const days = Math.min(60, Math.max(1, parseInt(body.days || "7", 10)));

    const result = await getStockPrediction(symbol, days, fromDate);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Prediction error" }, { status: 500 });
  }
}
