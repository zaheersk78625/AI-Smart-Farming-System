export interface SensorData {
  id: number;
  sensor_type: string;
  value: number;
  unit: string;
  timestamp: string;
}

export interface Crop {
  id: number;
  name: string;
  optimal_temp_low: number;
  optimal_temp_high: number;
  optimal_humidity_low: number;
  optimal_humidity_high: number;
  optimal_ph_low: number;
  optimal_ph_high: number;
  recommended_fertilizers: string;
}

export interface PredictionResult {
  recommended_crop: string;
  confidence: number;
  reasoning: string;
  fertilizers: string[];
}
