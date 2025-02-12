import { csrfFetch } from "./csrf";
import { createSelector } from "reselect";

// * Constants
const SET_ALL_STOCKS = "stocks/SET_ALL_STOCKS";
const SET_CURRENT_STOCK = "stocks/SET_CURRENT_STOCK";
const SET_STOCKS_NEWS = "stocks/SET_STOCKS_NEWS";

const UPDATE_LIST_STOCKS = "lists/UPDATE_LIST_STOCKS";

// * Action Creators
export const setAllStocks = (stocks) => ({
  type: SET_ALL_STOCKS,
  stocks,
});

export const setCurrentStock = (currentStock) => ({
  type: SET_CURRENT_STOCK,
  currentStock,
});

export const setStockNews = (news) => ({
  type: SET_STOCKS_NEWS,
  news,
});

export const updateListStocks = (stock, updatedListIds, removedListIds) => ({
  type: UPDATE_LIST_STOCKS,
  updatedListIds,
  removedListIds,
  stock,
});

// * Thunks
export const fetchAllStocks = () => async (dispatch) => {
  const response = await csrfFetch("/api/stocks");

  if (response.ok) {
    const data = await response.json();

    dispatch(setAllStocks(data));
  }
};

export const fetchStock = (stockSymbol) => async (dispatch) => {
  const response = await csrfFetch(`/api/stocks/${stockSymbol}`);

  if (response.ok) {
    const data = await response.json();

    dispatch(setCurrentStock(data));
  }
};

export const fetchStockNews = () => async (dispatch) => {
  const response = await csrfFetch("/api/stocks/news");

  if (response.ok) {
    const data = await response.json();

    dispatch(setStockNews(data));
  }
};

export const fetchStockNewsByCategory = (category) => async (dispatch) => {
  const response = await csrfFetch(`/api/stocks/news/${category}`);

  if (response.ok) {
    const data = await response.json();
    dispatch(setStockNews(data));
  }
};

export const editListStocks = (stockListsIdsObj, stock) => async (dispatch) => {
  const response = await csrfFetch("/api/lists/update-stock-lists", {
    method: "POST",
    body: JSON.stringify({
      stockListsIdsObj,
      stockId: stock.id,
    }),
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(
      updateListStocks(data.stock, data.updatedListIds, data.removedFromIds)
    );
    return { messages: data.messages };
  }
};

// * Selectors
const selectAllStocks = (state) => state.stocks.allStocks || {};
export const selectStocksArray = createSelector(selectAllStocks, (list) => {
  return Object.values(list);
});

// * Stock Reducer
const initialState = { allStocks: [], currentStock: {} };

const stockReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ALL_STOCKS: {
      const normalizedStocks = {};

      for (let stock of action.stocks) {
        normalizedStocks[stock.id] = stock;
      }

      return {
        ...state,
        allStocks: { ...normalizedStocks },
      };
    }
    case SET_CURRENT_STOCK: {
      return {
        ...state,
        allStocks: { ...state.allStocks },
        currentStock: {
          ...action.currentStock,
          listIds: [...action.currentStock.listIds],
        },
      };
    }
    case SET_STOCKS_NEWS: {
      return { ...state, news: action.news };
    }
    case UPDATE_LIST_STOCKS: {
      const newState = {
        ...state,
        allStocks: {
          ...state.allStocks,
          [action.stock.id]: {
            ...state.allStocks[action.stock.id],
            listIds: [...action.updatedListIds],
          },
        },

        currentStock: {
          ...state.currentStock,
          listIds: [...action.updatedListIds],
        },
      };
      return newState;
    }
    default:
      return state;
  }
};

export default stockReducer;
