import { prisma } from "../app";
import { NotFoundError } from "../errors";
import { AuthUser } from "@supabase/supabase-js";

export const createTask = async (
  user: AuthUser,
  title: string,
  status: string
) => {
  const task = prisma.task.create({
    data: {
      title,
      status,
      user: {
        connect: {
          id: user.id,
        },
      },
    },
    include: {
      user: true,
    },
  });
  return task;
};

export const getTasks = async (user: AuthUser) => {
  const tasks = await prisma.task.findMany({
    where: { user: { id: user.id } },
  });
  return tasks;
};

export const updateTask = async (
  taskId: string,
  title?: string,
  status?: string
) => {
  // Build update object with only provided fields
  const updateFields = {};
  if (title) {
    updateFields["title"] = title;
  }
  if (status) {
    updateFields["status"] = status;
  }

  const updateResult = await prisma.task.updateMany({
    where: { id: taskId },
    data: updateFields,
  });

  // Return true if a task was updated
  return updateResult.count > 0;
};

export const deleteTask = async (taskId: string) => {
  const result = await prisma.task.deleteMany({
    where: { id: taskId },
  });
  // Return true if a task was deleted
  return result.count > 0;
};
