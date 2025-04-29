import "dotenv/config";

export const Env = {
  port: Number(process.env.PORT) || 8000,
  supabaseURL: process.env.SUPABASE_URL,
  supabaseKey: process.env.SUPABASE_KEY,
  nodeEnv: process.env.NODE_ENV || "development",
  logLevel: process.env.LOG_LEVEL || "info",
};
