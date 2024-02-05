// reducers/profilePicture.js

import { SET_PROFILE_PICTURE } from "../actions/profilePicture";

const initialState = {
  profilePicture: null, // Initial state set to null or an empty string
};

const profilePictureReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_PROFILE_PICTURE:
      return {
        ...state,
        profilePicture: action.profilePicture,
      };
    default:
      return state;
  }
};
export default profilePictureReducer;
