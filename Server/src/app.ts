import express from "express";
import cors from "cors";
import { appRouter } from "./routes";
import { errorHandlerMiddleware, routeMiddleware } from "./middlewares";
import { PrismaClient } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";
import { Env } from "./env";
import { Logger } from "./utils";

const { port, supabaseURL, supabaseKey } = Env;
const app = express();

export const prisma = new PrismaClient();

export const supabase = createClient(supabaseURL, supabaseKey);

app.use(cors());
app.use(express.json());
app.use(routeMiddleware);
app.use("/health", (_req, res) => {
  res.json({ msg: "Hello World" });
});
app.use("/api/v1", appRouter);
app.use(errorHandlerMiddleware);

app.listen(port, () => {
  Logger.info(`Server is listening on ${port}.`);
});
