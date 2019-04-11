import { prisma } from "../../../generated/prisma-client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export default {
  Mutation: {
    createUser: async (_, args) => {
      try {
        const { username, email, password } = args;
        const userExists = await prisma.$exists.user({ email: args.email });
        if (userExists) {
          throw new Error("Already exists. Please Cheack your email address");
        }
        const hashedPassword = await bcrypt.hash(
          password,
          process.env.HASH_NUMBER
        );
        const user = await prisma.createUser({
          username,
          email,
          password: hashedPassword
        });
        return user;
      } catch (error) {
        throw error;
      }
    },
    loginUser: async (_, args) => {
      const { email, password } = args;
      const user = await prisma.user({ email });
      if (!user) {
        throw new Error("User does not exist 😫");
      }
      const isEqual = await bcrypt.compare(password, user.password);
      if (!isEqual) {
        throw new Error("Please check your password 🙏");
      }
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        {
          expiresIn: "12h"
        }
      );
      console.log(token);
      return token;
    }
  }
};
