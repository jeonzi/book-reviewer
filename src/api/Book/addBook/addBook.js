import { prisma } from "../../../generated/prisma-client";
const axios = require("axios");

export default {
  Mutation: {
    addBook: async (_, args, { request }) => {
      if (!request.isAuth) {
        throw new Error("You need to Login");
      }
      try {
        const { bookName } = args;
        const user = await prisma.user({ email: request.email });
        // console.log("데이터 불러오기");
        const url = `${process.env.API_URL}${encodeURIComponent(bookName)}`;
        const result = await axios.get(url, {
          headers: {
            "X-Naver-Client-Id": process.env.NAVER_CLIENT_ID,
            "X-Naver-Client-Secret": process.env.NAVER_CLIENT_SECRET
          }
        });
        // console.log(result.data.items);
        const books = result.data.items.map(book => {
          return {
            book_name: book.title.replace(/<b>|<\/b>|\n/g, ""),
            naver_bid: book.link.split("=")[1],
            image: book.image,
            author: book.author,
            publisher: book.publisher,
            pubdate: [
              book.pubdate.slice(0, 4),
              book.pubdate.slice(4, 6),
              book.pubdate.slice(6, 8)
            ].join("-"),
            description: book.description.replace(/<b>|<\/b>|\n/g, ""),
            isbn: book.isbn.split(" ")[1]
          };
        });

        const selectedBook = books.find(function(book) {
          return book.naver_bid === "6259480";
        });

        // console.log(books);
        // console.log(selectedBook);
        // console.log(typeof selectedBook);
        // console.log(selectedBook.naver_bid);

        const ExistBook = await prisma.books({
          where: { naver_bid: selectedBook.naver_bid }
        });
        if (ExistBook.length === 0) {
          const book = await prisma.createBook({
            book_name: selectedBook.book_name,
            author: { create: { author_name: selectedBook.author } },
            publisher: selectedBook.publisher,
            pubdate: selectedBook.pubdate,
            isbn: selectedBook.isbn,
            naver_bid: selectedBook.naver_bid,
            description: selectedBook.description,
            image: selectedBook.image,
            users: { connect: { id: user.id } }
          });

          await prisma.updateUser({
            where: { id: user.id },
            data: {
              books: {
                connect: { id: book.id }
              }
            }
          });
        } else {
          console.log(ExistBook[0].id);
          try {
            await prisma.updateBook({
              where: { id: ExistBook[0].id },
              data: {
                users: {
                  connect: { id: user.id }
                }
              }
            });
          } catch (error) {
            console.log(error);
          }

          console.log("책 업뎃했고 유저 업데이트 가즈아!!!!!");
          await prisma.updateUser({
            where: { id: user.id },
            data: {
              books: {
                connect: { id: ExistBook[0].id }
              }
            }
          });
        }
        return `${bookName}이/가 등록되었습니다 :D`;
      } catch (error) {
        throw new Error(error);
      }
    }
  }
};
