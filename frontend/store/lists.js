import { csrfFetch } from "./csrf";
import { createSelector } from "reselect";

const FETCH_LISTS = "lists/FETCH_LISTS";
const CREATE_LISTS = "lists/CREATE_LISTS";
const EDIT_LIST = "lists/EDIT_LIST";
const DELETE_LIST = "lists/DELETE_LIST";
const UPDATE_LIST_STOCKS = "lists/UPDATE_LIST_STOCKS";

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

export const setDeletedList = (listId) => ({
  type: DELETE_LIST,
  listId,
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

      dispatch(setCreatedList(data));

      return data.id;
    }
  };

export const fetchUsersLists = () => async (dispatch) => {
  const response = await csrfFetch("/api/lists");

  if (response.ok) {
    const data = await response.json();

    dispatch(setLists(data));
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

      dispatch(setEditedList(data));
    }
  };

export const deleteList = (stockListId) => async (dispatch) => {
  const response = await csrfFetch(`/api/lists/${stockListId}`, {
    method: "DELETE",
  });

  if (response.ok) {
    dispatch(setDeletedList(stockListId));
  }
};

const selectAllLists = (state) => state.lists || {};
export const selectListsArray = createSelector(selectAllLists, (list) => {
  return Object.values(list);
});

// export const selectListById = (listId) => (state) => state.lists.allLists[listId];

// * Reducer
const listsReducer = (state = {}, action) => {
  switch (action.type) {
    case FETCH_LISTS: {
      const normalizedLists = {};

      for (let list of action.lists) {
        normalizedLists[list.id] = list;
      }
      return { ...state, ...normalizedLists };
    }
    case CREATE_LISTS: {
      return {
        ...state,
        [action.list.id]: action.list,
      };
    }
    case EDIT_LIST: {
      return {
        ...state,
        [action.list.id]: action.list,
      };
    }
    case DELETE_LIST: {
      const newState = { ...state };

      delete newState[action.listId];

      return newState;
    }
    case UPDATE_LIST_STOCKS: {
      const newState = { ...state };
   
      for (let listId of action.updatedListIds) {
        const found = newState[listId].Stocks.find(
          (stock) => stock.id === action.stock.id
        );
        if (!found) {
          newState[listId].Stocks.push(action.stock);
        }
      }

      for (let listId of action.removedFromIds) {
        const foundIndex = newState[listId].Stocks.findIndex(
          (stock) => stock.id === action.stock.id
        );
        newState[listId].Stocks.splice(foundIndex, 1);
      }

      return newState;
    }
    default:
      return state;
  }
};

export default listsReducer;
