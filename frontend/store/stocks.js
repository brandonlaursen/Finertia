import { csrfFetch } from "./csrf";

const GET_NEWS = "stocks/getNews";

const getNews = (data) => {
  return {
    type: GET_NEWS,
    payload: data,
  };
};

export const getStockNews = () => async (dispatch) => {
  const response = await csrfFetch("/api/stocks/news");

  if (response.ok) {
    const data = await response.json();
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

const stockReducer = (state = {}, action) => {
  switch (action.type) {
    case GET_NEWS: {
      return { ...state, news: action.payload };
    }

    default:
      return state;
  }
};

export default stockReducer;
