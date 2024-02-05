// reducers/genres.js
import { SET_GENRES } from "../actions/genres";

const initialState = {
  genres: null, // Initial state set to null or an empty string
};

const genresReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_GENRES:
      return {
        ...state,
        genres: action.genres,
      };
    default:
      return state;
  }
};

export default genresReducer;
