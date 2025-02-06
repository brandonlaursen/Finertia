import { csrfFetch } from "./csrf";

// * Action Type Constants
const FETCH_STOCK_NEWS = "stocks/FETCH_STOCK_NEWS";
const FETCH_STOCK_DETAILS = "stocks/FETCH_STOCK_DETAILS";
const FETCH_ALL_STOCKS = "stocks/FETCH_ALL_STOCKS";

// * Action Creators
export const setStockNews = (news) => ({
  type: FETCH_STOCK_NEWS,
  payload: news,
});

export const setStockDetails = (stock) => ({
  type: FETCH_STOCK_DETAILS,
  payload: stock,
});

export const setAllStocks = (stocks) => ({
  type: FETCH_ALL_STOCKS,
  payload: stocks,
});

// * Thunks
export const fetchAllStocks = () => async (dispatch) => {
  const cachedStocksData = localStorage.getItem("allStocks");
  const parsedStocks = cachedStocksData ? JSON.parse(cachedStocksData) : null;

  if (parsedStocks) {
    dispatch(setAllStocks(parsedStocks));
    return;
  }

  const response = await csrfFetch("/api/stocks");

  if (response.ok) {
    const data = await response.json();
    localStorage.setItem("allStocks", JSON.stringify(data));

    dispatch(setAllStocks(data));
  }
};

export const fetchStockNews = () => async (dispatch) => {
  const cachedStocksNews = localStorage.getItem("stockNews");

  const parsedStocksNews = cachedStocksNews
    ? JSON.parse(cachedStocksNews)
    : null;

  if (parsedStocksNews.length) {
    dispatch(setStockNews(parsedStocksNews));
    return;
  }

  const response = await csrfFetch("/api/stocks/news");

  if (response.ok) {
    const data = await response.json();
    localStorage.setItem("stockNews", JSON.stringify(data));

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

export const fetchStockDetails = (stockSymbol) => async (dispatch) => {
  // const cachedStockData = localStorage.getItem(symbol);

  // const parsedStockData = cachedStockData ? JSON.parse(cachedStockData) : null;

  // if (parsedStockData) {
  //   dispatch(setStockDetails(parsedStockData));
  //   return;
  // }
  const response = await csrfFetch(`/api/stocks/${stockSymbol}`);

  if (response.ok) {
    const data = await response.json();
    // localStorage.setItem(symbol, JSON.stringify(data));
    dispatch(setStockDetails(data));
  }
};

// * Reducer
const stockReducer = (
  state = { news: [], allStocks: {}, currentStock: {} },
  action
) => {
  switch (action.type) {
    case FETCH_STOCK_NEWS: {
      return { ...state, news: action.payload };
    }
    case FETCH_STOCK_DETAILS: {

      return {
        ...state,
        currentStock: {
          ...state.currentStock,
          ...action.payload,
          lists: { ...state.currentStock.lists, ...action.payload.listIdsObj },
        },
      };
    }
    case FETCH_ALL_STOCKS: {
      return { ...state, allStocks: action.payload };
    }
    default:
      return state;
  }
};

export default stockReducer;
