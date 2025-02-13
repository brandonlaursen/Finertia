import { csrfFetch } from "./csrf";

const SET_SEARCH_RESULTS = "search/SET_SEARCH_RESULTS";

const setSearchResults = (results) => {
  return {
    type: SET_SEARCH_RESULTS,
    results,
  };
};

export const fetchSearchResults = (searchQuery) => async (dispatch) => {
  const response = await csrfFetch(`/api/search`, {
    method: "POST",
    body: JSON.stringify({ searchQuery }),
  });

  if (response) {
    const data = await response.json();

    dispatch(setSearchResults(data));
  }
};

const initialState = [];

const searchReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SEARCH_RESULTS:
      return action.results;
    default:
      return state;
  }
};

export default searchReducer;
