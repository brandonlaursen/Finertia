import { csrfFetch } from "./csrf";

const GET_NEWS = "stocks/getNews";
const GET_STOCK = "stocks/getStock";

export const getNews = (data) => {
  return {
    type: GET_NEWS,
    payload: data,
  };
};

const getStock = (data) => {
  return {
    type: GET_STOCK,
    payload: data,
  };
};

export const getStockNews = () => async (dispatch) => {
  const cachedNews = localStorage.getItem("stockNews");
  const json = JSON.parse(cachedNews);

  if (json.length) {
    dispatch(getNews(json));
    return;
  }

  const response = await csrfFetch("/api/stocks/news");

  if (response.ok) {
    const data = await response.json();
    localStorage.setItem("stockNews", JSON.stringify(data));

    dispatch(getNews(data));
  }
};

export const getStockNewsCategory = (category) => async (dispatch) => {
  const response = await csrfFetch(`/api/stocks/news/${category}`);

  if (response.ok) {
    const data = await response.json();
    dispatch(getNews(data));
  }
};

export const getStockData = (symbol) => async (dispatch) => {
  const cachedNews = localStorage.getItem(symbol);
  const json = JSON.parse(cachedNews);

  if (json) {
    dispatch(getStock(json));
    return;
  }
  const response = await csrfFetch(`/api/stocks/${symbol}`);

  if (response.ok) {
    const data = await response.json();
    localStorage.setItem(symbol, JSON.stringify(data));
    dispatch(getStock(data));
  }
};

const stockReducer = (
  state = { news: [], allStocks: {}, currentStock: {} },
  action
) => {
  switch (action.type) {
    case GET_NEWS: {
      return { ...state, news: action.payload };
    }
    case GET_STOCK: {
      return { ...state, currentStock: action.payload };
    }
    default:
      return state;
  }
};

export default stockReducer;
