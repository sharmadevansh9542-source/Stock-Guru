import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// In-memory OTP storage
const otpStore: Record<string, { otp: string; expires: number }> = {};

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: "Email required" }, { status: 400 });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[email.toLowerCase()] = {
      otp,
      expires: Date.now() + 5 * 60 * 1000, // 5 minutes
    };

    const userEmail = process.env.EMAIL_USER;
    const userPass = process.env.EMAIL_PASS;

    if (userEmail && userPass) {
      try {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: userEmail,
            pass: userPass,
          },
        });

        await transporter.sendMail({
          from: `"StockGuru Security" <${userEmail}>`,
          to: email,
          subject: "StockGuru - Password Reset OTP",
          text: `Aapka password reset OTP hai: ${otp}. Yeh 5 minute me expire ho jayega.`,
        });
      } catch (mailErr) {
        console.warn("Mail sending fallback (simulated OTP):", mailErr);
      }
    }

    return NextResponse.json({
      message: "OTP sent successfully to your registered email.",
      // For development ease if email is not configured:
      devOtp: process.env.NODE_ENV === "development" ? otp : undefined,
    });
  } catch (err: any) {
    return NextResponse.json({ message: "Failed to send OTP" }, { status: 500 });
  }
}
