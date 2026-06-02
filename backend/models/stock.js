const mongoose = require("mongoose");

const stockSchema = new mongoose.Schema({
    symbol: { type: String, required: true, unique: true, uppercase: true },
    companyName: { type: String, required: true },
    currentPrice: { type: Number, required: true },
    changePercent: { type: Number, default: 0 },
    sector: { type: String, default: "General" },
    history: [{ price: Number, timestamp: { type: Date, default: Date.now } }]
}, { timestamps: true });

module.exports = mongoose.model("Stock", stockSchema);
