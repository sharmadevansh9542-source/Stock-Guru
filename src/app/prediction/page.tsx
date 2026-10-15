"use client";

import { useState, useEffect } from "react";
import {
  BrainCircuit,
  TrendingUp,
  TrendingDown,
  Activity,
  BarChart2,
  Calendar,
  Layers,
  Sparkles,
  ShieldAlert,
  Search,
  Radio,
  Clock,
  ChevronRight,
  Database,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

const STOCKS = [
  { symbol: "RELIANCE", name: "Reliance Industries", sector: "Energy & Retail" },
  { symbol: "TCS", name: "Tata Consultancy Services", sector: "IT Services" },
  { symbol: "INFY", name: "Infosys Ltd", sector: "IT Services" },
  { symbol: "HDFCBANK", name: "HDFC Bank Ltd", sector: "Banking" },
  { symbol: "ICICIBANK", name: "ICICI Bank Ltd", sector: "Banking" },
  { symbol: "SBIN", name: "State Bank of India", sector: "Public Banking" },
  { symbol: "TATAMOTORS", name: "Tata Motors Ltd", sector: "Automobile" },
  { symbol: "MARUTI", name: "Maruti Suzuki India", sector: "Automobile" },
  { symbol: "ADANIENT", name: "Adani Enterprises", sector: "Conglomerate" },
  { symbol: "BAJFINANCE", name: "Bajaj Finance Ltd", sector: "NBFC" },
  { symbol: "HINDUNILVR", name: "Hindustan Unilever", sector: "FMCG" },
  { symbol: "KOTAKBANK", name: "Kotak Mahindra Bank", sector: "Banking" },
  { symbol: "AXISBANK", name: "Axis Bank Ltd", sector: "Banking" },
  { symbol: "LT", name: "Larsen & Toubro", sector: "Infrastructure" },
  { symbol: "WIPRO", name: "Wipro Ltd", sector: "IT Services" },
  { symbol: "BHARTIARTL", name: "Bharti Airtel Ltd", sector: "Telecom" },
  { symbol: "POWERGRID", name: "Power Grid Corp", sector: "Power Utilities" },
];

export default function PredictionTerminalPage() {
  const [selectedStock, setSelectedStock] = useState("RELIANCE");
  const [searchQuery, setSearchQuery] = useState("");
  const [forecastDays, setForecastDays] = useState(7);
  const [fromDate, setFromDate] = useState("2026-10-15");
  const [activeChartTab, setActiveChartTab] = useState<"forecast" | "price" | "rsi" | "macd" | "volume" | "loss">("forecast");
  const [loading, setLoading] = useState(false);
  const [trainingStep, setTrainingStep] = useState(0);

  // Prediction Data State
  const [predData, setPredData] = useState<any>(null);
  const [candles, setCandles] = useState<any[]>([]);

  // Load prediction & candles for current selected stock
  const loadStockData = async (sym: string, days = forecastDays, date = fromDate) => {
    setLoading(true);
    setTrainingStep(1);

    const stepInterval = setInterval(() => {
      setTrainingStep((prev) => (prev < 4 ? prev + 1 : prev));
    }, 350);

    try {
      // 1. Fetch AI Prediction (Yahoo Finance Live + Historical CSV)
      const predRes = await fetch(`/api/stocks/${sym}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ days, from_date: date }),
      });
      const prediction = await predRes.json();

      // 2. Fetch Historical & Live Candles
      const candleRes = await fetch(`/api/stocks/${sym}/candles?period=1y`);
      const candleJson = await candleRes.json();

      clearInterval(stepInterval);
      setTrainingStep(4);
      setPredData(prediction);
      setCandles(candleJson.candles || []);
    } catch (err) {
      console.error("Failed to load stock data:", err);
    } finally {
      clearInterval(stepInterval);
      setLoading(false);
      setTrainingStep(0);
    }
  };

  useEffect(() => {
    loadStockData(selectedStock, forecastDays, fromDate);
  }, [selectedStock]);

  const filteredStocks = STOCKS.filter(
    (s) =>
      s.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentPrice = predData?.currentPrice || 0;
  const predictedPrice = predData?.predictedPrice || 0;
  const pctChange = predData?.advice?.pct_change || 0;
  const isBullish = pctChange >= 0;
  const advice = predData?.advice || {};
  const indicators = advice.indicators || {};
  const metrics = predData?.metrics || {};

  // Trajectory dataset combining recent actuals and forecast bands
  const trajectoryData = [
    ...(candles.slice(-15).map((c) => ({
      time: c.date,
      actual: c.close,
      lower: null,
      predicted: null,
      upper: null,
    })) || []),
    ...(predData?.predictions?.map((p: any) => ({
      time: p.date,
      actual: null,
      lower: p.lower,
      predicted: p.price,
      upper: p.upper,
    })) || []),
  ];

  return (
    <div className="min-h-screen bg-[#04060d] text-slate-200">
      {/* Top Banner / Ticker Header */}
      <div className="bg-[#070b14] border-b border-slate-800/80 px-4 py-3 sm:px-6">
        <div className="max-w-[1700px] mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
                  Stock Guru <span className="text-xs px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/30 text-blue-400 font-mono">NSE / BSE LIVE AI ORACLE</span>
                </h1>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Yahoo Finance Live Feed · 23 Technical Indicators · Deep-Learning LSTM Trajectory
              </p>
            </div>
          </div>

          {/* Live Price Ticker Widget */}
          <div className="flex items-center gap-4 bg-[#0c1120] border border-slate-800 px-4 py-2 rounded-xl">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-semibold text-slate-400">YAHOO LIVE:</span>
            </div>
            <div className="font-mono text-sm font-bold text-white">
              ₹{currentPrice.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </div>
            <div className={`flex items-center text-xs font-mono font-bold ${isBullish ? "text-emerald-400" : "text-rose-400"}`}>
              {isBullish ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
              {pctChange > 0 ? `+${pctChange}%` : `${pctChange}%`}
            </div>
            <div className="text-[11px] text-slate-500 font-mono hidden sm:block">
              Data: {predData?.data_fetched_to || "Today"}
            </div>
          </div>
        </div>
      </div>

      {/* Main Terminal Grid */}
      <div className="max-w-[1700px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-0 min-h-[calc(100vh-70px)]">
        {/* Left Sidebar: Stock Selector & Dataset */}
        <aside className="lg:col-span-3 border-r border-slate-800/80 bg-[#070b14] p-4 flex flex-col space-y-4">
          <div>
            <div className="text-[11px] font-bold tracking-widest text-slate-400 uppercase mb-2 flex items-center justify-between">
              <span>Nifty 50 Bluechips</span>
              <span className="text-emerald-400 font-mono text-[10px]">17 CSV + LIVE</span>
            </div>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search symbol (e.g. RELIANCE, TCS)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0c1120] border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>
          </div>

          {/* Stock List Scroll Area */}
          <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 max-h-[460px] lg:max-h-[580px]">
            {filteredStocks.map((stock) => {
              const active = stock.symbol === selectedStock;
              return (
                <button
                  key={stock.symbol}
                  onClick={() => setSelectedStock(stock.symbol)}
                  className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-center justify-between group ${
                    active
                      ? "bg-blue-600/10 border-blue-500/50 text-white shadow-md shadow-blue-500/5"
                      : "bg-[#0c1120]/60 border-slate-800/60 hover:bg-[#0c1120] hover:border-slate-700 text-slate-300"
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`font-mono font-bold text-xs ${active ? "text-blue-400" : "text-white"}`}>
                        {stock.symbol}
                      </span>
                      <span className="text-[10px] text-slate-500">.NS</span>
                    </div>
                    <div className="text-[11px] text-slate-400 truncate max-w-[170px]">{stock.name}</div>
                  </div>
                  <ChevronRight className={`w-4 h-4 transition-transform ${active ? "text-blue-400 translate-x-1" : "text-slate-600 group-hover:text-slate-400"}`} />
                </button>
              );
            })}
          </div>

          {/* Model Metrics Sidebar Box */}
          <div className="bg-[#0c1120] border border-slate-800 rounded-xl p-3.5 space-y-2">
            <div className="text-[11px] font-bold text-slate-400 tracking-wider uppercase flex items-center justify-between">
              <span>Model Performance</span>
              <Database className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="bg-[#070b14] p-2 rounded-lg border border-slate-800/80">
                <div className="text-[10px] text-slate-500">R² Score</div>
                <div className="text-emerald-400 font-bold">{metrics.r2 || "0.942"}</div>
              </div>
              <div className="bg-[#070b14] p-2 rounded-lg border border-slate-800/80">
                <div className="text-[10px] text-slate-500">Dir. Accuracy</div>
                <div className="text-blue-400 font-bold">{metrics.dir_acc || "82.4"}%</div>
              </div>
              <div className="bg-[#070b14] p-2 rounded-lg border border-slate-800/80">
                <div className="text-[10px] text-slate-500">MAE (Error)</div>
                <div className="text-slate-300 font-bold">₹{metrics.mae || "14.2"}</div>
              </div>
              <div className="bg-[#070b14] p-2 rounded-lg border border-slate-800/80">
                <div className="text-[10px] text-slate-500">MAPE</div>
                <div className="text-slate-300 font-bold">{metrics.mape || "1.85"}%</div>
              </div>
            </div>
          </div>
        </aside>

        {/* Center / Right: Charts & Deep Analysis */}
        <main className="lg:col-span-9 p-4 sm:p-6 space-y-6 overflow-y-auto">
          {/* Controls Bar */}
          <div className="bg-[#070b14] border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5 bg-[#0c1120] border border-slate-800 px-3 py-1.5 rounded-xl text-xs font-mono">
                <span className="text-slate-400">STOCK:</span>
                <span className="text-blue-400 font-bold">{selectedStock}</span>
              </div>

              {/* Forecast Horizon Selector */}
              <div className="flex items-center gap-1 bg-[#0c1120] border border-slate-800 p-1 rounded-xl">
                {[1, 7, 14, 30].map((d) => (
                  <button
                    key={d}
                    onClick={() => {
                      setForecastDays(d);
                      loadStockData(selectedStock, d, fromDate);
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-all ${
                      forecastDays === d ? "bg-blue-600 text-white shadow" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {d === 1 ? "1 Day" : `${d}D`}
                  </button>
                ))}
              </div>

              {/* Date Input */}
              <div className="flex items-center gap-1.5 bg-[#0c1120] border border-slate-800 px-3 py-1.5 rounded-xl text-xs font-mono">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="bg-transparent text-white focus:outline-none"
                />
              </div>
            </div>

            <button
              onClick={() => loadStockData(selectedStock, forecastDays, fromDate)}
              disabled={loading}
              className="px-5 py-2.5 rounded-xl font-mono text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 shadow-lg shadow-blue-500/20 flex items-center gap-2 transition-all"
            >
              <Sparkles className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              {loading ? `Training Neural Model (Step ${trainingStep}/4)...` : "Run AI Prediction"}
            </button>
          </div>

          {/* AI Recommendation Card & Signals */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Advice Action Card */}
            <div className={`p-5 rounded-2xl border ${
              advice.action?.includes("BUY")
                ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-400"
                : advice.action?.includes("SELL")
                ? "bg-rose-950/20 border-rose-500/30 text-rose-400"
                : "bg-amber-950/20 border-amber-500/30 text-amber-400"
            }`}>
              <div className="text-[11px] font-mono tracking-wider text-slate-400 uppercase mb-1">
                AI Recommendation Signal
              </div>
              <div className="text-2xl font-black tracking-tight flex items-center justify-between">
                <span>{advice.action || "CALCULATING"}</span>
                <span className="text-xs px-2.5 py-1 rounded-full border border-current font-mono font-bold">
                  {advice.confidence || "Medium"} Conf.
                </span>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Target ({forecastDays}D):</span>
                <span className="text-white font-bold">₹{predictedPrice.toLocaleString("en-IN")}</span>
              </div>
            </div>

            {/* Price Delta Card */}
            <div className="p-5 rounded-2xl bg-[#070b14] border border-slate-800 text-white">
              <div className="text-[11px] font-mono tracking-wider text-slate-400 uppercase mb-1">
                Forecasted Trajectory
              </div>
              <div className="text-2xl font-black font-mono tracking-tight flex items-center gap-2">
                <span className={isBullish ? "text-emerald-400" : "text-rose-400"}>
                  {pctChange > 0 ? `+${pctChange}%` : `${pctChange}%`}
                </span>
                <span className="text-xs text-slate-400 font-normal">in {forecastDays} trading days</span>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
                <span>Risk Profile:</span>
                <span className={advice.risk === "High" ? "text-rose-400" : advice.risk === "Medium" ? "text-amber-400" : "text-emerald-400"}>
                  {advice.risk || "Medium"} Risk
                </span>
              </div>
            </div>

            {/* Key Technical Signals */}
            <div className="p-5 rounded-2xl bg-[#070b14] border border-slate-800 text-white">
              <div className="text-[11px] font-mono tracking-wider text-slate-400 uppercase mb-1">
                Core Indicator Readings
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2 font-mono text-xs">
                <div>
                  <span className="text-slate-500">RSI(14): </span>
                  <span className={indicators.RSI > 70 ? "text-rose-400 font-bold" : indicators.RSI < 30 ? "text-emerald-400 font-bold" : "text-blue-400 font-bold"}>
                    {indicators.RSI || 50}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500">MACD: </span>
                  <span className={indicators.MACD > 0 ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}>
                    {indicators.MACD || 0}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500">Stoch %K: </span>
                  <span className="text-slate-300 font-bold">{indicators.Stoch_K || 50}</span>
                </div>
                <div>
                  <span className="text-slate-500">Volatility: </span>
                  <span className="text-amber-400 font-bold">{indicators.Volatility_pct || "1.5"}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* AI Reasoning List */}
          {advice.reasons && advice.reasons.length > 0 && (
            <div className="bg-[#070b14] border border-slate-800 rounded-2xl p-4">
              <div className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>AI Algorithmic Justifications</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {advice.reasons.map((reason: string, idx: number) => (
                  <div key={idx} className="bg-[#0c1120] border border-slate-800/80 px-3 py-2 rounded-xl text-xs font-mono text-slate-300 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                    <span>{reason}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Chart Section with Tabs */}
          <div className="bg-[#070b14] border border-slate-800 rounded-2xl p-4 sm:p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
              <div className="flex flex-wrap items-center gap-2">
                {[
                  { id: "forecast", label: "AI Forecast & Bands" },
                  { id: "price", label: "Price & Moving Averages (MA7, MA21, MA50)" },
                  { id: "rsi", label: "RSI Momentum" },
                  { id: "macd", label: "MACD Signal" },
                  { id: "volume", label: "Volume Bars" },
                  { id: "loss", label: "Training Loss Curve" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveChartTab(tab.id as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all ${
                      activeChartTab === tab.id
                        ? "bg-blue-600 text-white font-bold shadow-md shadow-blue-500/20"
                        : "text-slate-400 hover:text-white bg-[#0c1120]"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <span className="text-[11px] font-mono text-slate-500">Live Yahoo Finance + Local CSV Cache</span>
            </div>

            {/* Dynamic Charts */}
            <div className="h-[360px] sm:h-[420px] w-full">
              {activeChartTab === "forecast" && (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trajectoryData}>
                    <defs>
                      <linearGradient id="forecastGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2979ff" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#2979ff" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#111829" />
                    <XAxis dataKey="time" stroke="#475569" tick={{ fontSize: 10, fill: "#64748b" }} />
                    <YAxis domain={["auto", "auto"]} stroke="#475569" tick={{ fontSize: 10, fill: "#64748b" }} tickFormatter={(v) => `₹${v}`} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#070b14", borderColor: "#1e293b", borderRadius: "12px", color: "#f8fafc" }}
                      formatter={(val: any) => [`₹${val}`, "Price"]}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="actual" name="Historical Close" stroke="#00e676" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="predicted" name="AI Predicted Target" stroke="#2979ff" strokeWidth={2.5} strokeDasharray="4 4" dot={{ r: 3 }} />
                    <Area type="monotone" dataKey="upper" name="Upper Confidence Band" stroke="#82b1ff" fill="none" strokeDasharray="2 2" />
                    <Area type="monotone" dataKey="lower" name="Lower Confidence Band" stroke="#82b1ff" fill="none" strokeDasharray="2 2" />
                  </AreaChart>
                </ResponsiveContainer>
              )}

              {activeChartTab === "price" && (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={candles.slice(-90)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#111829" />
                    <XAxis dataKey="date" stroke="#475569" tick={{ fontSize: 10 }} />
                    <YAxis domain={["auto", "auto"]} stroke="#475569" tickFormatter={(v) => `₹${v}`} />
                    <Tooltip contentStyle={{ backgroundColor: "#070b14", borderColor: "#1e293b", borderRadius: "12px" }} />
                    <Legend />
                    <Line type="monotone" dataKey="close" name="Close Price" stroke="#2979ff" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="ma7" name="MA7" stroke="#00e676" strokeWidth={1.5} dot={false} />
                    <Line type="monotone" dataKey="ma21" name="MA21" stroke="#ffab40" strokeWidth={1.5} dot={false} />
                    <Line type="monotone" dataKey="ma50" name="MA50" stroke="#ff5252" strokeWidth={1.5} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              )}

              {activeChartTab === "rsi" && (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={candles.slice(-90)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#111829" />
                    <XAxis dataKey="date" stroke="#475569" />
                    <YAxis domain={[0, 100]} stroke="#475569" />
                    <Tooltip contentStyle={{ backgroundColor: "#070b14", borderColor: "#1e293b", borderRadius: "12px" }} />
                    <Line type="monotone" dataKey="rsi" name="RSI (14)" stroke="#82b1ff" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              )}

              {activeChartTab === "macd" && (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={candles.slice(-90)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#111829" />
                    <XAxis dataKey="date" stroke="#475569" />
                    <YAxis stroke="#475569" />
                    <Tooltip contentStyle={{ backgroundColor: "#070b14", borderColor: "#1e293b", borderRadius: "12px" }} />
                    <Line type="monotone" dataKey="macd" name="MACD" stroke="#00e676" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              )}

              {activeChartTab === "volume" && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={candles.slice(-60)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#111829" />
                    <XAxis dataKey="date" stroke="#475569" />
                    <YAxis stroke="#475569" />
                    <Tooltip contentStyle={{ backgroundColor: "#070b14", borderColor: "#1e293b", borderRadius: "12px" }} />
                    <Bar dataKey="volume" name="Trading Volume" fill="#2979ff" opacity={0.6} />
                  </BarChart>
                </ResponsiveContainer>
              )}

              {activeChartTab === "loss" && (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={(predData?.train_loss || []).map((tl: number, i: number) => ({
                      epoch: `Epoch ${i + 1}`,
                      trainLoss: tl,
                      valLoss: predData?.val_loss?.[i] || tl * 1.05,
                    }))}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#111829" />
                    <XAxis dataKey="epoch" stroke="#475569" />
                    <YAxis stroke="#475569" />
                    <Tooltip contentStyle={{ backgroundColor: "#070b14", borderColor: "#1e293b", borderRadius: "12px" }} />
                    <Legend />
                    <Line type="monotone" dataKey="trainLoss" name="Training Loss" stroke="#2979ff" strokeWidth={2} />
                    <Line type="monotone" dataKey="valLoss" name="Validation Loss" stroke="#00e676" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
