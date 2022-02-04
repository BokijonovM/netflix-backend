import fs from "fs-extra";
import { fileURLToPath } from "url";
import { join, dirname } from "path";

const { readJSON, writeJSON, writeFile, createReadStream } = fs;

const dataFolderPath = join(process.cwd(), "./src/services/JSONData");

const moviesPublicFolderPath = join(process.cwd(), "./public");

const moviesJSONPath = join(dataFolderPath, "movies.json");
const reviewsJSONPath = join(dataFolderPath, "review.json");

export const getMovies = () => readJSON(moviesJSONPath);
export const writeMovies = content => writeJSON(moviesJSONPath, content);

export const getReview = () => readJSON(reviewsJSONPath);
export const writeReview = content => writeJSON(reviewsJSONPath, content);

export const saveMoviePoster = (filename, contentAsBuffer) =>
  writeFile(join(moviesPublicFolderPath, filename), contentAsBuffer);

export const getMoviesReadableStream = () => createReadStream(moviesJSONPath);
