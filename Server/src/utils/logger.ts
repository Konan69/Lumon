import pino from "pino";
import { Env } from "../env";

const pinoConfig = {
  level: Env.logLevel || "info",
  ...(Env.nodeEnv !== "production" && {
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: "SYS:yyyy-mm-dd HH:MM:ss",
        ignore: "pid,hostname",
      },
    },
  }),
};

export const Logger = pino(pinoConfig);
