import { NextResponse } from "next/server";
import Groq from "groq-sdk";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GROQ_API_KEY;

    if (apiKey) {
      try {
        const groq = new Groq({ apiKey });

        const completion = await groq.chat.completions.create({
          model: "llama-3.1-8b-instant",
          messages: [
            {
              role: "system",
              content:
                "Aap StockGuru ke expert AI financial & stock trading assistant hain. Aap Hindi aur English (Hinglish) me user ke stock market, NSE/BSE stocks, technical indicators, trading strategies, aur portfolio queries ka accurate, crisp aur helpful jawab dete hain.",
            },
            {
              role: "user",
              content: message,
            },
          ],
          temperature: 0.7,
          max_tokens: 1024,
        });

        const reply = completion.choices[0]?.message?.content;
        if (reply) {
          return NextResponse.json({ reply });
        }
      } catch (groqErr: any) {
        console.warn("Groq API call warning:", groqErr?.message || groqErr);
      }
    }

    // Smart financial assistant fallback
    const lower = message.toLowerCase();
    let reply = "StockGuru AI: Stock market me success ke liye risk management aur technical analysis (RSI, Support & Resistance) sabse important hote hain. Aap kisi specific stock (e.g. RELIANCE, TCS) ya concept ke baare me pooch sakte hain!";

    if (lower.includes("reliance")) {
      reply = "Reliance Industries (RELIANCE): Current technical outlook bullish hai around ₹2,980 levels with key resistance at ₹3,110 and support at ₹2,920. Dips par accumulate karna favorable strategy ho sakti hai.";
    } else if (lower.includes("rsi") || lower.includes("indicator")) {
      reply = "RSI (Relative Strength Index) momentum measure karta hai: Above 70 = Overbought (cooling off expected), Below 30 = Oversold (potential reversal opportunity).";
    } else if (lower.includes("tcs") || lower.includes("it")) {
      reply = "TCS & IT Sector: Major support levels around ₹4,150. Long-term digital transformation aur cloud demand IT bluechips ko strong support de rahe hain.";
    } else if (lower.includes("hello") || lower.includes("hi") || lower.includes("namaste")) {
      reply = "Namaste! Main StockGuru AI assistant hoon. Main Indian share market, stock analysis, candle charts aur trading strategies me aapki help kar sakta hoon. Kahiye kya janna chahte hain?";
    }

    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error("Chatbot API Error:", error);
    return NextResponse.json(
      {
        reply: "StockGuru AI: Main abhi aapki query process nahi kar pa raha. Kripya dobara try karein.",
      },
      { status: 200 }
    );
  }
}
