"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  ShieldAlert,
  Users,
  DollarSign,
  Database,
  Activity,
  UserPlus,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertTriangle,
  Trash2,
  ArrowUpRight,
  TrendingUp,
  Sparkles,
  Lock,
  ChevronRight,
  ShieldCheck,
  Zap,
  Globe2,
} from "lucide-react";

interface AdminUser {
  id: number;
  username: string;
  email: string;
  role: "user" | "admin";
  balance: number;
  createdAt: string;
}

interface AdminStats {
  totalUsers: number;
  totalAdmins: number;
  totalCapital: number;
  totalOrders: number;
  totalPositions: number;
  database: {
    engine: string;
    database: string;
    port: number;
    connected: boolean;
  };
  services: {
    yahooFinance: string;
    groqAi: string;
    nodemailer: string;
  };
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"All" | "admin" | "user">("All");
  const [actionMessage, setActionMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Fetch stats and users
  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch("/api/admin/users"),
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData.stats);
      }

      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData.users || []);
      }
    } catch (err) {
      console.error("Failed to load admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Modify user role (Promote/Demote)
  const handleToggleRole = async (userId: number, currentRole: "admin" | "user") => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: newRole }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update role");

      setActionMessage({ text: `User role changed to ${newRole}!`, type: "success" });
      fetchData();
    } catch (err: any) {
      setActionMessage({ text: err.message, type: "error" });
    }
  };

  // Add ₹50,000 balance to user
  const handleAddBalance = async (userId: number) => {
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, addBalance: 50000 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to add funds");

      setActionMessage({ text: "Added ₹50,000 virtual balance to user!", type: "success" });
      fetchData();
    } catch (err: any) {
      setActionMessage({ text: err.message, type: "error" });
    }
  };

  // Delete user
  const handleDeleteUser = async (userId: number, email: string) => {
    if (!confirm(`Are you sure you want to delete user ${email}?`)) return;

    try {
      const res = await fetch(`/api/admin/users?id=${userId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete user");

      setActionMessage({ text: "User successfully removed from PostgreSQL!", type: "success" });
      fetchData();
    } catch (err: any) {
      setActionMessage({ text: err.message, type: "error" });
    }
  };

  // Filtered users list
  const filteredUsers = users.filter((u) => {
    const q = search.toLowerCase();
    const matchesSearch =
      u.username.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    const matchesRole = roleFilter === "All" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-200 py-8 px-4 sm:px-6 lg:px-8 selection:bg-amber-500 selection:text-slate-950 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Admin Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-amber-950/20 border border-amber-500/30 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20 shrink-0 font-black">
              <ShieldAlert className="w-8 h-8 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Admin Console Active
                </span>
                <span className="text-xs text-slate-400">PostgreSQL 14+ (Port 5433)</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                StockGuru Master Administrator Dashboard
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchData}
              disabled={loading}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition flex items-center gap-2 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
            <Link
              href="/"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-cyan-500/20"
            >
              Trader View
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Global Action Notification Banner */}
        {actionMessage && (
          <div
            className={`p-4 rounded-2xl flex items-center justify-between text-xs sm:text-sm font-semibold border ${
              actionMessage.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                : "bg-rose-500/10 border-rose-500/30 text-rose-400"
            }`}
          >
            <div className="flex items-center gap-2">
              {actionMessage.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 shrink-0" />
              )}
              <span>{actionMessage.text}</span>
            </div>
            <button
              onClick={() => setActionMessage(null)}
              className="text-xs underline hover:text-white ml-4"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* 4 Core Platform Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Total Registered Users */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-md flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Total Users in DB
              </span>
              <div className="text-3xl font-black text-white">
                {stats ? stats.totalUsers : users.length}
              </div>
              <span className="text-[11px] text-cyan-400 mt-1 block">
                {stats?.totalAdmins || 1} Admins · {(stats?.totalUsers || users.length) - (stats?.totalAdmins || 1)} Traders
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </div>

          {/* Platform Total Capital */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-md flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Virtual Liquidity Pool
              </span>
              <div className="text-3xl font-black text-emerald-400">
                ₹{((stats?.totalCapital || 5100000) / 100000).toFixed(1)}L
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Aggregated User Balances
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>

          {/* Database Health */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-md flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                PostgreSQL Engine
              </span>
              <div className="text-xl font-bold text-white flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Stock-Guru : 5433
              </div>
              <span className="text-[11px] text-emerald-400 mt-1 block">
                pgAdmin 4 Connected
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center">
              <Database className="w-6 h-6" />
            </div>
          </div>

          {/* AI & Stream Engines */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-md flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                AI / Market Services
              </span>
              <div className="text-xl font-bold text-amber-400">
                Llama 3.3 70B
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                NSE/BSE Yahoo Live API
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
              <Activity className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* User Management Section */}
        <section className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl backdrop-blur-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
                <Users className="w-6 h-6 text-cyan-400" />
                User & Role Management
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Inspect all accounts registered in your PostgreSQL database, promote admins, grant funds, or manage accounts.
              </p>
            </div>

            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-bold border border-cyan-500/30 transition self-start sm:self-auto"
            >
              <UserPlus className="w-4 h-4" />
              Register New User / Admin
            </Link>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by username or email..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              {(["All", "admin", "user"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setRoleFilter(r)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                    roleFilter === r
                      ? "bg-amber-500 text-slate-950 font-bold"
                      : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
                  }`}
                >
                  {r === "All" ? "All Accounts" : r === "admin" ? "Admins Only" : "Traders Only"}
                </button>
              ))}
            </div>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-800/80">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/80 text-slate-400 text-xs font-bold uppercase tracking-wider border-b border-slate-800">
                  <th className="py-3.5 px-4">ID</th>
                  <th className="py-3.5 px-4">User</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4">Virtual Balance</th>
                  <th className="py-3.5 px-4">Registered</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs sm:text-sm">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4 font-mono text-slate-400">#{u.id}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white">{u.username}</div>
                      <div className="text-xs text-slate-400 font-mono">{u.email}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      {u.role === "admin" ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold">
                          <ShieldAlert className="w-3 h-3" />
                          Admin
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-semibold">
                          Trader
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                      ₹{u.balance.toLocaleString("en-IN")}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 text-xs">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "Active"}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Role Toggle */}
                        <button
                          onClick={() => handleToggleRole(u.id, u.role)}
                          title={u.role === "admin" ? "Demote to Trader" : "Promote to Admin"}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition border ${
                            u.role === "admin"
                              ? "bg-slate-800 text-slate-300 hover:bg-slate-700 border-slate-700"
                              : "bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 border-amber-500/30"
                          }`}
                        >
                          {u.role === "admin" ? "Demote" : "Make Admin"}
                        </button>

                        {/* Grant Balance */}
                        <button
                          onClick={() => handleAddBalance(u.id)}
                          title="Add ₹50,000 Virtual Funds"
                          className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold transition"
                        >
                          +₹50k
                        </button>

                        {/* Delete User */}
                        {u.email !== "admin@stockguru.com" && (
                          <button
                            onClick={() => handleDeleteUser(u.id, u.email)}
                            title="Delete User"
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-8 text-slate-500 text-xs">
              No users found matching &quot;{search}&quot;.
            </div>
          )}
        </section>

        {/* Platform Quick Health & Architecture */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Database className="w-4 h-4 text-cyan-400" />
              PostgreSQL Data Schema
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Active tables: <code className="text-cyan-400 font-mono">users</code>, <code className="text-cyan-400 font-mono">positions</code>, <code className="text-cyan-400 font-mono">orders</code>, <code className="text-cyan-400 font-mono">predictions</code> on database <code className="text-emerald-400 font-mono">Stock-Guru</code>.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Globe2 className="w-4 h-4 text-emerald-400" />
              Market Feed Pipeline
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Real-time NSE/BSE ticker feed with 17 historical CSV fallback datasets in prediction engine.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              RBAC Authentication
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Bcrypt 10-round salted password hashing with JWT 7-day signed session token and role checks.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
