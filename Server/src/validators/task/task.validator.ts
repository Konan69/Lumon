import { z } from "zod";

export const CreateTaskSchema = z.object({
  body: z.object({
    title: z
      .string({ required_error: "title is required." })
      .min(1, "title cannot be empty."),
    status: z
      .string({ required_error: "status is required." })
      .min(1, "status cannot be empty."),
  }),
});

export const UpdateTaskSchema = z.object({
  params: z.object({
    taskId: z
      .string({ required_error: "taskId is required." })
      .uuid("taskId must be a valid UUID."),
  }),
  body: z
    .object({
      title: z.string().optional(),
      status: z.string().optional(),
    })
    .refine((data) => data.title || data.status, {
      message: "At least one of title or status must be provided",
    }),
});

export const DeleteTaskSchema = z.object({
  params: z.object({
    taskId: z
      .string({ required_error: "taskId is required." })
      .uuid("taskId must be a valid UUID."),
  }),
});
