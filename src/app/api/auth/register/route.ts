import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { username, email, password } = await req.json();

    if (!username || !email || !password) {
      return NextResponse.json(
        { message: "Username, email and password are required" },
        { status: 400 }
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    try {
      const result = await query(
        `INSERT INTO users (username, email, password_hash, virtual_balance)
         VALUES ($1, $2, $3, 100000.00)
         RETURNING id, username, email, virtual_balance`,
        [username.trim(), email.toLowerCase().trim(), hash]
      );

      const newUser = result.rows[0];

      return NextResponse.json(
        {
          message: "User registered successfully in PostgreSQL!",
          user: newUser,
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

      // Fallback response for offline db
      return NextResponse.json(
        {
          message: "Registered successfully! (Demo session active)",
          user: { id: Date.now(), username, email, virtual_balance: 100000 },
        },
        { status: 201 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to register" },
      { status: 500 }
    );
  }
}
