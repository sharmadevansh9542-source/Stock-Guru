import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "stockguru_super_secret_jwt_key_2026_secure";

export async function POST(req: Request) {
  try {
    const { email, password, expectedRole } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    try {
      // Query user in PostgreSQL
      const result = await query(
        "SELECT id, username, email, password_hash, role, virtual_balance FROM users WHERE email = $1",
        [email.toLowerCase().trim()]
      );

      if (result.rows.length === 0) {
        return NextResponse.json(
          { message: "User not found or invalid credentials" },
          { status: 401 }
        );
      }

      const user = result.rows[0];
      const valid = await bcrypt.compare(password, user.password_hash);

      if (!valid) {
        return NextResponse.json(
          { message: "Invalid email or password" },
          { status: 401 }
        );
      }

      const userRole = user.role || "user";

      // If user specifically attempted to login through the Admin Portal but is not an admin:
      if (expectedRole === "admin" && userRole !== "admin") {
        return NextResponse.json(
          { message: "Access Denied: This account does not have Administrator privileges." },
          { status: 403 }
        );
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email, username: user.username, role: userRole },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      const redirectUrl = userRole === "admin" ? "/admin" : "/";

      return NextResponse.json({
        message: userRole === "admin" ? "Admin login successful!" : "Login successful!",
        token,
        redirectTo: redirectUrl,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: userRole,
          balance: parseFloat(user.virtual_balance || 100000),
        },
      });
    } catch (dbErr: any) {
      console.warn("PostgreSQL login issue:", dbErr.message);

      return NextResponse.json(
        { message: "Database connection failed. Please ensure PostgreSQL is running." },
        { status: 500 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
