import express from "express";
import {
  getMovies,
  writeMovies,
  getReview,
  writeReview,
} from "../../lib/fs-movies.js";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { newPostValidation } from "./validator.js";
import uniqid from "uniqid";
import { createPDFReadableStream } from "./pdf-utils.js";
import { pipeline } from "stream";

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

movieRouter.put("/:id", async (req, res, next) => {
  try {
    const movieId = req.params.id;
    const movieArray = await getMovies();
    const index = movieArray.findIndex(movie => movie.imdbID === movieId);
    if (!index == -1) {
      res
        .status(404)
        .send({ message: `Movie with id ${movieId} is not found!` });
    }
    const previousMovie = movieArray[index];
    const changedMovie = {
      ...previousMovie,
      ...req.body,
      updatedAt: new Date(),
      imdbID: movieId,
    };
    movieArray[index] = changedMovie;
    await writeMovies(movieArray);

    res.send(changedMovie);
  } catch (error) {
    next(error);
  }
});

movieRouter.delete("/:id", async (req, res, next) => {
  try {
    const movieArray = await getMovies();

    const remaining = movieArray.filter(
      movie => movie.imdbID !== req.params.id
    );
    await writeMovies(remaining);

    res
      .status(201)
      .send(`Movie with id ${req.params.id} is successfully deleted!`);
  } catch (error) {
    next(error);
  }
});

// ********************* add reviews *********************
movieRouter.post("/:id/review", async (req, res, next) => {
  try {
    const newReview = {
      ...req.body,
      createdAt: new Date(),
      elementId: req.params.id,
      id: uniqid(),
    };
    const reviewArray = await getReview();

    reviewArray.push(newReview);
    await writeReview(reviewArray);
    res.send(newReview);
  } catch (error) {
    next(error);
  }
});

movieRouter.get("/:id/review", async (req, res, next) => {
  try {
    const reviewArray = await getReview();
    const filtered = reviewArray.filter(
      ({ elementId }) => elementId === req.params.id
    );
    res.send(filtered);
  } catch (error) {
    next(error);
  }
});

movieRouter.get("/:id/review/:rId", async (req, res, next) => {
  try {
    const reviewArray = await getReview();
    const singleReview = reviewArray.find(
      singleReview => singleReview.id === req.params.rId
    );
    if (!singleReview) {
      res
        .status(404)
        .send({ message: `Review with ${req.params / rId} is not found!` });
    }
    res.send(singleReview);
  } catch (error) {
    next(error);
  }
});

movieRouter.put("/:id/review/:rId", async (req, res, next) => {
  try {
    const reviewId = req.params.rId;
    const reviewArray = await getReview();

    const index = reviewArray.findIndex(review => review.id === reviewId);

    if (!index == -1) {
      res.status(404).send(`Review with ${reviewId} is not find!`);
    }
    const oldReview = reviewArray[index];
    const newReview = {
      ...oldReview,
      ...req.body,
      updatedAt: new Date(),
      id: reviewId,
    };
    reviewArray[index] = newReview;
    await writeReview(reviewArray);
    res.send(newReview);
  } catch (error) {
    next(error);
  }
});

movieRouter.delete("/:id/review/:id", async (req, res, next) => {
  try {
    const reviewId = req.params.id;

    const postsArray = await getReview();

    const remainingPosts = postsArray.filter(post => post.id !== reviewId);

    await writeReview(remainingPosts);

    res.send({ message: `Review with ${reviewId} is successfully deleted` });
  } catch (error) {
    next(error);
  }
});

movieRouter.get("/download/:id", async (req, res, next) => {
  try {
    const blogPosts = await getMovies();
    const selectedBlogPost = blogPosts.find(
      blogPost => blogPost.imdbID === req.params.id
    );
    //create PDF readableStream
    const source = await createPDFReadableStream(selectedBlogPost);
    // set header
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${selectedBlogPost.imdbID}.pdf`
    );
    // set destination
    const destination = res;
    pipeline(source, destination, err => {
      if (err) {
        next(err);
      }
    });
  } catch (error) {
    next(error);
  }
});

export default movieRouter;
