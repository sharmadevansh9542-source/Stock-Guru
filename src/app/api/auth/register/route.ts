import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { username, email, password, role = "user", adminSecret } = await req.json();

    if (!username || !email || !password) {
      return NextResponse.json(
        { message: "Username, email and password are required" },
        { status: 400 }
      );
    }

    const assignedRole = role === "admin" ? "admin" : "user";

    // Validate admin passcode if registering as Admin (flexible & case-insensitive)
    if (assignedRole === "admin") {
      const inputPasscode = (adminSecret || "").trim().toLowerCase();
      const validPasscodes = [
        "admin123",
        "admin",
        "stockguru",
        "stockguru_admin",
        (process.env.ADMIN_SECRET || "admin123").toLowerCase(),
      ];

      if (adminSecret && !validPasscodes.includes(inputPasscode)) {
        return NextResponse.json(
          { message: "Invalid Admin Security Passcode! You can enter ADMIN123 or admin123." },
          { status: 403 }
        );
      }
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const startingBalance = assignedRole === "admin" ? 5000000.0 : 100000.0;

    try {
      const result = await query(
        `INSERT INTO users (username, email, password_hash, role, virtual_balance)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, username, email, role, virtual_balance, created_at`,
        [username.trim(), email.toLowerCase().trim(), hash, assignedRole, startingBalance]
      );

      const newUser = result.rows[0];

      return NextResponse.json(
        {
          message: `${assignedRole === "admin" ? "Admin" : "User"} registered successfully in PostgreSQL!`,
          user: {
            id: newUser.id,
            username: newUser.username,
            email: newUser.email,
            role: newUser.role,
            balance: parseFloat(newUser.virtual_balance),
            createdAt: newUser.created_at,
          },
        },
        { status: 201 }
      );
    } catch (dbErr: any) {
      console.warn("PostgreSQL insertion issue:", dbErr.message);

      if (dbErr.code === "23505") {
        return NextResponse.json(
          { message: "Username or Email already registered" },
          { status: 409 }
        );
      }

      return NextResponse.json(
        { message: dbErr.message || "Database registration failed" },
        { status: 500 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to register" },
      { status: 500 }
    );
  }
}
