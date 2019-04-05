// import "./env";
import { prisma } from "../../../generated/prisma-client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export default {
  Mutation: {
    createUser: async (_, args) => {
      const { username, email, password } = args;
      const hashedPassword = await bcrypt.hash(password, 12);
      const user = await prisma.createUser({
        username,
        email,
        password: hashedPassword
      });
      return user;
    },
    loginUser: async (_, args) => {
      const { email, password } = args;
      const user = await prisma.user({ email });
      if (!user) {
        throw new Error("User does not exist 😫");
      }
      const isEqual = await bcrypt.compare(password, user.password);
      if (!isEqual) {
        throw new Error("Password is not correct!!");
      }
      const token = jwt.sign(
        { email: user.email, password: user.password },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      console.log(token);
      return { email: user.email, token: token, tokenExpiration: 1 };
    }
  }
};
