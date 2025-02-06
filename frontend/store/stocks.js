import { csrfFetch } from "./csrf";

// * Action Type Constants
const FETCH_STOCK_NEWS = "stocks/FETCH_STOCK_NEWS";
const FETCH_STOCK_DETAILS = "stocks/FETCH_STOCK_DETAILS";
const FETCH_ALL_STOCKS = "stocks/FETCH_ALL_STOCKS";

const UPDATE_LIST_STOCKS = "lists/UPDATE_LIST_STOCKS";

export const setUpdatedStockLists = (updatedListIds, stockId) => ({
  type: UPDATE_LIST_STOCKS,
  updatedListIds,
  stockId,
});

export const updateStockLists =
  (stockListsIdsObj, stockId) => async (dispatch) => {
    const response = await csrfFetch("/api/lists/update-stock-lists", {
      method: "POST",
      body: JSON.stringify({
        stockListsIdsObj,
        stockId,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      dispatch(setUpdatedStockLists(data.updatedListIds, stockId));
      return { messages: data.messages };
    }
  };

// * Action Creators
export const setStockNews = (news) => ({
  type: FETCH_STOCK_NEWS,
  news,
});

export const setStockDetails = (stock, listIds) => ({
  type: FETCH_STOCK_DETAILS,
  stock,
  listIds,
});

export const setAllStocks = (stocks) => ({
  type: FETCH_ALL_STOCKS,
  stocks,
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

    dispatch(setStockDetails(data.stock, data.listIds));
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

const initialState = {
  1: { id: 1, name: "Apple", symbol: "AAPL" },
  currentStock: {
    listIds: [],
  },
};

// * Reducer
const stockReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ALL_STOCKS: {
      return { ...state, ...action.stocks };
    }
    case FETCH_STOCK_NEWS: {
      return { ...state, news: action.news };
    }
    case FETCH_STOCK_DETAILS: {
      console.log(action);
      return {
        ...state,
        currentStock: {
          ...action.stock,
          listIds: [...action.listIds],
        },
      };
    }
    case UPDATE_LIST_STOCKS: {
      // const { listId, isAdding } = action.payload;

      console.log("action ---->", action);
      const newState = {
        ...state,
        currentStock: {
          ...state.currentStock,
          listIds: [...action.updatedListIds],
        },
      };
      // console.log(state)
      return newState;
    }
    default:
      return state;
  }
};

export default stockReducer;
