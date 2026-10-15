import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    let dataDir = path.join(process.cwd(), "prediction-backend", "data");
    if (!fs.existsSync(dataDir)) {
      dataDir = path.join(process.cwd(), "src", "prediction-backend", "data");
    }
    if (!fs.existsSync(dataDir)) {
      return NextResponse.json({ files: [] });
    }

    const files = fs.readdirSync(dataDir).filter((f) => f.endsWith(".csv"));
    const results = [];

    for (const file of files) {
      const sym = file.replace(".csv", "");
      const fullPath = path.join(dataDir, file);
      try {
        const content = fs.readFileSync(fullPath, "utf-8");
        const lines = content.trim().split("\n");
        const rows = Math.max(0, lines.length - 1);
        const startDate = lines[1]?.split(",")[0] || "N/A";
        const endDate = lines[lines.length - 1]?.split(",")[0] || "N/A";

        results.push({
          symbol: sym,
          rows,
          start: startDate,
          end: endDate,
        });
      } catch (e: any) {
        results.push({ symbol: sym, error: e.message });
      }
    }

    return NextResponse.json({ files: results });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
