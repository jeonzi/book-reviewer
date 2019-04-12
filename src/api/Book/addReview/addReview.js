import { prisma } from "../../../generated/prisma-client";

export default {
  Mutation: {
    addReview: async (_, args, { request }) => {
      const { text, bookId } = args;
      if (!request.isAuth) {
        throw new Error("You need to Login");
      }
      const user = await prisma.user({ email: request.email });
      const review = await prisma.createReview({
        text,
        user: { connect: { id: user.id } }
      });
      console.log(review);
      await prisma.updateBook({
        where: { id: bookId },
        data: {
          review: { connect: { id: review.id } }
        }
      });
      return true;
    }
  }
};
