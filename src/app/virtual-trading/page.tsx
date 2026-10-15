"use client";

import { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  History,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCcw,
  Search,
  Check,
  Shield,
  Clock,
  Sparkles,
} from "lucide-react";
import confetti from "canvas-confetti";

interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  volume: string;
}

interface Position {
  symbol: string;
  qty: number;
  avgPrice: number;
}

interface Order {
  id: string;
  symbol: string;
  type: "BUY" | "SELL";
  qty: number;
  price: number;
  total: number;
  time: string;
}

const INITIAL_STOCKS: Stock[] = [
  { symbol: "RELIANCE", name: "Reliance Industries", price: 2984.5, change: 32.4, changePercent: 1.1, high: 3012.0, low: 2950.0, volume: "4.8M" },
  { symbol: "TCS", name: "Tata Consultancy Services", price: 4180.2, change: -18.7, changePercent: -0.44, high: 4220.0, low: 4165.0, volume: "2.1M" },
  { symbol: "HDFCBANK", name: "HDFC Bank Ltd.", price: 1682.0, change: 12.3, changePercent: 0.74, high: 1695.0, low: 1670.0, volume: "9.3M" },
  { symbol: "INFY", name: "Infosys Ltd.", price: 1745.8, change: 24.1, changePercent: 1.4, high: 1758.0, low: 1720.0, volume: "5.5M" },
  { symbol: "ICICIBANK", name: "ICICI Bank Ltd.", price: 1210.4, change: -4.5, changePercent: -0.37, high: 1222.0, low: 1205.0, volume: "7.2M" },
  { symbol: "TATAMOTORS", name: "Tata Motors Ltd.", price: 986.5, change: 16.8, changePercent: 1.73, high: 994.0, low: 970.0, volume: "12.4M" },
  { symbol: "ITC", name: "ITC Limited", price: 432.1, change: -1.2, changePercent: -0.28, high: 435.0, low: 430.5, volume: "6.9M" },
  { symbol: "SBIN", name: "State Bank of India", price: 814.6, change: 7.9, changePercent: 0.98, high: 820.0, low: 808.0, volume: "8.1M" },
  { symbol: "BHARTIARTL", name: "Bharti Airtel Ltd.", price: 1540.0, change: 22.0, changePercent: 1.45, high: 1555.0, low: 1520.0, volume: "3.4M" },
  { symbol: "POWERGRID", name: "Power Grid Corp.", price: 326.8, change: 3.4, changePercent: 1.05, high: 329.0, low: 322.0, volume: "4.2M" },
];

