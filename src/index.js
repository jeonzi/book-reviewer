// graphQL 서버 OPEN
import { GraphQLServer } from "graphql-yoga";
import "./env";

import schema from "./schema";
import logger from "morgan";

const PORT = process.env.PORT || 4000;

const server = new GraphQLServer({
  schema
});

server.express.use(logger("dev"));

server.start({ port: PORT }, () =>
  console.log(`Server is Running on http://localhost:${PORT}`)
);
