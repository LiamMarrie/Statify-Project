// reducers/token.js

import { ADD_TOKEN } from "../actions/token";

const initState = {
  token: "",
};

export default (state = initState, action) => {
  switch (action.type) {
    case ADD_TOKEN:
      const token = action.token;

      return {
        token: token,
      };
  }
  return state;
};
