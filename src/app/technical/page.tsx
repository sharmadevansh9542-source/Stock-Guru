"use client";

import { useState } from "react";
import {
  LineChart as ChartIcon,
  TrendingUp,
  TrendingDown,
  Activity,
  Layers,
  HelpCircle,
  CheckCircle,
} from "lucide-react";

export default function TechnicalAnalysisPage() {
  const [activeTab, setActiveTab] = useState<"patterns" | "indicators" | "techniques" | "rules">(
    "patterns"
  );

  const patterns = [
    {
      name: "Head and Shoulders",
      type: "Bearish Reversal",
      color: "text-red-400 border-red-500/30 bg-red-500/10",
      description:
        "One of the most reliable reversal patterns. It consists of a left shoulder, a higher middle peak (head), and a right shoulder. A break below the neckline confirms the trend reversal downward.",
      signal: "SELL on Neckline Breakdown",
      points: ["Formed at market tops", "Neckline breakdown with expanding volume", "Target: Head height subtracted from breakdown"],
    },
    {
      name: "Double Top (M Pattern)",
      type: "Bearish Reversal",
      color: "text-red-400 border-red-500/30 bg-red-500/10",
      description:
        "Occurs when an asset reaches a high price twice with a moderate trough in between. Rejection at the same resistance signifies exhausting buyers.",
      signal: "SELL / Short Below Valley Support",
      points: ["Clear rejection at identical resistance", "RSI divergence on second peak", "Target equal to pattern height"],
    },
    {
      name: "Cup and Handle",
      type: "Bullish Continuation",
      color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
      description:
        "A bullish continuation pattern where the 'cup' is a rounded bottom consolidation, followed by a slight downward drift (the 'handle'). Breakout above the rim signals aggressive rally.",
      signal: "BUY on Handle Rim Breakout",
      points: ["Rounded base indicates steady accumulation", "Handle depth is ideally < 1/3 of cup", "High probability swing trade"],
    },
    {
      name: "Ascending Triangle",
      type: "Bullish Continuation",
      color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
      description:
        "Characterized by a horizontal upper resistance line and an ascending lower support line. Higher lows show aggressive buyer participation pushing prices against a flat ceiling.",
      signal: "BUY on Horizontal Resistance Breakout",
      points: ["Consecutive higher lows", "Volume contracts inside triangle", "Volume explodes on breakout"],
    },
    {
      name: "Bullish Flag & Pole",
      type: "Bullish Continuation",
      color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
      description:
        "After a steep, sudden upward pole, the price pauses inside a tight downward sloping rectangular channel (flag) before continuing higher in the same direction.",
      signal: "BUY on Upper Flag Boundary Break",
      points: ["Steep initial rally on high volume", "Counter-trend flag on dry volume", "Target matches flagpole height"],
    },
    {
      name: "Double Bottom (W Pattern)",
      type: "Bullish Reversal",
      color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
      description:
        "Forms at market bottoms. Two successive lows test a major floor, unable to break lower. Breakout above the center peak confirms bull run.",
      signal: "BUY on Center Peak Breakout",
      points: ["Tests support twice without breaking", "Second bottom often shows RSI bullish divergence", "Strong reversal setup"],
    },
  ];

  const indicators = [
    {
      name: "RSI (Relative Strength Index)",
      type: "Momentum Oscillator (0-100)",
      description:
        "Measures the velocity and magnitude of recent price moves to evaluate overbought (>70) or oversold (<30) conditions.",
      strategy:
        "Look for bullish divergences (price makes lower low, RSI makes higher low) at support levels for high win-rate entries.",
    },
    {
      name: "MACD (Moving Average Convergence Divergence)",
      type: "Trend Following & Momentum",
      description:
        "Shows the relationship between 12-period EMA and 26-period EMA. A 9-period EMA acts as the signal line.",
      strategy:
        "Buy when MACD line crosses above Signal line while histogram flips from red to green below or near the zero line.",
    },
    {
      name: "Supertrend (10, 3)",
      type: "Trend Direction & Dynamic Stop Loss",
      description:
        "Constructed using Average True Range (ATR) to track market trends and give clean directional flip signals.",
      strategy:
        "Ride the trend as long as price remains above green line. Exit or reverse position immediately when line flips to red.",
    },
    {
      name: "Exponential Moving Averages (20 & 50 EMA)",
      type: "Dynamic Support & Golden Cross",
      description:
        "Gives higher weight to recent price points. 20 EMA serves as the primary pullback target in strong trends.",
      strategy:
        "A 20 EMA crossing above 50 EMA signals strong short-term bullish momentum. Buy pullbacks to the 20 EMA.",
    },
  ];

  const techniques = [
    {
      title: "1% Risk Per Trade Rule",
      desc: "Never risk more than 1% to 2% of your total account balance on a single trade. If you have ₹1,00,000, max loss per trade must be ₹1,000 to ₹2,000.",
    },
    {
      title: "Multi-Timeframe Analysis (MTF)",
      desc: "Check Daily timeframe for dominant trend direction, 1-Hour chart for market structure, and 5-Minute/15-Minute for precise execution.",
    },
    {
      title: "Risk-to-Reward Ratio (1:2 Minimum)",
      desc: "Ensure your projected profit is at least double your stop loss risk. Even with a 40% win rate, a 1:2 R:R ensures long-term profitability.",
    },
    {
      title: "Volume Confirmation",
      desc: "Breakouts without volume are fakeouts. Real institutional breakouts must have volume at least 1.5x above the 20-period average volume.",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
          <ChartIcon className="w-3.5 h-3.5" />
          Technical Analysis Mastery
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Chart Patterns, Indicators & Edge
        </h1>
        <p className="text-sm text-slate-400">
          Learn high-probability price action setups, momentum indicators, and institutional risk management rules.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center border-b border-slate-800">
        <div className="flex gap-2">
          {[
            { id: "patterns", label: "Chart Patterns" },
            { id: "indicators", label: "Indicators & Oscillators" },
            { id: "techniques", label: "Trading Principles" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-5 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all ${
                activeTab === tab.id
                  ? "border-cyan-400 text-cyan-400"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab: Chart Patterns */}
      {activeTab === "patterns" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {patterns.map((p, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl glass-panel glass-panel-hover flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-base text-white">{p.name}</h3>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${p.color}`}
                  >
                    {p.type}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">{p.description}</p>

                <div className="space-y-1.5 mb-4">
                  {p.points.map((pt, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                      <CheckCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 text-[11px] font-mono text-cyan-300">
                Action: {p.signal}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Indicators */}
      {activeTab === "indicators" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {indicators.map((ind, i) => (
            <div key={i} className="p-6 rounded-2xl glass-panel space-y-4">
              <div>
                <h3 className="font-bold text-lg text-white">{ind.name}</h3>
                <span className="text-xs font-mono text-cyan-400">{ind.type}</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{ind.description}</p>
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
                <span className="font-semibold text-emerald-400 block mb-1">
                  Edge Strategy:
                </span>
                <span className="text-slate-300">{ind.strategy}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Techniques */}
      {activeTab === "techniques" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {techniques.map((tech, i) => (
            <div key={i} className="p-6 rounded-2xl glass-panel space-y-2">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs">
                  {i + 1}
                </span>
                {tech.title}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed pl-8">{tech.desc}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
