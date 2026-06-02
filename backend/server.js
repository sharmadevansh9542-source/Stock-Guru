// ================= LOAD ENV =================
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

require("./config/db");
const User = require("./models/user");

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "secret";

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());

// ================= OTP STORAGE =================
const otpStore = {};
const mobileOtpStore = {};

// ================= MAIL TRANSPORTER =================
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Verify email server
transporter.verify((err) => {
    if (err) {
        console.log("Email server error:", err);
    } else {
        console.log("✅ Email server ready");
    }
});

// ================= AUTH MIDDLEWARE =================
function authenticateToken(req, res, next) {

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Token missing" });
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, JWT_SECRET, (err, decoded) => {

        if (err) {
            return res.status(401).json({ message: "Invalid token" });
        }

        req.user = decoded;
        next();

    });

}

// ================= HEALTH CHECK =================
app.get("/", (req, res) => {
    res.send("Backend running successfully");
});


// ================= REGISTER =================
app.post("/register", async(req, res) => {

    try {

        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields required" });
        }

        const existing = await User.findOne({
            $or: [{ username }, { email }]
        });

        if (existing) {
            return res.status(409).json({ message: "User already exists" });
        }

        const hash = await bcrypt.hash(password, 10);

        await User.create({
            username,
            email,
            password: hash
        });

        res.status(201).json({ message: "Registration successful" });

    } catch (err) {

        console.error(err);
        res.status(500).json({ message: "Server error" });

    }

});


// ================= LOGIN =================
app.post("/login", async(req, res) => {

    try {

        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: "All fields required" });
        }

        const user = await User.findOne({ username });

        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user._id, username: user.username },
            JWT_SECRET, { expiresIn: "7d" }
        );

        res.json({
            message: "Login successful",
            token
        });

    } catch (err) {

        console.error(err);
        res.status(500).json({ message: "Server error" });

    }

});


// ================= PROFILE =================
app.get("/profile", authenticateToken, async(req, res) => {

    try {

        const user = await User.findById(req.user.id).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ user });

    } catch (err) {

        console.error(err);
        res.status(500).json({ message: "Server error" });

    }

});


// ================= SEND EMAIL OTP =================
app.post("/send-otp", async(req, res) => {

    try {

        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email required" });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        console.log("User Email:", email);
        console.log("Generated OTP:", otp);

        otpStore[email] = {
            otp,
            expires: Date.now() + 5 * 60 * 1000
        };

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Password Reset OTP",
            text: `Your OTP for password reset is ${otp}. It will expire in 5 minutes.`
        });

        console.log("✅ OTP email sent");

        res.json({ message: "OTP sent successfully" });

    } catch (err) {

        console.error("SEND OTP ERROR:", err);
        res.status(500).json({ message: "Failed to send OTP" });

    }

});


// ================= RESET PASSWORD =================
app.post("/reset-password", async(req, res) => {

    try {

        const { email, otp, newPassword } = req.body;

        if (!email || !otp || !newPassword) {
            return res.status(400).json({ message: "All fields required" });
        }

        const stored = otpStore[email];

        if (!stored) {
            return res.status(400).json({ message: "OTP not found" });
        }

        if (Date.now() > stored.expires) {
            delete otpStore[email];
            return res.status(400).json({ message: "OTP expired" });
        }

        if (stored.otp !== otp) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        const hash = await bcrypt.hash(newPassword, 10);

        await User.findOneAndUpdate({ email }, { password: hash });

        delete otpStore[email];

        res.json({ message: "Password reset successful" });

    } catch (err) {

        console.error(err);
        res.status(500).json({ message: "Server error" });

    }

});


// ================= START SERVER =================
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});