import { prisma } from "../../../generated/prisma-client";

export default {
  Mutation: {
    addPhrase: async (_, args, { request }) => {
      const { text, page, bookId } = args;
      if (!request.isAuth) {
        throw new Error("You need to Login");
      }
      const user = await prisma.user({ email: request.email });
      const phrase = await prisma.createPhrase({
        text,
        user: { connect: { id: user.id } },
        page
      });
      await prisma.updateBook({
        where: { id: bookId },
        data: {
          phrases: { connect: { id: phrase.id } }
        }
      });
      return `${text} 구절이 등록되었습니다.`;
    }
  }
};
