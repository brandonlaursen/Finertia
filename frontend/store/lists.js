
import { csrfFetch } from "./csrf";
import { createSelector } from "reselect";

// * Constants
const SET_LISTS = "lists/SET_LISTS";
const ADD_LIST = "lists/ADD_LIST";
const UPDATE_LIST = "lists/UPDATE_LIST";
const REMOVE_LIST = "lists/REMOVE_LIST";

const UPDATE_LIST_STOCKS = "lists/UPDATE_LIST_STOCKS";
const REMOVE_USER = "session/removeUser";

// * Action Creators
export const setLists = (lists) => ({
  type: SET_LISTS,
  lists,
});

export const addList = (createdList) => ({
  type: ADD_LIST,
  createdList,
});

export const updateList = (updatedList) => ({
  type: UPDATE_LIST,
  updatedList,
});

export const removeList = (removedListId) => ({
  type: REMOVE_LIST,
  removedListId,
});

// * Thunks
export const fetchLists = () => async (dispatch) => {
  const response = await csrfFetch("/api/lists");

  if (response.ok) {
    const data = await response.json();

    dispatch(setLists(data));
  }
};

export const createList =
  ({ name, emoji, stockIds }) =>
  async (dispatch) => {

    console.log('entering list thunk')
    const response = await csrfFetch("/api/lists", {
      method: "POST",
      body: JSON.stringify({
        name,
        emoji,
        stockIds,
      }),
    });

    if (response.ok) {
      const data = await response.json();

      dispatch(addList(data));
      return data.id;
    }
  };

export const editList =
  ({ name, emoji, stockListId }) =>
  async (dispatch) => {
    const response = await csrfFetch(`/api/lists/${stockListId}`, {
      method: "PUT",

      body: JSON.stringify({
        name,
        emoji,
      }),
    });

    if (response.ok) {
      const data = await response.json();

      dispatch(updateList(data));
    }
  };

export const deleteList = (stockListId) => async (dispatch) => {
  const response = await csrfFetch(`/api/lists/${stockListId}`, {
    method: "DELETE",
  });

  if (response.ok) {
    dispatch(removeList(stockListId));
  }
};

// * Selector
const selectAllLists = (state) => state.lists || {};
const selectListId = (state, listId) => listId;

export const selectListsArray = createSelector(selectAllLists, (list) => {
  return Object.values(list);
});

export const selectListById = createSelector([selectAllLists, selectListId], (lists, listId) => lists[listId]);

const initialState = {}
// * Reducer
const listsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_LISTS: {
      const normalizedLists = {};

      for (let list of action.lists) {
        normalizedLists[list.id] = list;
      }
      return { ...state, ...normalizedLists };
    }
    case ADD_LIST: {
      return {
        ...state,
        [action.createdList.id]: action.createdList,
      };
    }
    case UPDATE_LIST: {
      return {
        ...state,
        [action.updatedList.id]: action.updatedList,
      };
    }
    case REMOVE_LIST: {
      const newState = { ...state };

      delete newState[action.removedListId];

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

      for (let listId of action.removedListIds) {
        const foundIndex = newState[listId].Stocks.findIndex(
          (stock) => stock.id === action.stock.id
        );
        newState[listId].Stocks.splice(foundIndex, 1);
      }

      return newState;
    }
    case REMOVE_USER:
      return initialState;
    default:
      return state;
  }
};

export default listsReducer;
