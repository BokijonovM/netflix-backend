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
