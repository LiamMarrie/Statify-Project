// actions/profilePicture.js
export const SET_PROFILE_PICTURE = "SET_PROFILE_PICTURE";

export const setProfilePicture = (profilePicture) => ({
  type: SET_PROFILE_PICTURE,
  profilePicture,
});
