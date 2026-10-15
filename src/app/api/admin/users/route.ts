import { NextResponse } from "next/server";
import { query } from "@/lib/db";

// GET: Fetch all users
export async function GET() {
  try {
    const result = await query(
      "SELECT id, username, email, role, virtual_balance, created_at FROM users ORDER BY id ASC"
    );

    const users = result.rows.map((u) => ({
      id: u.id,
      username: u.username,
      email: u.email,
      role: u.role || "user",
      balance: parseFloat(u.virtual_balance || 0),
      createdAt: u.created_at,
    }));

    return NextResponse.json({ users });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to fetch users" },
      { status: 500 }
    );
  }
}

// PATCH: Update role or balance
export async function PATCH(req: Request) {
  try {
    const { userId, role, addBalance } = await req.json();

    if (!userId) {
      return NextResponse.json({ message: "userId required" }, { status: 400 });
    }

    if (role && (role === "admin" || role === "user")) {
      await query("UPDATE users SET role = $1 WHERE id = $2", [role, userId]);
    }

    if (addBalance && typeof addBalance === "number") {
      await query("UPDATE users SET virtual_balance = virtual_balance + $1 WHERE id = $2", [
        addBalance,
        userId,
      ]);
    }

    const updated = await query(
      "SELECT id, username, email, role, virtual_balance FROM users WHERE id = $1",
      [userId]
    );

    return NextResponse.json({
      message: "User updated successfully",
      user: updated.rows[0],
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to update user" },
      { status: 500 }
    );
  }
}

// DELETE: Delete user
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("id");

    if (!userId) {
      return NextResponse.json({ message: "User ID required" }, { status: 400 });
    }

    // Check if target is primary admin
    const checkRes = await query("SELECT email, role FROM users WHERE id = $1", [userId]);
    if (checkRes.rows.length === 0) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (checkRes.rows[0].email === "admin@stockguru.com") {
      return NextResponse.json(
        { message: "Cannot delete master administrator account!" },
        { status: 403 }
      );
    }

    await query("DELETE FROM users WHERE id = $1", [userId]);

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to delete user" },
      { status: 500 }
    );
  }
}
