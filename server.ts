import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import fs from "fs";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// Initialize AI
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", environment: process.env.NODE_ENV });
});

// Crops (shifted from SQLite to static JSON)
app.get("/api/crops", (req, res) => {
  const cropsPath = path.join(__dirname, "src/data/crops.json");
  if (fs.existsSync(cropsPath)) {
    const crops = JSON.parse(fs.readFileSync(cropsPath, "utf-8"));
    res.json(crops);
  } else {
    res.status(404).json({ error: "Crops data not found" });
  }
});

// AI Proxies (to secure GEMINI_API_KEY)
app.post("/api/ai/predict", async (req, res) => {
  try {
    const data = req.body;
    const prompt = `As an agricultural expert, predict the best crop for these conditions:
    Temperature: ${data.temperature}°C
    Humidity: ${data.humidity}%
    Soil pH: ${data.ph}
    Rainfall: ${data.rainfall}mm
    Soil Type: ${data.soil_type}
    
    Return the prediction in JSON format following this schema:
    {
      "recommended_crop": "string",
      "confidence": number (0-1),
      "reasoning": "string",
      "fertilizers": ["string"]
    }`;

    const result = await genAI.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommended_crop: { type: Type.STRING },
            confidence: { type: Type.NUMBER },
            reasoning: { type: Type.STRING },
            fertilizers: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ["recommended_crop", "confidence", "reasoning", "fertilizers"]
        }
      }
    });

    res.json(JSON.parse(result.text || "{}"));
  } catch (error) {
    console.error("AI Prediction Error:", error);
    res.status(500).json({ error: "AI failed to generate prediction" });
  }
});

app.post("/api/ai/chat", async (req, res) => {
  try {
    const { message, history } = req.body;
    // Simple chat implementation for this SDK
    const result = await genAI.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: message, // Simplification for demo
    });

    res.json({ text: result.text });
  } catch (error) {
    console.error("AI Chat Error:", error);
    res.status(500).json({ error: "AI failed to respond" });
  }
});

app.post("/api/ai/disease", async (req, res) => {
  try {
    const { image } = req.body;
    const result = await genAI.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        { text: "Analyze this plant leaf image. Identify any visible diseases, suggest immediate treatments, and provide prevention tips. Return in a structured format." },
        { inlineData: { data: image, mimeType: "image/jpeg" } }
      ]
    });

    res.json({ text: result.text });
  } catch (error) {
    console.error("AI Disease Detection Error:", error);
    res.status(500).json({ error: "AI failed to analyze image" });
  }
});

// Weather Proxy
app.get("/api/weather", async (req, res) => {
  const { lat, lon } = req.query;
  const apiKey = process.env.OPENWEATHER_API_KEY;
  
  if (!apiKey || apiKey === "MY_OPENWEATHER_API_KEY") {
    return res.json({
      main: { temp: 28, humidity: 65, pressure: 1012 },
      weather: [{ main: 'Clear', description: 'clear sky (demo mode)' }],
      wind: { speed: 4.2 },
      name: 'Agricultural Zone'
    });
  }

  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch weather" });
  }
});

// Vite middleware for development
async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }
}

// Start listener only if running directly (not as a Vercel function)
if (process.env.NODE_ENV !== "test" && !process.env.VERCEL) {
  setupVite().then(() => {
    const PORT = 3000;
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  });
} else {
  // Production middleware for Vercel
  const distPath = path.join(process.cwd(), "dist");
  app.use(express.static(distPath));
}

export default app;
