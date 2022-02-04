import express from "express";
import listEndpoints from "express-list-endpoints";
import { join } from "path";
import cors from "cors";
import movieRouter from "./services/movies/movie.js";
import {
  badRequestHandler,
  unauthorizedHandler,
  notFoundHandler,
  genericErrorHandler,
} from "./errorHandler.js";
import { setServers } from "dns";

const server = express();

const port = process.env.PORT || 3001;

const publicFolderPath = join(process.cwd(), "./public");

const loggerMiddleware = (req, res, next) => {
  console.log(
    `Request method: ${req.method} --- URL ${req.url} --- ${new Date()}`
  );
  next();
};

server.use(cors());
server.use(express.static(publicFolderPath));
server.use(express.json());
server.use(loggerMiddleware);

server.use("/movies", movieRouter);

server.use(badRequestHandler);
server.use(unauthorizedHandler);
server.use(notFoundHandler);
server.use(genericErrorHandler);

console.table(listEndpoints(server));

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
setServers.once("error", () => {
  console.log(error);
});
