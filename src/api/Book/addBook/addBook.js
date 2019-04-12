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
        // const ExistAuthor = await prisma.$exists.author({
        //   author_name: args.authorName
        // });
        const ExistAuthor = await prisma.authors({
          where: { author_name: authorName }
        });
        console.log(ExistAuthor);
        if (ExistAuthor.length === 0) {
          const book = await prisma.createBook({
            book_name,
            author: { create: { author_name: args.authorName } },
            publisher
          });
          console.log(book);

          await prisma.updateUser({
            where: { id: user.id },
            data: {
              books: {
                connect: { id: book.id }
              }
            }
          });

          return book;
        } else {
          const book = await prisma.createBook({
            book_name,
            author: { connect: { id: ExistAuthor[0].id } },
            publisher
          });
          console.log(book);

          await prisma.updateUser({
            where: { id: user.id },
            data: {
              books: {
                connect: { id: book.id }
              }
            }
          });
          return book;
        }
      } catch (error) {
        console.log(error);
        return false;
      }
    }
  }
};
