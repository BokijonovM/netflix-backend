import express from "express";
import { getMovies, writeMovies } from "../../lib/fs-movies.js";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { newPostValidation } from "./validator.js";
import uniqid from "uniqid";

const movieRouter = express.Router();

movieRouter.get("/", async (req, res, next) => {
  try {
    const moviesArray = await getMovies();
    res.send(moviesArray);
  } catch (error) {
    next(error);
  }
});

movieRouter.get("/:id", async (req, res, next) => {
  try {
    const moviesArray = await getMovies();
    const singleMovie = moviesArray.find(
      singleMovie => singleMovie.imdbID === req.params.id
    );
    if (!singleMovie) {
      res.send({ message: `Movie with id ${req.params.id} is not found!` });
    }
    res.send(singleMovie);
  } catch (error) {
    next(error);
  }
});

movieRouter.post("/", newPostValidation, async (req, res, next) => {
  try {
    const movie = {
      imdbID: uniqid(),
      ...req.body,
      createdAt: new Date(),
    };
    const moviesArray = await getMovies();
    moviesArray.push(movie);
    await writeMovies(moviesArray);
    res.send(movie);
  } catch (error) {
    next(error);
  }
});

export default movieRouter;
