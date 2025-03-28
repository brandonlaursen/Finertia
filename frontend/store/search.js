import { csrfFetch } from "./csrf";

// * Constants
const SET_SEARCH_RESULTS = "search/SET_SEARCH_RESULTS";

// * Action Creators
const setSearchResults = (results) => {
  return {
    type: SET_SEARCH_RESULTS,
    results,
  };
};

// * Thunks
export const fetchSearchResults = (searchQuery) => async (dispatch) => {
  const response = await csrfFetch(`/api/search`, {
    method: "POST",
    body: JSON.stringify({ searchQuery }),
  });

  if (response) {
    const searchResults = await response.json();

    dispatch(setSearchResults(searchResults));
  }
};

const initialState = [];
// * Reducer
const searchReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SEARCH_RESULTS:
      return action.results;
    default:
      return state;
  }
};

export default searchReducer;
