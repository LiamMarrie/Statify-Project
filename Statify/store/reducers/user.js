// reducers/user.js
import { SET_USER } from "../actions/user";

const initialState = {
  user: null, // Initial state set to null or an empty string
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        user: action.user,
      };
    default:
      return state;
  }
};

export default userReducer;
