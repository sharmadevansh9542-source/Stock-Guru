import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "stockguru_super_secret_jwt_key_2026_secure";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Token missing" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch {
      return NextResponse.json({ message: "Invalid or expired token" }, { status: 401 });
    }

    try {
      const result = await query(
        "SELECT id, username, email, role, virtual_balance, created_at FROM users WHERE id = $1",
        [decoded.userId]
      );

      if (result.rows.length === 0) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
      }

      const user = result.rows[0];
      return NextResponse.json({
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role || "user",
          balance: parseFloat(user.virtual_balance || 100000),
          createdAt: user.created_at,
        },
      });
    } catch (dbErr: any) {
      // In-memory fallback
      return NextResponse.json({
        user: {
          id: decoded.userId || "demo-user",
          username: decoded.username || "Trader",
          email: decoded.email || "trader@stockguru.com",
          balance: 1000000,
        },
      });
    }
  } catch (error: any) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
