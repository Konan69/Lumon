import { prisma } from "../app";
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
