"use client";

import { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Layers,
  Award,
  CheckCircle,
  HelpCircle,
  BarChart2,
  ChevronRight,
  Flame,
} from "lucide-react";

interface PatternDetail {
  id: string;
  name: string;
  type: "Bullish Reversal" | "Bearish Reversal" | "Continuation" | "Indecision";
  reliability: "High" | "Very High" | "Moderate";
  sentiment: "Bullish" | "Bearish" | "Neutral";
  bars: number;
  description: string;
  identification: string[];
  psychology: string;
  tradingRule: string;
}

const CANDLESTICK_PATTERNS: PatternDetail[] = [
  {
    id: "hammer",
    name: "Hammer (हथौड़ा कैंडल)",
    type: "Bullish Reversal",
    reliability: "High",
    sentiment: "Bullish",
    bars: 1,
    description: "A single candlestick pattern that forms during a downtrend. It features a small upper body and a long lower shadow that is at least twice the size of the real body.",
    identification: [
      "Forms at the bottom of a clear downtrend",
      "Lower wick/shadow is at least 2x the length of the real body",
      "Little to no upper shadow",
      "Color can be green or red (green has stronger confirmation)",
    ],
    psychology: "Sellers pushed prices aggressively downward during the session, but strong buyers stepped in at lower levels and drove the price all the way back up towards the open, signaling strong rejection of lower prices.",
    tradingRule: "Enter BUY order above the Hammer high on the next candle. Place Stop-Loss right below the lowest wick.",
  },
  {
    id: "shooting-star",
    name: "Shooting Star (शूटिंग स्टार)",
    type: "Bearish Reversal",
    reliability: "High",
    sentiment: "Bearish",
    bars: 1,
    description: "The bearish counterpart of the inverted hammer. It appears after an uptrend with a long upper shadow and a small body near the lower end of the range.",
    identification: [
      "Appears at the peak of an uptrend",
      "Upper shadow is at least twice the size of the lower body",
      "Virtually zero lower shadow",
      "Closing near the low of the candle",
    ],
    psychology: "Bulls attempted to propel prices to fresh highs, but bears took control of the session and dumped supply, forcing the close near the day's lows.",
    tradingRule: "Enter SELL/Short when the subsequent candle breaks below the Shooting Star's low. Stop-Loss placed above the high wick.",
  },
  {
    id: "bullish-engulfing",
    name: "Bullish Engulfing (बुलिश एंगल्फिंग)",
    type: "Bullish Reversal",
    reliability: "Very High",
    sentiment: "Bullish",
    bars: 2,
    description: "A two-candle pattern where a small bearish red candle is completely swallowed/engulfed by a large bullish green candle that opens lower and closes higher.",
    identification: [
      "Day 1 is a small red bearish candle in a downtrend",
      "Day 2 opens lower (gap down) but rallies violently",
      "Day 2 real body completely covers Day 1 body",
      "Heavy trading volume on the engulfing green candle",
    ],
    psychology: "Complete shift in market consensus from persistent seller control to overwhelming buyer dominance within a single session.",
    tradingRule: "Buy at the close of the engulfing candle or on a minor pullback next morning. Target 1:2 Risk-to-Reward minimum.",
  },
  {
    id: "bearish-engulfing",
    name: "Bearish Engulfing (बेयरिश एंगल्फिंग)",
    type: "Bearish Reversal",
    reliability: "Very High",
    sentiment: "Bearish",
    bars: 2,
    description: "A large red bearish candle completely engulfs the prior green candle at the top of an uptrend, initiating heavy institutional distribution.",
    identification: [
      "Occurs at the top of an ascending trend",
      "Green candle followed by an overwhelming red candle",
      "Red candle's open is higher than green close, but closes lower than green open",
    ],
    psychology: "Bulls opened strong but were slammed by massive institutional profit booking and short sellers.",
    tradingRule: "Sell / Short immediately upon close of the engulfing bar. Stop loss at the top of the red candle.",
  },
  {
    id: "morning-star",
    name: "Morning Star (मॉर्निंग स्टार)",
    type: "Bullish Reversal",
    reliability: "Very High",
    sentiment: "Bullish",
    bars: 3,
    description: "A premier 3-candle bottom reversal pattern. It consists of a tall red candle, a small indecision doji/spinning top, and a tall green candle closing well into the first red candle.",
    identification: [
      "Candle 1: Long bearish body in existing downtrend",
      "Candle 2: Small body (gap down) showing seller exhaustion",
      "Candle 3: Strong green candle closing above 50% of Candle 1",
    ],
    psychology: "First candle shows bear momentum; second shows indecision and selling dry-up; third candle confirms that bulls have taken full control.",
    tradingRule: "Buy at the close of Candle 3. Stop loss below the low of the star (middle candle).",
  },
  {
    id: "doji",
    name: "Doji (दोजी - अनिर्णय)",
    type: "Indecision",
    reliability: "Moderate",
    sentiment: "Neutral",
    bars: 1,
    description: "A candle where Open and Close prices are virtually identical, creating a cross or plus shape.",
    identification: [
      "Open and Close at almost the same price level",
      "Upper and lower shadows can be long or short",
      "Signals equilibrium between buyers and sellers",
    ],
    psychology: "Neither bulls nor bears could conquer the session. Often precedes massive explosive breakouts or trend reversals when combined with support/resistance.",
    tradingRule: "Wait for the breakout candle following the Doji. Trade in the direction of the confirmed breakout.",
  },
];

