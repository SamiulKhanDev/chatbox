export const initialState = {
  user: null,
}; //this is the initial state, where user is null.

export const actionTypes = {
  SET_USER: "SET_USER",
}; //this object is to define all actionTypes.

const reducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_USER:
      return {
        ...state, //merging the old state manually.
        user: action.user,
      };
    default:
      return state;
  }
};

export default reducer;
