"use client";

import { useState } from "react";
import Link from "next/link";
import {
  GraduationCap,
  BarChart2,
  BookOpen,
  ExternalLink,
  PlayCircle,
  Download,
  Users,
  Gamepad2,
  TrendingUp,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";

interface PatternData {
  id: string;
  name: string;
  emoji: string;
  type: string;
  badgeClass: string;
  characteristics: string;
  significance: string;
  confirmation: string;
  link: string;
}

const PATTERNS: Record<string, PatternData> = {
  hammer: {
    id: "hammer",
    name: "Hammer Pattern",
    emoji: "🔨",
    type: "Bullish Reversal",
    badgeClass: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    characteristics: "Small body with long lower shadow, little to no upper shadow",
    significance: "Indicates potential trend reversal after a decline, buyers pushing price up",
    confirmation: "Look for bullish follow-through in next candle and higher volume",
    link: "https://www.investopedia.com/terms/h/hammer.asp",
  },
  engulfing: {
    id: "engulfing",
    name: "Bullish Engulfing Pattern",
    emoji: "📈",
    type: "Bullish Reversal",
    badgeClass: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    characteristics: "Green candle completely engulfs previous red candle body",
    significance: "Strong buying pressure overcoming selling pressure",
    confirmation: "Volume spike and follow-through buying above engulfing high",
    link: "https://www.investopedia.com/terms/b/bullishengulfingpattern.asp",
  },
  doji: {
    id: "doji",
    name: "Doji Pattern",
    emoji: "⚖️",
    type: "Neutral / Indecision",
    badgeClass: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    characteristics: "Open and close prices are virtually equal with thin cross shape",
    significance: "Market indecision, potential exhaustion of current trend",
    confirmation: "Context is key - location within trend and subsequent breakout candle",
    link: "https://www.investopedia.com/terms/d/doji.asp",
  },
  morningstar: {
    id: "morningstar",
    name: "Morning Star Pattern",
    emoji: "🌟",
    type: "Bullish Reversal",
    badgeClass: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    characteristics: "Three-candle pattern: long red, small-bodied star, long green candle",
    significance: "Strong reversal signal after downtrend",
    confirmation: "Third candle should close above midpoint of the first red candle",
    link: "https://www.investopedia.com/terms/m/morningstar.asp",
  },
  "inverted-hammer": {
    id: "inverted-hammer",
    name: "Inverted Hammer Pattern",
    emoji: "🔨",
    type: "Bullish Reversal",
    badgeClass: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    characteristics: "Small body with long upper shadow, little to no lower shadow",
    significance: "Potential reversal after decline, aggressive buyers testing higher prices",
    confirmation: "Bullish candle following and strong volume support",
    link: "https://www.investopedia.com/terms/i/inverted-hammer.asp",
  },
  "hanging-man": {
    id: "hanging-man",
    name: "Hanging Man Pattern",
    emoji: "👤",
    type: "Bearish Reversal",
    badgeClass: "bg-rose-500/20 text-rose-400 border-rose-500/30",
    characteristics: "Small body at top with long lower shadow at the peak of an uptrend",
    significance: "Potential exhaustion of buyers, sellers actively testing lower prices",
    confirmation: "Bearish follow-through on next candle and elevated volume",
    link: "https://www.investopedia.com/terms/h/hangingman.asp",
  },
  "shooting-star": {
    id: "shooting-star",
    name: "Shooting Star Pattern",
    emoji: "⭐",
    type: "Bearish Reversal",
    badgeClass: "bg-rose-500/20 text-rose-400 border-rose-500/30",
    characteristics: "Small body with long upper shadow, little to no lower shadow at top of trend",
    significance: "Sellers strongly reject higher prices after an advance",
    confirmation: "Bearish candle following with volume confirmation",
    link: "https://www.investopedia.com/terms/s/shootingstar.asp",
  },
  "bullish-engulfing": {
    id: "bullish-engulfing",
    name: "Bullish Engulfing Pattern",
    emoji: "📈",
    type: "Bullish Reversal",
    badgeClass: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    characteristics: "Green candle completely engulfs previous red candle",
    significance: "Strong buying pressure overcoming selling pressure",
    confirmation: "Volume spike and follow-through buying",
    link: "https://www.investopedia.com/terms/b/bullishengulfingpattern.asp",
  },
  "bearish-engulfing": {
    id: "bearish-engulfing",
    name: "Bearish Engulfing Pattern",
    emoji: "📉",
    type: "Bearish Reversal",
    badgeClass: "bg-rose-500/20 text-rose-400 border-rose-500/30",
    characteristics: "Red candle completely engulfs previous green candle",
    significance: "Strong selling pressure overcoming buying pressure",
    confirmation: "Volume spike and follow-through selling",
    link: "https://www.investopedia.com/terms/b/bearishengulfingp.asp",
  },
  "piercing-line": {
    id: "piercing-line",
    name: "Piercing Line Pattern",
    emoji: "🔥",
    type: "Bullish Reversal",
    badgeClass: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    characteristics: "Green candle opens below previous low but closes above 50% midpoint",
    significance: "Buyers regain control after sharp decline",
    confirmation: "Higher volume and bullish continuation candle",
    link: "https://www.investopedia.com/terms/p/piercing-pattern.asp",
  },
  "dark-cloud-cover": {
    id: "dark-cloud-cover",
    name: "Dark Cloud Cover Pattern",
    emoji: "☁️",
    type: "Bearish Reversal",
    badgeClass: "bg-rose-500/20 text-rose-400 border-rose-500/30",
    characteristics: "Red candle opens above previous high but closes below midpoint",
    significance: "Sellers regain control after advance",
    confirmation: "Higher volume and bearish continuation",
    link: "https://www.investopedia.com/terms/d/darkcloud.asp",
  },
  "dragonfly-doji": {
    id: "dragonfly-doji",
    name: "Dragonfly Doji Pattern",
    emoji: "🐉",
    type: "Bullish Reversal",
    badgeClass: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    characteristics: "Doji with long lower shadow, no upper shadow, open and close at high",
    significance: "Rejection of lower prices, potential bullish reversal",
    confirmation: "Bullish follow-through in context of downtrend",
    link: "https://www.investopedia.com/terms/d/doji.asp",
  },
  "gravestone-doji": {
    id: "gravestone-doji",
    name: "Gravestone Doji Pattern",
    emoji: "🪦",
    type: "Bearish Reversal",
    badgeClass: "bg-rose-500/20 text-rose-400 border-rose-500/30",
    characteristics: "Doji with long upper shadow, no lower shadow, open and close at low",
    significance: "Rejection of higher prices, potential bearish reversal",
    confirmation: "Bearish follow-through in context of uptrend",
    link: "https://www.investopedia.com/terms/d/doji.asp",
  },
  "long-legged-doji": {
    id: "long-legged-doji",
    name: "Long-Legged Doji Pattern",
    emoji: "🦵",
    type: "Neutral / High Volatility",
    badgeClass: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    characteristics: "Doji with very long upper and lower shadows",
    significance: "High market volatility and indecision between buyers and sellers",
    confirmation: "Look for trend context, breakout direction and volume",
    link: "https://www.investopedia.com/terms/d/doji.asp",
  },
  "evening-star": {
    id: "evening-star",
    name: "Evening Star Pattern",
    emoji: "🌙",
    type: "Bearish Reversal",
    badgeClass: "bg-rose-500/20 text-rose-400 border-rose-500/30",
    characteristics: "Three-candle pattern: long green, small-bodied star, long red candle",
    significance: "Strong reversal signal after uptrend",
    confirmation: "Third candle should close below midpoint of first candle",
    link: "https://www.investopedia.com/terms/e/eveningstar.asp",
  },
  "three-white-soldiers": {
    id: "three-white-soldiers",
    name: "Three White Soldiers Pattern",
    emoji: "⚔️",
    type: "Bullish Reversal",
    badgeClass: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    characteristics: "Three consecutive long green candles with higher closes",
    significance: "Strong sustained bullish momentum and trend reversal",
    confirmation: "Increasing volume and small upper wicks",
    link: "https://www.investopedia.com/terms/t/three_white_soldiers.asp",
  },
  "three-black-crows": {
    id: "three-black-crows",
    name: "Three Black Crows Pattern",
    emoji: "🐦",
    type: "Bearish Reversal",
    badgeClass: "bg-rose-500/20 text-rose-400 border-rose-500/30",
    characteristics: "Three consecutive long red candles with lower closes",
    significance: "Strong sustained bearish momentum and trend reversal",
    confirmation: "Increasing volume and small lower wicks",
    link: "https://www.investopedia.com/terms/t/three_black_crows.asp",
  },
  "rising-three-methods": {
    id: "rising-three-methods",
    name: "Rising Three Methods Pattern",
    emoji: "📈",
    type: "Bullish Continuation",
    badgeClass: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    characteristics: "Long green candle, three small red counter candles, final long green candle",
    significance: "Temporary pause/consolidation in uptrend, then continuation",
    confirmation: "Final green candle closes higher than first candle high",
    link: "https://www.investopedia.com/terms/r/rising-three-methods.asp",
  },
  "falling-three-methods": {
    id: "falling-three-methods",
    name: "Falling Three Methods Pattern",
    emoji: "📉",
    type: "Bearish Continuation",
    badgeClass: "bg-rose-500/20 text-rose-400 border-rose-500/30",
    characteristics: "Long red candle, three small green counter candles, final long red candle",
    significance: "Temporary pause/consolidation in downtrend, then continuation",
    confirmation: "Final red candle closes lower than first candle low",
    link: "https://www.investopedia.com/terms/f/falling-three-methods.asp",
  },
  "bullish-harami": {
    id: "bullish-harami",
    name: "Bullish Harami Pattern",
    emoji: "🤰",
    type: "Bullish Reversal",
    badgeClass: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    characteristics: "Small green candle completely inside previous large red candle body",
    significance: "Potential weakening of selling pressure in downtrend",
    confirmation: "Bullish follow-through and rising volume",
    link: "https://www.investopedia.com/terms/h/harami.asp",
  },
  "bearish-harami": {
    id: "bearish-harami",
    name: "Bearish Harami Pattern",
    emoji: "🤰",
    type: "Bearish Reversal",
    badgeClass: "bg-rose-500/20 text-rose-400 border-rose-500/30",
    characteristics: "Small red candle completely inside previous large green candle body",
    significance: "Potential weakening of buying pressure in uptrend",
    confirmation: "Bearish follow-through and rising volume",
    link: "https://www.investopedia.com/terms/h/harami.asp",
  },
  "harami-cross": {
    id: "harami-cross",
    name: "Harami Cross Pattern",
    emoji: "✝️",
    type: "Major Reversal",
    badgeClass: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
    characteristics: "Doji completely inside previous large real body candle",
    significance: "Extreme market indecision signaling sharp potential reversal",
    confirmation: "Next session breakout above/below previous high/low",
    link: "https://www.investopedia.com/terms/h/harami.asp",
  },
  "tweezer-bottom": {
    id: "tweezer-bottom",
    name: "Tweezer Bottom Pattern",
    emoji: "🔧",
    type: "Bullish Reversal",
    badgeClass: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    characteristics: "Two consecutive candles with identical lows at a support level",
    significance: "Strong support established at lows, double rejection of downward price",
    confirmation: "Bullish green candle following",
    link: "https://www.investopedia.com/terms/t/tweezers.asp",
  },
  "tweezer-top": {
    id: "tweezer-top",
    name: "Tweezer Top Pattern",
    emoji: "🔧",
    type: "Bearish Reversal",
    badgeClass: "bg-rose-500/20 text-rose-400 border-rose-500/30",
    characteristics: "Two consecutive candles with identical highs at a resistance level",
    significance: "Strong resistance established at highs, double rejection of upward price",
    confirmation: "Bearish red candle following",
    link: "https://www.investopedia.com/terms/t/tweezers.asp",
  },
  "bullish-belt-hold": {
    id: "bullish-belt-hold",
    name: "Bullish Belt Hold Pattern",
    emoji: "🗡️",
    type: "Bullish Reversal",
    badgeClass: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    characteristics: "Long green candle opening exactly at low with no lower shadow",
    significance: "Strong bullish dominance from opening bell to market close",
    confirmation: "High volume and subsequent upward momentum",
    link: "https://www.babypips.com/learn/forex/candlestick-patterns",
  },
};

const SAMPLE_CANDLE_DATA = [
  { date: "2024-01-01", open: 42000, high: 43500, low: 41800, close: 43000, color: "#10b981", height: 1000 },
  { date: "2024-01-02", open: 43000, high: 44500, low: 42500, close: 44000, color: "#10b981", height: 1000 },
  { date: "2024-01-03", open: 44000, high: 45500, low: 43500, close: 45000, color: "#10b981", height: 1000 },
  { date: "2024-01-04", open: 45000, high: 46000, low: 44000, close: 44500, color: "#ef4444", height: 500 },
  { date: "2024-01-05", open: 44500, high: 45500, low: 43500, close: 45200, color: "#10b981", height: 700 },
  { date: "2024-01-06", open: 45200, high: 46500, low: 44800, close: 46000, color: "#10b981", height: 800 },
  { date: "2024-01-07", open: 46000, high: 47000, low: 45500, close: 46800, color: "#10b981", height: 800 },
];

export default function CandlestickAcademyPage() {
  const [selectedPatternId, setSelectedPatternId] = useState<string>("hammer");
  const selectedPattern = PATTERNS[selectedPatternId] || PATTERNS.hammer;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-[#f8fafc]">
      <div className="max-w-[1400px] mx-auto px-4 py-8 space-y-10">
        {/* HERO SECTION */}
        <section className="text-center py-12 px-6 rounded-3xl bg-gradient-to-r from-blue-600/15 to-slate-800/40 border border-slate-700/60 shadow-2xl backdrop-blur-md">
          <h1 className="text-3xl sm:text-5xl font-black mb-4 tracking-tight bg-gradient-to-r from-blue-500 via-blue-400 to-sky-300 bg-clip-text text-transparent">
            Master Candlestick Pattern Trading
          </h1>
          <p className="max-w-3xl mx-auto text-sm sm:text-base text-slate-300 font-normal leading-relaxed mb-8">
            Learn to identify and trade the most powerful candlestick patterns with our comprehensive educational platform and real-time chart analysis tools.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/academy/learn-basics"
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-blue-500/25 transition-all"
            >
              <GraduationCap className="w-4 h-4" />
              Learn Basics
            </Link>
            <Link
              href="/academy/live-charts"
              className="px-6 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-slate-700/25 transition-all"
            >
              <BarChart2 className="w-4 h-4" />
              Live Charts
            </Link>
            <Link
              href="/academy/advanced-guide"
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/25 transition-all"
            >
              <BookOpen className="w-4 h-4" />
              Advanced Guide
            </Link>
          </div>
        </section>

        {/* CANDLESTICK PRO CHART PREVIEW */}
        <div className="p-6 rounded-2xl bg-slate-800/70 border border-slate-700/80 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-lg text-white">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              <span>Interactive Candlestick Price Action Chart</span>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30 font-mono">
              BTC / USD & NIFTY Candlestick View
            </span>
          </div>

          <div className="h-[280px] w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={SAMPLE_CANDLE_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="date" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <YAxis domain={[40000, 48000]} stroke="#94a3b8" tick={{ fontSize: 11 }} tickFormatter={(v) => `$${v.toLocaleString()}`} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "10px", color: "#fff" }}
                  formatter={(val, name, item: any) => [
                    `Open: $${item.payload.open} | High: $${item.payload.high} | Low: $${item.payload.low} | Close: $${item.payload.close}`,
                    "Candle",
                  ]}
                />
                <Bar dataKey="close" name="Close Price" radius={[4, 4, 0, 0]}>
                  {SAMPLE_CANDLE_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* PATTERN RECOGNITION INTERACTIVE EXPLORER */}
        <section className="p-6 sm:p-8 rounded-3xl bg-slate-800/80 border border-slate-700/80 shadow-xl space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Pattern Recognition</h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Select any pattern from the library below to learn its structure, market psychology, and trading rules:
            </p>
          </div>

          {/* Pattern Buttons Grid */}
          <div className="flex flex-wrap gap-2">
            {Object.keys(PATTERNS).map((key) => {
              const p = PATTERNS[key];
              const isSelected = selectedPatternId === key;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedPatternId(key)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border ${
                    isSelected
                      ? "bg-blue-600 text-white border-blue-400 shadow-md shadow-blue-500/30 scale-105"
                      : "bg-slate-900/70 border-slate-700/60 text-slate-300 hover:bg-slate-700 hover:text-white"
                  }`}
                >
                  <span className="mr-1.5">{p.emoji}</span>
                  {p.name.replace(" Pattern", "")}
                </button>
              );
            })}
          </div>

          {/* Selected Pattern Details Box */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-700/80 shadow-inner space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{selectedPattern.emoji}</span>
                <div>
                  <h3 className="text-xl font-bold text-white">{selectedPattern.name}</h3>
                  <span className={`inline-block text-xs px-2.5 py-0.5 rounded-full border mt-1 font-semibold ${selectedPattern.badgeClass}`}>
                    {selectedPattern.type}
                  </span>
                </div>
              </div>

              <Link
                href="/academy/advanced-guide"
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-md shadow-blue-500/20"
              >
                <BookOpen className="w-3.5 h-3.5" />
                Detailed Guide
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <div className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">Characteristics</div>
                <p className="text-xs text-slate-200 leading-relaxed">{selectedPattern.characteristics}</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">Trading Significance</div>
                <p className="text-xs text-slate-200 leading-relaxed">{selectedPattern.significance}</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <div className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">Confirmation Rule</div>
                <p className="text-xs text-slate-200 leading-relaxed">{selectedPattern.confirmation}</p>
              </div>
            </div>
          </div>
        </section>

        {/* ESSENTIAL CANDLESTICK PATTERNS SECTION */}
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Essential Candlestick Patterns</h2>
            <p className="text-xs text-slate-400">Core reversal and continuation patterns every trader must master:</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Hammer */}
            <div className="p-6 rounded-2xl bg-slate-800/70 border border-slate-700/80 shadow-lg hover:-translate-y-1 transition-all flex flex-col justify-between">
              <div>
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 mb-3">
                  Bullish
                </span>
                <h3 className="text-lg font-bold text-white mb-2">Hammer</h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  A single candlestick pattern that forms after a price decline, indicating a strong potential reversal.
                </p>
              </div>
              <Link
                href="/academy/learn-basics"
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-blue-500 text-blue-400 hover:bg-blue-600 hover:text-white text-xs font-semibold transition-all"
              >
                <BookOpen className="w-3.5 h-3.5" />
                Learn More
              </Link>
            </div>

            {/* Bullish Engulfing */}
            <div className="p-6 rounded-2xl bg-slate-800/70 border border-slate-700/80 shadow-lg hover:-translate-y-1 transition-all flex flex-col justify-between">
              <div>
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 mb-3">
                  Bullish
                </span>
                <h3 className="text-lg font-bold text-white mb-2">Bullish Engulfing</h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  A two-candle pattern where a large green candle completely engulfs the body of the previous red candle.
                </p>
              </div>
              <Link
                href="/academy/learn-basics"
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-blue-500 text-blue-400 hover:bg-blue-600 hover:text-white text-xs font-semibold transition-all"
              >
                <BookOpen className="w-3.5 h-3.5" />
                Learn More
              </Link>
            </div>

            {/* Shooting Star */}
            <div className="p-6 rounded-2xl bg-slate-800/70 border border-slate-700/80 shadow-lg hover:-translate-y-1 transition-all flex flex-col justify-between">
              <div>
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30 mb-3">
                  Bearish
                </span>
                <h3 className="text-lg font-bold text-white mb-2">Shooting Star</h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  A single candlestick pattern that forms after a price advance, indicating potential reversal and rejection.
                </p>
              </div>
              <Link
                href="/academy/learn-basics"
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-blue-500 text-blue-400 hover:bg-blue-600 hover:text-white text-xs font-semibold transition-all"
              >
                <BookOpen className="w-3.5 h-3.5" />
                Learn More
              </Link>
            </div>

            {/* Doji */}
            <div className="p-6 rounded-2xl bg-slate-800/70 border border-slate-700/80 shadow-lg hover:-translate-y-1 transition-all flex flex-col justify-between">
              <div>
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 mb-3">
                  Neutral
                </span>
                <h3 className="text-lg font-bold text-white mb-2">Doji</h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  A pattern where opening and closing prices are virtually equal, indicating critical market indecision.
                </p>
              </div>
              <Link
                href="/academy/learn-basics"
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-blue-500 text-blue-400 hover:bg-blue-600 hover:text-white text-xs font-semibold transition-all"
              >
                <BookOpen className="w-3.5 h-3.5" />
                Learn More
              </Link>
            </div>
          </div>
        </section>

        {/* LEARNING RESOURCES SECTION */}
        <section className="p-6 sm:p-8 rounded-3xl bg-slate-800/80 border border-slate-700/80 shadow-xl space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Learning Resources</h2>
            <p className="text-xs text-slate-300">Expand your knowledge with these educational resources:</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-700/70 space-y-4 hover:-translate-y-1 transition-all">
              <h3 className="text-lg font-bold text-blue-400">Video Modules</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Comprehensive lessons covering all major candlestick patterns with real trading examples.
              </p>
              <Link
                href="/academy/learn-basics"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md transition-all"
              >
                <PlayCircle className="w-4 h-4" />
                Start Module
              </Link>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-700/70 space-y-4 hover:-translate-y-1 transition-all">
              <h3 className="text-lg font-bold text-blue-400">Institutional Guide</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                In-depth master study of candlestick pattern analysis, liquidity traps, and smart money price action.
              </p>
              <Link
                href="/academy/advanced-guide"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-xs font-semibold shadow-md transition-all"
              >
                <BookOpen className="w-4 h-4" />
                Read Guide
              </Link>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-700/70 space-y-4 hover:-translate-y-1 transition-all">
              <h3 className="text-lg font-bold text-blue-400">Technical Analysis Hub</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Chart indicators, moving averages, and technical setups to complement candlestick patterns.
              </p>
              <Link
                href="/technical"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md transition-all"
              >
                <Users className="w-4 h-4" />
                Explore Hub
              </Link>
            </div>
          </div>
        </section>

        {/* PRACTICE & SIMULATION SECTION */}
        <section className="p-6 sm:p-8 rounded-3xl bg-slate-800/80 border border-slate-700/80 shadow-xl space-y-6">
          <h2 className="text-2xl font-bold text-white">Practice & Simulation</h2>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/academy/live-charts"
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-blue-500/25 transition-all"
            >
              <BarChart2 className="w-4 h-4" />
              Practice on Live Charts
            </Link>
            <Link
              href="/academy/learn-basics"
              className="px-6 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-slate-700/25 transition-all"
            >
              <GraduationCap className="w-4 h-4" />
              Candlestick Course
            </Link>
            <Link
              href="/virtual-trading"
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/25 transition-all"
            >
              <Gamepad2 className="w-4 h-4" />
              Paper Trading Simulator
            </Link>
          </div>
        </section>
      </div>

      <footer className="border-t border-slate-800 mt-12 py-8 text-center text-xs text-slate-500 space-y-1">
        <p>&copy; 2026 Candlestick Pro Trading Academy. Educational purposes only.</p>
        <p>Risk Disclaimer: Trading involves risk. Past performance is not indicative of future results.</p>
      </footer>
    </div>
  );
}