export default function VirtualTradingPage() {
  const [stocks, setStocks] = useState<Stock[]>(INITIAL_STOCKS);
  const [selectedStock, setSelectedStock] = useState<Stock>(INITIAL_STOCKS[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [quantity, setQuantity] = useState<number>(1);
  const [balance, setBalance] = useState<number>(100000);
  const [positions, setPositions] = useState<Record<string, Position>>({});
  const [orders, setOrders] = useState<Order[]>([]);
  const [notification, setNotification] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  // Load from local storage
  useEffect(() => {
    const savedBal = localStorage.getItem("sg_virtual_balance");
    const savedPos = localStorage.getItem("sg_virtual_positions");
    const savedOrders = localStorage.getItem("sg_virtual_orders");

    if (savedBal) setBalance(parseFloat(savedBal));
    if (savedPos) setPositions(JSON.parse(savedPos));
    if (savedOrders) setOrders(JSON.parse(savedOrders));
  }, []);

  // Sync to local storage
  const saveTradingState = (newBal: number, newPos: Record<string, Position>, newOrders: Order[]) => {
    localStorage.setItem("sg_virtual_balance", newBal.toString());
    localStorage.setItem("sg_virtual_positions", JSON.stringify(newPos));
    localStorage.setItem("sg_virtual_orders", JSON.stringify(newOrders));
  };

  // Price ticks simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setStocks((prev) =>
        prev.map((s) => {
          const deltaPercent = (Math.random() - 0.49) * 0.4; // slight random fluctuation
          const newPrice = Math.max(10, +(s.price * (1 + deltaPercent / 100)).toFixed(2));
          const change = +(newPrice - (s.price - s.change)).toFixed(2);
          const changePercent = +((change / (newPrice - change)) * 100).toFixed(2);
          return {
            ...s,
            price: newPrice,
            change,
            changePercent,
            high: Math.max(s.high, newPrice),
            low: Math.min(s.low, newPrice),
          };
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Update selectedStock live price from stocks array
  useEffect(() => {
    const found = stocks.find((s) => s.symbol === selectedStock.symbol);
    if (found) setSelectedStock(found);
  }, [stocks, selectedStock.symbol]);

  const showToast = (msg: string, type: "success" | "error") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const handleBuy = () => {
    if (quantity <= 0) {
      showToast("Please enter a valid quantity", "error");
      return;
    }

    const totalCost = selectedStock.price * quantity;
    if (totalCost > balance) {
      showToast(`Insufficient balance! Required: ₹${totalCost.toLocaleString()}, Available: ₹${balance.toLocaleString()}`, "error");
      return;
    }

    const newBalance = +(balance - totalCost).toFixed(2);
    setBalance(newBalance);

    const currentPos = positions[selectedStock.symbol];
    const newQty = (currentPos ? currentPos.qty : 0) + quantity;
    const prevInvestment = currentPos ? currentPos.qty * currentPos.avgPrice : 0;
    const newAvgPrice = +((prevInvestment + totalCost) / newQty).toFixed(2);

    const newPositions = {
      ...positions,
      [selectedStock.symbol]: {
        symbol: selectedStock.symbol,
        qty: newQty,
        avgPrice: newAvgPrice,
      },
    };
    setPositions(newPositions);

    const newOrder: Order = {
      id: "ORD-" + Math.floor(100000 + Math.random() * 900000),
      symbol: selectedStock.symbol,
      type: "BUY",
      qty: quantity,
      price: selectedStock.price,
      total: totalCost,
      time: new Date().toLocaleTimeString(),
    };

    const newOrders = [newOrder, ...orders];
    setOrders(newOrders);
    saveTradingState(newBalance, newPositions, newOrders);

    confetti({ particleCount: 30, spread: 60, origin: { y: 0.8 } });
    showToast(`Bought ${quantity} shares of ${selectedStock.symbol} at ₹${selectedStock.price}`, "success");
  };

  const handleSell = () => {
    if (quantity <= 0) {
      showToast("Please enter a valid quantity", "error");
      return;
    }

    const currentPos = positions[selectedStock.symbol];
    if (!currentPos || currentPos.qty < quantity) {
      showToast(`You do not own enough shares to sell! You hold: ${currentPos ? currentPos.qty : 0}`, "error");
      return;
    }

    const totalRevenue = selectedStock.price * quantity;
    const newBalance = +(balance + totalRevenue).toFixed(2);
    setBalance(newBalance);

    const remainingQty = currentPos.qty - quantity;
    const newPositions = { ...positions };

    if (remainingQty <= 0) {
      delete newPositions[selectedStock.symbol];
    } else {
      newPositions[selectedStock.symbol] = {
        ...currentPos,
        qty: remainingQty,
      };
    }
    setPositions(newPositions);

    const newOrder: Order = {
      id: "ORD-" + Math.floor(100000 + Math.random() * 900000),
      symbol: selectedStock.symbol,
      type: "SELL",
      qty: quantity,
      price: selectedStock.price,
      total: totalRevenue,
      time: new Date().toLocaleTimeString(),
    };

    const newOrders = [newOrder, ...orders];
    setOrders(newOrders);
    saveTradingState(newBalance, newPositions, newOrders);

    showToast(`Sold ${quantity} shares of ${selectedStock.symbol} at ₹${selectedStock.price}`, "success");
  };

  const resetAccount = () => {
    if (confirm("Reset virtual trading account to default ₹1,00,000 balance?")) {
      setBalance(100000);
      setPositions({});
      setOrders([]);
      saveTradingState(100000, {}, []);
      showToast("Account reset to ₹1,00,000 successfully!", "success");
    }
  };

  // Portfolio calculations
  const totalInvested = Object.values(positions).reduce(
    (acc, pos) => acc + pos.qty * pos.avgPrice,
    0
  );

  const currentValue = Object.values(positions).reduce((acc, pos) => {
    const live = stocks.find((s) => s.symbol === pos.symbol)?.price || pos.avgPrice;
    return acc + pos.qty * live;
  }, 0);

  const unrealizedPnL = currentValue - totalInvested;
  const pnlPercent = totalInvested > 0 ? (unrealizedPnL / totalInvested) * 100 : 0;
  const netWorth = balance + currentValue;

  const filteredStocks = stocks.filter(
    (s) =>
      s.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed top-20 right-6 z-50 p-4 rounded-2xl glass-panel shadow-2xl flex items-center gap-3 text-sm animate-in fade-in slide-in-from-top-4 duration-200 border ${
            notification.type === "success"
              ? "bg-emerald-950/90 border-emerald-500/40 text-emerald-200"
              : "bg-red-950/90 border-red-500/40 text-red-200"
          }`}
        >
          {notification.type === "success" ? <Check className="w-5 h-5 text-emerald-400" /> : <Shield className="w-5 h-5 text-red-400" />}
          <span>{notification.msg}</span>
        </div>
      )}

      {/* Top Banner & Portfolio Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl glass-panel bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Available Cash</span>
            <Wallet className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-white mt-1">
            ₹{balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <span className="text-[10px] text-slate-500">Virtual margin available</span>
        </div>

        <div className="p-5 rounded-2xl glass-panel bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Current Holdings Value</span>
            <TrendingUp className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-white mt-1">
            ₹{currentValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <span className="text-[10px] text-slate-500">Invested: ₹{totalInvested.toFixed(0)}</span>
        </div>

        <div className="p-5 rounded-2xl glass-panel bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Unrealized P&L</span>
            {unrealizedPnL >= 0 ? (
              <ArrowUpRight className="w-4 h-4 text-emerald-400" />
            ) : (
              <ArrowDownRight className="w-4 h-4 text-red-400" />
            )}
          </div>
          <p
            className={`text-xl sm:text-2xl font-bold mt-1 ${
              unrealizedPnL >= 0 ? "text-emerald-400" : "text-red-400"
            }`}
          >
            {unrealizedPnL >= 0 ? "+" : ""}₹{unrealizedPnL.toFixed(2)}
          </p>
          <span
            className={`text-[10px] font-semibold ${
              unrealizedPnL >= 0 ? "text-emerald-400" : "text-red-400"
            }`}
          >
            {pnlPercent >= 0 ? "+" : ""}
            {pnlPercent.toFixed(2)}% ROI
          </span>
        </div>

        <div className="p-5 rounded-2xl glass-panel bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Net Portfolio Value</span>
            <button
              onClick={resetAccount}
              className="p-1 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              title="Reset Virtual Account"
            >
              <RefreshCcw className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-cyan-400">
            ₹{netWorth.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <span className="text-[10px] text-slate-500">Live Paper Portfolio</span>
        </div>
      </div>

      {/* Main Terminal Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Watchlist */}
        <div className="lg:col-span-4 space-y-3">
          <div className="p-4 rounded-2xl glass-panel bg-slate-900/60 border border-slate-800">
            <div className="relative mb-3">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search NSE stock..."
                className="w-full pl-9 pr-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="space-y-1.5 max-h-[580px] overflow-y-auto pr-1">
              {filteredStocks.map((s) => {
                const isSelected = s.symbol === selectedStock.symbol;
                const isUp = s.change >= 0;
                return (
                  <button
                    key={s.symbol}
                    onClick={() => setSelectedStock(s)}
                    className={`w-full text-left p-3 rounded-xl transition-all flex items-center justify-between ${
                      isSelected
                        ? "bg-cyan-500/15 border border-cyan-500/30 text-white"
                        : "hover:bg-slate-800/60 text-slate-300 border border-transparent"
                    }`}
                  >
                    <div>
                      <div className="font-bold text-xs flex items-center gap-1.5">
                        {s.symbol}
                        <span className="text-[9px] px-1 py-0.2 rounded bg-slate-800 text-slate-400 font-mono">
                          NSE
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate max-w-[130px]">{s.name}</p>
                    </div>

                    <div className="text-right">
                      <div className="font-mono text-xs font-semibold">₹{s.price.toFixed(2)}</div>
                      <div
                        className={`text-[10px] font-mono font-medium flex items-center justify-end ${
                          isUp ? "text-emerald-400" : "text-red-400"
                        }`}
                      >
                        {isUp ? "+" : ""}
                        {s.changePercent}%
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Center/Right Trading & Chart Desk */}
        <div className="lg:col-span-8 space-y-6">
          {/* Active Stock Header */}
          <div className="p-6 rounded-2xl glass-panel bg-slate-900/60 border border-slate-800">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-extrabold text-white">{selectedStock.symbol}</h2>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-medium">
                    NSE Live
                  </span>
                </div>
                <p className="text-xs text-slate-400">{selectedStock.name}</p>
              </div>

              <div className="text-right">
                <div className="text-3xl font-extrabold font-mono text-white">
                  ₹{selectedStock.price.toFixed(2)}
                </div>
                <div
                  className={`text-xs font-mono font-semibold flex items-center justify-end gap-1 ${
                    selectedStock.change >= 0 ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {selectedStock.change >= 0 ? (
                    <TrendingUp className="w-3.5 h-3.5" />
                  ) : (
                    <TrendingDown className="w-3.5 h-3.5" />
                  )}
                  {selectedStock.change >= 0 ? "+" : ""}
                  {selectedStock.change.toFixed(2)} ({selectedStock.changePercent}%)
                </div>
              </div>
            </div>

            {/* Trading Metrics Grid */}
            <div className="grid grid-cols-3 gap-3 py-4 text-xs">
              <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                <span className="text-slate-400 block text-[10px]">24h High</span>
                <span className="font-mono font-semibold text-emerald-400">₹{selectedStock.high}</span>
              </div>
              <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                <span className="text-slate-400 block text-[10px]">24h Low</span>
                <span className="font-mono font-semibold text-red-400">₹{selectedStock.low}</span>
              </div>
              <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                <span className="text-slate-400 block text-[10px]">Volume</span>
                <span className="font-mono font-semibold text-cyan-400">{selectedStock.volume}</span>
              </div>
            </div>

            {/* Trading Execution Box */}
            <div className="pt-4 border-t border-slate-800">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="w-full sm:w-auto flex-1">
                  <label className="block text-[11px] text-slate-400 mb-1 font-medium">
                    Order Quantity (Shares)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm font-mono text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="w-full sm:w-auto text-center sm:text-left">
                  <span className="block text-[11px] text-slate-400 mb-1 font-medium">Total Margin</span>
                  <div className="font-mono font-bold text-base text-cyan-300">
                    ₹{(selectedStock.price * quantity).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto pt-2 sm:pt-4">
                  <button
                    onClick={handleBuy}
                    className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-600/20 transition-all hover:scale-105 active:scale-95"
                  >
                    BUY (Call)
                  </button>
                  <button
                    onClick={handleSell}
                    className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-red-600 hover:bg-red-500 shadow-lg shadow-red-600/20 transition-all hover:scale-105 active:scale-95"
                  >
                    SELL (Put)
                  </button>
                </div>
              </div>

              {positions[selectedStock.symbol] && (
                <div className="mt-3 text-[11px] text-slate-400 bg-blue-950/30 p-2.5 rounded-xl border border-blue-900/40 flex items-center justify-between">
                  <span>
                    You currently hold:{" "}
                    <strong className="text-cyan-400 font-mono">
                      {positions[selectedStock.symbol].qty} shares
                    </strong>{" "}
                    (Avg: ₹{positions[selectedStock.symbol].avgPrice})
                  </span>
                  <span className="font-mono text-emerald-400 font-semibold">
                    Current Worth: ₹{(positions[selectedStock.symbol].qty * selectedStock.price).toFixed(2)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Orders History & Current Holdings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Holdings */}
            <div className="p-5 rounded-2xl glass-panel bg-slate-900/60 border border-slate-800">
              <h3 className="font-bold text-sm text-white mb-3 flex items-center gap-2">
                <Wallet className="w-4 h-4 text-cyan-400" /> Current Positions
              </h3>

              {Object.keys(positions).length === 0 ? (
                <p className="text-xs text-slate-500 py-6 text-center">No active stock holdings</p>
              ) : (
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {Object.values(positions).map((pos) => {
                    const live = stocks.find((s) => s.symbol === pos.symbol)?.price || pos.avgPrice;
                    const pnl = (live - pos.avgPrice) * pos.qty;
                    return (
                      <div
                        key={pos.symbol}
                        className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="font-bold text-white">{pos.symbol}</div>
                          <div className="text-[10px] text-slate-400">
                            {pos.qty} shares @ ₹{pos.avgPrice}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-mono font-semibold text-white">
                            ₹{(pos.qty * live).toFixed(2)}
                          </div>
                          <div
                            className={`text-[10px] font-mono font-bold ${
                              pnl >= 0 ? "text-emerald-400" : "text-red-400"
                            }`}
                          >
                            {pnl >= 0 ? "+" : ""}₹{pnl.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Orders Log */}
            <div className="p-5 rounded-2xl glass-panel bg-slate-900/60 border border-slate-800">
              <h3 className="font-bold text-sm text-white mb-3 flex items-center gap-2">
                <History className="w-4 h-4 text-blue-400" /> Recent Execution Log
              </h3>

              {orders.length === 0 ? (
                <p className="text-xs text-slate-500 py-6 text-center">No trades placed yet</p>
              ) : (
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {orders.slice(0, 8).map((ord) => (
                    <div
                      key={ord.id}
                      className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                            ord.type === "BUY"
                              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                              : "bg-red-500/20 text-red-400 border border-red-500/30"
                          }`}
                        >
                          {ord.type}
                        </span>
                        <div>
                          <div className="font-bold text-white">{ord.symbol}</div>
                          <div className="text-[10px] text-slate-500">{ord.time}</div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-mono font-medium text-slate-300">
                          {ord.qty} × ₹{ord.price.toFixed(2)}
                        </div>
                        <div className="font-mono text-[10px] text-cyan-400">
                          ₹{ord.total.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
