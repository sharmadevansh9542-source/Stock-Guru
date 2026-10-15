"use client";

import Link from "next/link";
import {
  GraduationCap,
  ArrowLeft,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  HelpCircle,
  BarChart2,
  BookOpen,
  ShieldCheck,
  Target,
  Clock,
  Layers,
} from "lucide-react";

export default function LearnBasicsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#111c38] to-[#0a0f1d] text-[#f8fafc]">
      {/* Navigation Header */}
      <div className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50 px-4 py-4 sm:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link
            href="/academy"
            className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Academy Hub
          </Link>
          <div className="flex items-center gap-2 font-mono text-xs text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full">
            <GraduationCap className="w-3.5 h-3.5" />
            Module 1: Candlestick Fundamentals
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-10 space-y-12">
        {/* Hero Title */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent">
            Candlestick & Price Action Basics
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Japanese Candlesticks are the visual language of financial markets. Learn how to decode market psychology, buy/sell pressure, and key levels directly from price charts.
          </p>
        </div>

        {/* 1. Anatomy of a Candlestick */}
        <section className="bg-slate-800/60 border border-slate-700/70 rounded-3xl p-6 sm:p-10 shadow-xl space-y-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">1. Anatomy of a Candlestick</h2>
              <p className="text-xs text-slate-400 font-mono">The 4 Key Data Points: Open, High, Low, Close (OHLC)</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Visual Candlestick Diagram */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center space-y-4">
              <div className="flex justify-around w-full gap-8">
                {/* Bullish Candle */}
                <div className="flex flex-col items-center space-y-1 text-center">
                  <span className="text-[11px] font-mono text-emerald-400 font-bold uppercase">High: ₹105</span>
                  <div className="w-0.5 h-8 bg-emerald-400"></div>
                  <div className="w-16 h-28 bg-emerald-500/30 border-2 border-emerald-400 rounded flex flex-col justify-between py-1 text-[10px] font-mono font-bold text-white">
                    <span>Close: ₹103</span>
                    <span>Open: ₹98</span>
                  </div>
                  <div className="w-0.5 h-8 bg-emerald-400"></div>
                  <span className="text-[11px] font-mono text-emerald-400 font-bold uppercase">Low: ₹96</span>
                  <span className="text-xs font-bold text-emerald-400 mt-2">BULLISH (GREEN)</span>
                </div>

                {/* Bearish Candle */}
                <div className="flex flex-col items-center space-y-1 text-center">
                  <span className="text-[11px] font-mono text-rose-400 font-bold uppercase">High: ₹106</span>
                  <div className="w-0.5 h-8 bg-rose-400"></div>
                  <div className="w-16 h-28 bg-rose-500/30 border-2 border-rose-400 rounded flex flex-col justify-between py-1 text-[10px] font-mono font-bold text-white">
                    <span>Open: ₹104</span>
                    <span>Close: ₹97</span>
                  </div>
                  <div className="w-0.5 h-8 bg-rose-400"></div>
                  <span className="text-[11px] font-mono text-rose-400 font-bold uppercase">Low: ₹95</span>
                  <span className="text-xs font-bold text-rose-400 mt-2">BEARISH (RED)</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 text-center font-mono pt-3">
                Real Body represents price movement between Open & Close. Wicks (Shadows) show extreme highs and lows rejected by participants.
              </p>
            </div>

            {/* Explanation Breakdown */}
            <div className="space-y-4 text-xs sm:text-sm text-slate-300">
              <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-700/60 space-y-1">
                <span className="font-bold text-blue-400 font-mono">Real Body:</span>
                <p>The colored rectangular portion of the candlestick that indicates the range between market open and close during the session.</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-700/60 space-y-1">
                <span className="font-bold text-emerald-400 font-mono">Upper Shadow (Wick):</span>
                <p>The thin line above the body. It represents the highest price reached during the period before sellers rejected higher values.</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-700/60 space-y-1">
                <span className="font-bold text-amber-400 font-mono">Lower Shadow (Tail):</span>
                <p>The thin line below the body. It represents the lowest price tested before buyers stepped in and pushed the market back up.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Core Candlestick Principles */}
        <section className="bg-slate-800/60 border border-slate-700/70 rounded-3xl p-6 sm:p-10 shadow-xl space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">2. The 3 Golden Rules of Candlestick Trading</h2>
              <p className="text-xs text-slate-400 font-mono">Never trade candles in isolation</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-700/70 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-sm">1</div>
              <h3 className="font-bold text-white text-base">Location is Everything</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                A Hammer in the middle of nowhere has little significance. A Hammer formed directly on a major historical support level or 200 EMA has 3x higher win probability.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-700/70 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">2</div>
              <h3 className="font-bold text-white text-base">Wait for Candle Close</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                A candle is not a pattern until its time period has officially closed. An apparent hammer at 14 minutes can turn into a bearish engulfing by the 15th minute.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-700/70 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-sm">3</div>
              <h3 className="font-bold text-white text-base">Volume Confirmation</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                High institutional volume during pattern formation confirms genuine conviction from big market participants, reducing the risk of deceptive false breakouts.
              </p>
            </div>
          </div>
        </section>

        {/* 3. Essential Single-Candle Patterns */}
        <section className="bg-slate-800/60 border border-slate-700/70 rounded-3xl p-6 sm:p-10 shadow-xl space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">3. Essential Single-Candlestick Setups</h2>
              <p className="text-xs text-slate-400 font-mono">Foundational patterns for intraday and swing trading</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-700/70 space-y-2">
              <span className="text-xs px-2 py-0.5 rounded font-bold font-mono bg-emerald-500/20 text-emerald-400">Bullish Reversal</span>
              <h4 className="font-bold text-white text-sm">Hammer</h4>
              <p className="text-xs text-slate-400">Long lower shadow (2x body) at the bottom of a downtrend. Signals rejection of lower prices.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-700/70 space-y-2">
              <span className="text-xs px-2 py-0.5 rounded font-bold font-mono bg-rose-500/20 text-rose-400">Bearish Reversal</span>
              <h4 className="font-bold text-white text-sm">Shooting Star</h4>
              <p className="text-xs text-slate-400">Long upper shadow with small lower body at peak of uptrend. Buyers trapped at highs.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-700/70 space-y-2">
              <span className="text-xs px-2 py-0.5 rounded font-bold font-mono bg-amber-500/20 text-amber-400">Indecision</span>
              <h4 className="font-bold text-white text-sm">Doji (Cross)</h4>
              <p className="text-xs text-slate-400">Open equals close. Tug-of-war between bulls and bears resulted in a dead heat. Prepare for breakout.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-700/70 space-y-2">
              <span className="text-xs px-2 py-0.5 rounded font-bold font-mono bg-emerald-500/20 text-emerald-400">Strong Momentum</span>
              <h4 className="font-bold text-white text-sm">Marubozu</h4>
              <p className="text-xs text-slate-400">Full solid body with zero wicks. Unrelenting one-sided control from opening bell to close.</p>
            </div>
          </div>
        </section>

        {/* Bottom CTA to next modules */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-blue-900/30 via-slate-900/60 to-indigo-900/30 border border-blue-500/30">
          <div>
            <h4 className="text-base font-bold text-white">Ready for live chart analysis?</h4>
            <p className="text-xs text-slate-400">Test these concepts directly on our real-time interactive trading terminal.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/academy/live-charts"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all shadow-md"
            >
              Open Live Charts →
            </Link>
            <Link
              href="/academy/advanced-guide"
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-all"
            >
              Advanced Guide
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
