import { AuthUser } from "@supabase/supabase-js";
import { prisma } from "../app";
import { ForbiddenError, NotFoundError } from "../errors";

export const getCategories = async (userId: string) => {
  const categories = await prisma.category.findMany({
    where: {
      userId,
    },
  });

  return categories;
};

export const createCategory = async (userId: string, name: string) => {
  const category = prisma.category.create({
    data: {
      name,
      User: {
        connect: {
          id: userId,
        },
      },
    },
  });
  return category;
};
