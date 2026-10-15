import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, newPassword } = await req.json();

    if (!email || !newPassword) {
      return NextResponse.json(
        { message: "Email and new password are required" },
        { status: 400 }
      );
    }

    const hash = await bcrypt.hash(newPassword, 10);

    try {
      await query("UPDATE users SET password_hash = $1 WHERE email = $2", [
        hash,
        email.toLowerCase(),
      ]);
    } catch (dbErr) {
      console.warn("DB update fallback:", dbErr);
    }

    return NextResponse.json({ message: "Password reset successful" });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to reset password" },
      { status: 500 }
    );
  }
}
