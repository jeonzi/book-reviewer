import { prisma } from "../../generated/prisma-client";

export default {
  Mutation: {
    addComment: async (_, args, { request }) => {
      const { text, bookId } = args;
      if (!request.isAuth) {
        throw new Error("You need to Login");
      }
      const user = await prisma.user({ email: request.email });
      const comment = await prisma.createComment({
        text,
        book: { connect: { id: bookId } }
      });
      await prisma.updateUser({
        where: { id: user.id },
        data: {
          comments: { connect: { id: comment.id } }
        }
      });
      return `댓글이 등록되었습니다 :)`;
    }
  }
};
