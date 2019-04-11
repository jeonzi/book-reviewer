import { prisma } from "../../../generated/prisma-client";

export default {
  Mutation: {
    addBook: async (_, args, { request }) => {
      if (!request.isAuth) {
        throw new Error("You need to Login");
      }
      try {
        const { book_name, authorName, publisher } = args;
        const user = await prisma.user({ email: request.email });
        console.log(user);
        const ExistAuthor = await prisma.$exists.author({
          author_name: args.authorName
        });
        console.log(ExistAuthor);
        if (!ExistAuthor) {
          const book = await prisma.createBook({
            book_name,
            user: {
              connect: {
                id: user.id,
                username: user.username,
                email: user.email
              }
            },
            author: { create: { author_name: args.authorName } },
            publisher
          });
          console.log(book);
          return book.book_name;
        } else {
          const author = await prisma.authors({
            where: { author_name: authorName }
          });
          const book = await prisma.createBook({
            book_name,
            author: { connect: { id: author[0].id } },
            publisher,
            user: {
              connect: {
                id: user.id,
                username: user.username,
                email: user.email
              }
            }
          });
          console.log(book);
          return book.book_name;
        }
      } catch (error) {
        console.log(error);
        return false;
      }
    }
  }
};
