// actions/genres.js

export const SET_GENRES = "SET_GENRES";

export const setGenres = (genres) => ({
  type: SET_GENRES,
  genres: genres,
});
