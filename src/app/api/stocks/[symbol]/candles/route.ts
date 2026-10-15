import { NextResponse } from "next/server";
import { fetchYahooFinanceCandles } from "@/lib/stockData";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ symbol: string }> }
) {
  try {
    const { symbol } = await params;
    const { searchParams } = new URL(req.url);
    const period = searchParams.get("period") || "1y";

    const candles = await fetchYahooFinanceCandles(symbol, period);
    return NextResponse.json({ symbol: symbol.toUpperCase(), candles });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to load candles" }, { status: 500 });
  }
}
