"use client";

import { useState, useEffect } from "react";
import {
  Database,
  Server,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Code,
  Copy,
  Terminal,
  ShieldCheck,
} from "lucide-react";

export default function PgAdminPage() {
  const [statusData, setStatusData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const fetchStatus = () => {
    setLoading(true);
    fetch("/api/db-health")
      .then((res) => res.json())
      .then((data) => setStatusData(data))
      .catch((err) => setStatusData({ status: "error", message: err.message }))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const schemaSnippet = `-- PostgreSQL (pgAdmin 4) Quick Setup:
CREATE DATABASE stockguru;
-- Connect to stockguru database, then create tables:
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    virtual_balance NUMERIC(15, 2) DEFAULT 100000.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    symbol VARCHAR(30) NOT NULL,
    order_type VARCHAR(10) NOT NULL,
    quantity INTEGER NOT NULL,
    execution_price NUMERIC(15, 2) NOT NULL,
    total_amount NUMERIC(15, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);`;

  const copyCode = () => {
    navigator.clipboard.writeText(schemaSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
          <Database className="w-3.5 h-3.5" />
          PostgreSQL & pgAdmin 4 Integration Hub
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Database Connection & Query Manager
        </h1>
        <p className="text-sm text-slate-400">
          Manage relational tables, view active user balances, and inspect execution logs directly connected to your PostgreSQL instance.
        </p>
      </div>

      {/* Status Bar */}
      <div className="p-6 rounded-2xl glass-panel bg-slate-900/60 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Server className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-white text-base">PostgreSQL Service Status</h3>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                  statusData?.status === "connected"
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                }`}
              >
                {statusData?.status === "connected" ? "Live Connected" : "Local Standby / Ready"}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Connection string configured: <code className="text-cyan-400 font-mono">postgresql://postgres:***@localhost:5432/stockguru</code>
            </p>
          </div>
        </div>

        <button
          onClick={fetchStatus}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          Test Connection
        </button>
      </div>

      {/* Grid: Instructions & SQL Schema */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Step-by-Step Instructions */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-2xl glass-panel bg-slate-900/60 border border-slate-800 space-y-4">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyan-400" />
              How to view & control in pgAdmin 4:
            </h3>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex gap-3">
                <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 font-bold">
                  1
                </span>
                <p>
                  Open <strong>pgAdmin 4</strong> on your computer and connect to your local PostgreSQL server (Port: 5432).
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex gap-3">
                <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 font-bold">
                  2
                </span>
                <p>
                  Right-click <strong>Databases</strong> → <strong>Create</strong> → <strong>Database</strong> named <code>stockguru</code>.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex gap-3">
                <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 font-bold">
                  3
                </span>
                <p>
                  Open <strong>Query Tool</strong> and execute the schema SQL script from the right side panel or from <code>database_schema.sql</code>.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex gap-3">
                <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 font-bold">
                  4
                </span>
                <p>
                  Update your credentials in <code>frontend/.env.local</code> if your PostgreSQL password is not <code>postgres</code>.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Schema Code Card */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-6 rounded-2xl glass-panel bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-cyan-400" />
                <h3 className="font-bold text-white text-sm">PostgreSQL Schema (database_schema.sql)</h3>
              </div>
              <button
                onClick={copyCode}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition-colors"
              >
                {copied ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Copied!" : "Copy SQL"}
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-cyan-300 max-h-96 overflow-y-auto leading-relaxed">
              <pre>{schemaSnippet}</pre>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Includes Users, Positions, Orders, and AI Predictions tables with foreign key cascades.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
