import { PredictionResult } from "../types";

export async function predictCrop(data: {
  temperature: number;
  humidity: number;
  ph: number;
  rainfall: number;
  soil_type: string;
}): Promise<PredictionResult> {
  const response = await fetch("/api/ai/predict", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Local AI prediction failed");
  }

  return response.json();
}

export async function detectPlantDisease(base64Image: string) {
  // We can keep this on the client if we want, but it's better to move to backend too.
  // For now, I'll recommend calling a backend proxy for consistency and security.
  const response = await fetch("/api/ai/disease", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image: base64Image }),
  });

  if (!response.ok) {
    // Fallback or error
    return "Plant disease detection failed. Please try again.";
  }

  const data = await response.json();
  return data.text;
}

export async function getFarmerAssistantResponse(message: string, chatHistory: any[]) {
  const response = await fetch("/api/ai/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, history: chatHistory }),
  });

  if (!response.ok) {
    throw new Error("Assistant response failed");
  }

  const data = await response.json();
  return data.text;
}
