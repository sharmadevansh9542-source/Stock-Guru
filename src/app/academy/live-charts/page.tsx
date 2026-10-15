"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BarChart2,
  TrendingUp,
  TrendingDown,
  Layers,
  Activity,
  Maximize2,
  Calendar,
  Sparkles,
  ChevronRight,
  Search,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

const STOCKS = [
  { symbol: "RELIANCE", name: "Reliance Industries" },
  { symbol: "TCS", name: "Tata Consultancy Services" },
  { symbol: "INFY", name: "Infosys Ltd" },
  { symbol: "HDFCBANK", name: "HDFC Bank Ltd" },
  { symbol: "ICICIBANK", name: "ICICI Bank Ltd" },
  { symbol: "SBIN", name: "State Bank of India" },
  { symbol: "TATAMOTORS", name: "Tata Motors Ltd" },
  { symbol: "MARUTI", name: "Maruti Suzuki India" },
  { symbol: "ADANIENT", name: "Adani Enterprises" },
  { symbol: "BAJFINANCE", name: "Bajaj Finance Ltd" },
  { symbol: "WIPRO", name: "Wipro Ltd" },
  { symbol: "POWERGRID", name: "Power Grid Corp" },
];

export default function LiveChartsPage() {
  const [selectedStock, setSelectedStock] = useState("RELIANCE");
  const [period, setPeriod] = useState("3mo");
  const [candles, setCandles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"price" | "candlesticks" | "rsi" | "macd" | "volume">("price");

  const loadCandles = async (sym: string, per = period) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/stocks/${sym}/candles?period=${per}`);
      const json = await res.json();
      setCandles(json.candles || []);
    } catch (e) {
      console.error("Failed to load candles:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCandles(selectedStock, period);
  }, [selectedStock, period]);

  const latestCandle = candles[candles.length - 1] || {};
  const prevCandle = candles[candles.length - 2] || latestCandle;
  const currentPrice = latestCandle.close || 0;
  const change = +(currentPrice - (prevCandle.close || currentPrice)).toFixed(2);
  const pctChange = prevCandle.close ? +((change / prevCandle.close) * 100).toFixed(2) : 0;
  const isUp = change >= 0;

  return (
    <div className="min-h-screen bg-[#060913] text-[#f8fafc]">
      {/* Top Navbar */}
      <div className="border-b border-slate-800 bg-[#0a0f1d] px-4 py-3 sm:px-8">
        <div className="max-w-[1700px] mx-auto flex items-center justify-between">
          <Link
            href="/academy"
            className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Academy Hub
          </Link>
          <div className="flex items-center gap-2 font-mono text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping mr-1"></span>
            LIVE Market Charting Terminal
          </div>
        </div>
      </div>

      <div className="max-w-[1700px] mx-auto p-4 sm:p-6 space-y-6">
        {/* Ticker & Metrics Header */}
        <div className="bg-[#0c1222] border border-slate-800 rounded-2xl p-4 sm:p-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <BarChart2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-wide">
                  {selectedStock} <span className="text-xs text-slate-400 font-mono">NSE / BSE</span>
                </h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/30 text-blue-400">
                  YAHOO FINANCE LIVE
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Real-Time Candlestick Price Action & Technical Oscillators
              </p>
            </div>
          </div>

          {/* Live Price Box */}
          <div className="flex items-center gap-6 bg-[#070b14] border border-slate-800 px-5 py-3 rounded-xl font-mono">
            <div>
              <div className="text-[10px] text-slate-500 uppercase">Current Close</div>
              <div className="text-xl font-bold text-white">
                ₹{currentPrice.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </div>
            </div>
            <div className="border-l border-slate-800 pl-4">
              <div className="text-[10px] text-slate-500 uppercase">Day Change</div>
              <div className={`text-sm font-bold flex items-center gap-1 ${isUp ? "text-emerald-400" : "text-rose-400"}`}>
                {isUp ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {change > 0 ? `+${change}` : change} ({pctChange}%)
              </div>
            </div>
            <div className="border-l border-slate-800 pl-4 hidden md:block">
              <div className="text-[10px] text-slate-500 uppercase">Session High / Low</div>
              <div className="text-xs text-slate-300">
                ₹{latestCandle.high || 0} / ₹{latestCandle.low || 0}
              </div>
            </div>
          </div>
        </div>

        {/* Chart Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Stock Selector Sidebar */}
          <div className="lg:col-span-3 bg-[#0c1222] border border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="text-xs font-bold text-slate-400 tracking-wider uppercase font-mono mb-2">
              Select Bluechip Stock
            </div>
            <div className="space-y-1.5 max-h-[520px] overflow-y-auto pr-1">
              {STOCKS.map((s) => {
                const isSelected = s.symbol === selectedStock;
                return (
                  <button
                    key={s.symbol}
                    onClick={() => setSelectedStock(s.symbol)}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between group ${
                      isSelected
                        ? "bg-blue-600/15 border-blue-500/50 text-white shadow-md shadow-blue-500/5"
                        : "bg-[#070b14]/60 border-slate-800/80 hover:bg-[#070b14] text-slate-300"
                    }`}
                  >
                    <div>
                      <div className="font-mono font-bold text-xs text-white flex items-center gap-1">
                        {s.symbol}
                        <span className="text-[10px] text-slate-500">.NS</span>
                      </div>
                      <div className="text-[11px] text-slate-400 truncate max-w-[170px]">{s.name}</div>
                    </div>
                    <ChevronRight className={`w-4 h-4 ${isSelected ? "text-blue-400" : "text-slate-600"}`} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Chart Viewer */}
          <div className="lg:col-span-9 bg-[#0c1222] border border-slate-800 rounded-2xl p-4 sm:p-6 space-y-4">
            {/* Chart Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
              {/* Chart Mode Switcher */}
              <div className="flex flex-wrap items-center gap-2">
                {[
                  { id: "price", label: "Price & Moving Averages" },
                  { id: "rsi", label: "RSI Momentum (14)" },
                  { id: "macd", label: "MACD & Signal" },
                  { id: "volume", label: "Volume Bars" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all ${
                      activeTab === tab.id
                        ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                        : "bg-[#070b14] text-slate-400 hover:text-white"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Timeframe Filter */}
              <div className="flex items-center gap-1 bg-[#070b14] p-1 rounded-xl border border-slate-800 text-xs font-mono">
                {["1mo", "3mo", "6mo", "1y"].map((p) => (
                  <button
                    key={p}
                    onClick={() => setPeriod(p)}
                    className={`px-2.5 py-1 rounded-lg uppercase ${
                      period === p ? "bg-blue-600 text-white font-bold" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Recharts Canvas */}
            <div className="h-[440px] w-full pt-2">
              {loading ? (
                <div className="h-full flex items-center justify-center font-mono text-xs text-slate-400">
                  <span className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-2"></span>
                  Fetching Yahoo Finance Live Candles...
                </div>
              ) : activeTab === "price" ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={candles}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#111827" />
                    <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 10 }} />
                    <YAxis domain={["auto", "auto"]} stroke="#64748b" tickFormatter={(v) => `₹${v}`} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#070b14", borderColor: "#1e293b", borderRadius: "12px", color: "#f8fafc" }}
                      formatter={(val) => [`₹${val}`, "Price"]}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="close" name="Close Price" stroke="#2563eb" strokeWidth={2.5} dot={false} />
                    <Line type="monotone" dataKey="ma7" name="MA 7" stroke="#10b981" strokeWidth={1.5} dot={false} />
                    <Line type="monotone" dataKey="ma21" name="MA 21" stroke="#f59e0b" strokeWidth={1.5} dot={false} />
                    <Line type="monotone" dataKey="ma50" name="MA 50" stroke="#ef4444" strokeWidth={1.5} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              ) : activeTab === "rsi" ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={candles}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#111827" />
                    <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 10 }} />
                    <YAxis domain={[0, 100]} stroke="#64748b" />
                    <Tooltip contentStyle={{ backgroundColor: "#070b14", borderColor: "#1e293b", borderRadius: "12px" }} />
                    <Legend />
                    <Line type="monotone" dataKey="rsi" name="RSI (14)" stroke="#818cf8" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              ) : activeTab === "macd" ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={candles}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#111827" />
                    <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 10 }} />
                    <YAxis stroke="#64748b" />
                    <Tooltip contentStyle={{ backgroundColor: "#070b14", borderColor: "#1e293b", borderRadius: "12px" }} />
                    <Legend />
                    <Line type="monotone" dataKey="macd" name="MACD Oscillator" stroke="#10b981" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={candles}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#111827" />
                    <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 10 }} />
                    <YAxis stroke="#64748b" />
                    <Tooltip contentStyle={{ backgroundColor: "#070b14", borderColor: "#1e293b", borderRadius: "12px" }} />
                    <Bar dataKey="volume" name="Volume Traded" fill="#3b82f6" opacity={0.7} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
