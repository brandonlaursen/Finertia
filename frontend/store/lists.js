import { csrfFetch } from "./csrf";
import { createSelector } from "reselect";

const FETCH_LISTS = "lists/FETCH_LISTS";
const CREATE_LISTS = "lists/CREATE_LISTS";
const EDIT_LIST = "lists/EDIT_LIST";

export const setLists = (lists) => ({
  type: FETCH_LISTS,
  lists,
});

export const setCreatedList = (list) => ({
  type: CREATE_LISTS,
  list,
});

export const setEditedList = (list) => ({
  type: EDIT_LIST,
  list,
});

// * Thunks
export const fetchUsersLists = () => async (dispatch) => {
  const response = await csrfFetch("/api/lists");

  if (response.ok) {
    const data = await response.json();

    dispatch(setLists(data.lists));
  }
};

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

      dispatch(setCreatedList(data.newStockList));
    }
  };

export const editList =
  ({ name, type, stockListId }) =>
  async (dispatch) => {
    const response = await csrfFetch(`/api/lists/${stockListId}`, {
      method: "PUT",

      body: JSON.stringify({
        name,
        type,
      }),
    });

    if (response.ok) {
      const data = await response.json();

      dispatch(setEditedList(data.stockList));
    }
  };

const selectAllLists = (state) => state.lists.allLists || {};
export const selectListsArray = createSelector(selectAllLists, (list) => {
  return Object.values(list);
});

// export const selectListById = (listId) => (state) => state.lists.allLists[listId];

// * Reducer
const listsReducer = (state = {}, action) => {
  switch (action.type) {
    case FETCH_LISTS: {
      const newState = { ...state, allLists: { ...state.allLists } };

      action.lists.forEach((list) => {
        newState.allLists[list.id] = list;
      });

      return newState;
    }
    case CREATE_LISTS: {
      return {
        ...state,
        allLists: { ...state.allLists, [action.list.id]: action.list },
      };
    }
    case EDIT_LIST: {
      return {
        ...state,
        allLists: { ...state.allLists, [action.list.id]: action.list },
      };
    }
    default:
      return state;
  }
};

export default listsReducer;
