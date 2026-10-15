import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const res = await query(`
      SELECT 
        u.id, 
        u.username, 
        u.email, 
        u.virtual_balance, 
        u.created_at,
        COUNT(o.id) AS total_orders
      FROM users u
      LEFT JOIN orders o ON u.id = o.user_id
      GROUP BY u.id
      ORDER BY u.id DESC
      LIMIT 20;
    `);

    return NextResponse.json({
      status: "connected",
      database: "PostgreSQL (pgAdmin compatible)",
      users: res.rows,
    });
  } catch (error: any) {
    return NextResponse.json({
      status: "database_standby",
      message: "PostgreSQL pgAdmin database instance not yet initialized or offline.",
      detail: error.message,
      setupInstruction: "Run database_schema.sql in pgAdmin 4 Query Tool.",
    });
  }
}
