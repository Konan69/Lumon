import { prisma } from "../app";
import type { User } from "@prisma/client";
import { ForbiddenError, NotFoundError } from "../errors";

export const getProfile = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!user) throw new NotFoundError("User not found");

  return user;
};
