import { csrfFetch } from "./csrf";

const FETCH_LISTS = "lists/FETCH_LISTS";

export const setLists = (lists) => ({
  type: FETCH_LISTS,
  lists,
});

// * Thunks
export const fetchUsersLists = () => async (dispatch) => {
  const response = await csrfFetch("/api/lists");

  if (response.ok) {
    const data = await response.json();
    console.log("Parsed Data:", data.lists);

    dispatch(setLists(data.lists));
  }
};

const CREATE_LISTS = "lists/CREATE_LISTS";

export const setCreatedList = (list) => ({
  type: CREATE_LISTS,
  list,
});

// * Thunks
export const createList =
  ({ name, type, stockIds }) =>
  async (dispatch) => {

    const response = await csrfFetch("/api/lists", {
      method: "POST",
      body: JSON.stringify({
        name,
        type,
        stockIds,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log("data:", data);


      dispatch(setCreatedList(data.newStockList));
    }
  };

// * Reducer
const listsReducer = (state = {}, action) => {
  switch (action.type) {
    case FETCH_LISTS: {
      return { ...state, allLists: action.lists };
    }
    case CREATE_LISTS: {
      console.log('!!!!!',action)
      return { ...state, allLists: [...state.allLists, action.list] };
    }
    default:
      return state;
  }
};

export default listsReducer;
