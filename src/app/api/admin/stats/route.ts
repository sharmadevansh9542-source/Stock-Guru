import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  try {
    // 1. Total users & admins count
    const usersCountRes = await query("SELECT COUNT(*) AS total FROM users");
    const totalUsers = parseInt(usersCountRes.rows[0]?.total || "0");

    const adminsCountRes = await query("SELECT COUNT(*) AS total FROM users WHERE role = 'admin'");
    const totalAdmins = parseInt(adminsCountRes.rows[0]?.total || "0");

    // 2. Total capital
    const capitalRes = await query("SELECT SUM(virtual_balance) AS total FROM users");
    const totalCapital = parseFloat(capitalRes.rows[0]?.total || "0");

    // 3. Total orders & positions
    let totalOrders = 0;
    try {
      const ordersRes = await query("SELECT COUNT(*) AS total FROM orders");
      totalOrders = parseInt(ordersRes.rows[0]?.total || "0");
    } catch {}

    let totalPositions = 0;
    try {
      const posRes = await query("SELECT COUNT(*) AS total FROM positions");
      totalPositions = parseInt(posRes.rows[0]?.total || "0");
    } catch {}

    return NextResponse.json({
      status: "success",
      stats: {
        totalUsers,
        totalAdmins,
        totalCapital,
        totalOrders,
        totalPositions,
        database: {
          engine: "PostgreSQL 14+ / pgAdmin 4",
          database: "Stock-Guru",
          port: 5433,
          connected: true,
        },
        services: {
          yahooFinance: "Online (NSE/BSE)",
          groqAi: "Online (Llama-3.3-70b)",
          nodemailer: "Configured (Gmail SMTP)",
        },
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to fetch admin stats" },
      { status: 500 }
    );
  }
}
