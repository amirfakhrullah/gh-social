import { clerkClient } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";

export const getUsernameFromClerkOrThrow = async (userId: string) => {
  const user = await clerkClient.users.getUser(userId);

  if (!user?.username) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Username not found",
    });
  }
  return user.username;
};
