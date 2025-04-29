import { z } from "zod";

export const CreateCategorySchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: "name is required." })
      .min(1, "name cannot be empty."),
  }),
});
