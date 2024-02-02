// reducers/topSongs.js

import { ADD_TOPSONGS } from "../actions/topSongs";

const initState = {
  topSongs: [],
};

export default (state = initState, action) => {
  switch (action.type) {
    case ADD_TOPSONGS:
      const topSongs = action.topSongs;

      return {
        topSongs: topSongs,
      };
  }
  return state;
};
