import { prisma } from "../../../generated/prisma-client";

export default {
  Mutation: {
    createUser: async (_, args) => {
      const { username, email, password } = args;
      const user = await prisma.createUser({
        username,
        email,
        password
      });
      return user;
    }
  }
};
