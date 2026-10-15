import { NextResponse } from "next/server";
import { getStockPrediction } from "@/lib/stockData";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const symbol = searchParams.get("symbol") || "RELIANCE";
    const timeframe = searchParams.get("timeframe") || "7D";
    const days = timeframe === "30D" ? 30 : timeframe === "14D" ? 14 : 7;

    const data = await getStockPrediction(symbol, days);

    // Map into unified schema
    return NextResponse.json({
      symbol: data.symbol,
      companyName: data.companyName,
      currentPrice: data.currentPrice,
      predictedPrice: data.predictedPrice,
      confidence: data.advice.confidence === "High" ? 89.5 : data.advice.confidence === "Medium" ? 78.4 : 64.2,
      direction: data.advice.action.includes("BUY") ? "BULLISH" : data.advice.action.includes("SELL") ? "BEARISH" : "NEUTRAL",
      timeframe: `${days} Days`,
      rsi: data.advice.indicators.RSI,
      macd: data.advice.indicators.MACD > 0 ? "Bullish Crossover" : "Bearish Divergence",
      recommendation: `${data.advice.action} — ${data.advice.reasons[0] || "Target price forecast"}`,
      support: +(data.currentPrice * 0.96).toFixed(1),
      resistance: +(data.currentPrice * 1.04).toFixed(1),
      historical: data.historicalCandles.map((c) => ({
        time: c.date,
        actual: c.close,
        predicted: c.close,
      })),
      predictions: data.predictions,
      advice: data.advice,
      metrics: data.metrics,
      train_loss: data.train_loss,
      val_loss: data.val_loss,
      data_fetched_to: data.data_fetched_to,
    });
  } catch (err: any) {
    console.error("Predict API Error:", err);
    return NextResponse.json({ error: "Prediction generation failed" }, { status: 500 });
  }
}
