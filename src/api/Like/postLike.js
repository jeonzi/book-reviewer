import { prisma } from "../../generated/prisma-client";

export default {
  Mutation: {
    postLike: async (_, args, { request }) => {
      if (!request.isAuth) {
        throw new Error("You need to Login");
      }
      const { bookId } = args;
      const user = await prisma.user({ email: request.email });
      console.log(user);
      const filterOpts = {
        AND: [
          {
            user: {
              id: user.id
            }
          },
          {
            book: {
              id: bookId
            }
          }
        ]
      };
      console.log(filterOpts);
      try {
        const exsitsLike = await prisma.$exists.like({
          AND: [
            {
              user: {
                id: user.id
              }
            },
            {
              book: {
                id: bookId
              }
            }
          ]
        });
        console.log(exsitsLike);
        if (exsitsLike) {
          await prisma.deleteManyLikes(filterOpts);
          return false;
        } else {
          await prisma.createLike({
            user: {
              connect: {
                id: user.id
              }
            },
            book: {
              connect: {
                id: bookId
              }
            }
          });
        }
        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    }
  }
};
