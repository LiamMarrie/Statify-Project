// reducers/username.js
import { SET_USERNAME } from "../actions/username";

const initialState = {
  username: null, // Initial state set to null or an empty string
};

const usernameReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USERNAME:
      return {
        ...state,
        username: action.username,
      };
    default:
      return state;
  }
};

export default usernameReducer;
