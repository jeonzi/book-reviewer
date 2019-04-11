// graphQL 서버 OPEN
import { GraphQLServer } from "graphql-yoga";
import "./env";
import schema from "./schema";
import logger from "morgan";
import isAuth from "./is-auth";

const PORT = process.env.PORT || 4000;

const server = new GraphQLServer({
  schema,
  context: ({ request }) => ({ request })
});

server.express.use(logger("dev"));
server.express.use(isAuth);

server.start({ port: PORT }, () =>
  console.log(`Server is Running on http://localhost:${PORT}`)
);
