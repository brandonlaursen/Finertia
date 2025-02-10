import { csrfFetch } from "./csrf";
import { createSelector } from "reselect";

// * Action Type Constants
const FETCH_ALL_STOCKS = "stocks/FETCH_ALL_STOCKS";
const FETCH_STOCK_DETAILS = "stocks/FETCH_STOCK_DETAILS";
const FETCH_STOCK_NEWS = "stocks/FETCH_STOCK_NEWS";
const UPDATE_LIST_STOCKS = "lists/UPDATE_LIST_STOCKS";

// * Action Creators
export const setAllStocks = (stocks) => ({
  type: FETCH_ALL_STOCKS,
  stocks,
});

export const setCurrentStock = (stock) => ({
  type: FETCH_STOCK_DETAILS,
  stock,
});

export const setStockNews = (news) => ({
  type: FETCH_STOCK_NEWS,
  news,
});

export const setUpdatedStockLists = (
  updatedListIds,
  stock,
  removedFromIds
) => ({
  type: UPDATE_LIST_STOCKS,
  updatedListIds,
  removedFromIds,
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

export const fetchStockDetails = (stockSymbol) => async (dispatch) => {
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

export const updateStockLists =
  (stockListsIdsObj, stock) => async (dispatch) => {
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
        setUpdatedStockLists(
          data.updatedListIds,
          data.stock,
          data.removedFromIds
        )
      );
      return { messages: data.messages };
    }
  };

const selectAllStocks = (state) => state.stocks.allStocks || {};
export const selectStocksArray = createSelector(selectAllStocks, (list) => {
  return Object.values(list);
});

const initialState = { allStocks: [], currentStock: {} };

// * Reducer
const stockReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ALL_STOCKS: {
      const normalizedStocks = {};

      for (let stock of action.stocks) {
        normalizedStocks[stock.id] = stock;
      }

      return {
        ...state,

        allStocks: { ...normalizedStocks },
      };
    }
    case FETCH_STOCK_DETAILS: {
      return {
        ...state,
        allStocks: { ...state.allStocks },
        currentStock: {
          ...action.stock,
          listIds: [...action.stock.listIds],
        },
      };
    }
    case FETCH_STOCK_NEWS: {
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