export default function CandlestickAcademyPage() {
  const [selectedPattern, setSelectedPattern] = useState<PatternDetail>(
    CANDLESTICK_PATTERNS[0]
  );
  const [filter, setFilter] = useState<string>("All");

  const filteredPatterns = CANDLESTICK_PATTERNS.filter(
    (p) => filter === "All" || p.sentiment === filter
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
          <Flame className="w-3.5 h-3.5 text-blue-400" />
          Candlestick Pattern Trading Academy (interface.html)
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Master Candlestick Price Action
        </h1>
        <p className="text-sm text-slate-400">
          Deep dive into single, double, and triple candlestick psychology, entry triggers, stop-loss setups, and institutional orderflow.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex justify-center gap-2">
        {["All", "Bullish", "Bearish", "Neutral"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filter === f
                ? "bg-cyan-500 text-slate-950 font-bold"
                : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
            }`}
          >
            {f} Setups
          </button>
        ))}
      </div>

      {/* Main Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Pattern List (Left) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="p-4 rounded-2xl glass-panel bg-slate-900/60 border border-slate-800 space-y-2">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 px-2 mb-2">
              Select Candlestick Setup
            </h3>
            {filteredPatterns.map((pat) => {
              const isSelected = selectedPattern.id === pat.id;
              return (
                <button
                  key={pat.id}
                  onClick={() => setSelectedPattern(pat)}
                  className={`w-full text-left p-3.5 rounded-xl transition-all flex items-center justify-between ${
                    isSelected
                      ? "bg-cyan-500/15 border border-cyan-500/30 text-white"
                      : "hover:bg-slate-800/60 text-slate-300 border border-transparent"
                  }`}
                >
                  <div>
                    <div className="font-bold text-xs">{pat.name}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {pat.bars} {pat.bars === 1 ? "Candle" : "Candles"} • {pat.type}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        pat.sentiment === "Bullish"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : pat.sentiment === "Bearish"
                          ? "bg-red-500/20 text-red-400"
                          : "bg-slate-800 text-slate-300"
                      }`}
                    >
                      {pat.sentiment}
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Pattern Deep Dive (Right) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-2xl glass-panel bg-slate-900/60 border border-slate-800 space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <h2 className="text-2xl font-extrabold text-white">{selectedPattern.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30">
                    {selectedPattern.type}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    Reliability: <strong className="text-white">{selectedPattern.reliability}</strong>
                  </span>
                </div>
              </div>

              <div
                className={`px-3 py-1.5 rounded-xl font-bold text-xs ${
                  selectedPattern.sentiment === "Bullish"
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : selectedPattern.sentiment === "Bearish"
                    ? "bg-red-500/20 text-red-400 border border-red-500/30"
                    : "bg-slate-800 text-slate-300 border border-slate-700"
                }`}
              >
                {selectedPattern.sentiment} Bias
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Overview
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedPattern.description}
              </p>
            </div>

            {/* Checklist */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Identification Checklist
              </h4>
              <div className="space-y-1.5">
                {selectedPattern.identification.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                    <CheckCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Market Psychology */}
            <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-900/40 space-y-1">
              <span className="text-xs font-bold text-blue-300 block">
                🧠 Behind The Scenes Psychology:
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedPattern.psychology}
              </p>
            </div>

            {/* Execution Rule */}
            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-900/40 text-xs">
              <span className="font-bold text-emerald-300 block mb-1">
                🎯 Actionable Trade Trigger:
              </span>
              <p className="text-slate-200 font-mono">{selectedPattern.tradingRule}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
