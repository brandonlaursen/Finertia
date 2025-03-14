import { csrfFetch } from "./csrf";
import { createSelector } from "reselect";

// * Constants
const SET_USER = "session/setUser";
const REMOVE_USER = "session/REMOVE_USER";

const ADD_ACCOUNT_TRANSACTION = "transactions/ADD_ACCOUNT_TRANSACTION";
const ADD_STOCK_TRANSACTION = "transactions/ADD_STOCK_TRANSACTION";

// * Action Creators
export const setUser = (user, stockSummary) => {
  return {
    type: SET_USER,
    user,
    stockSummary,
  };
};

const removeUser = () => {
  return {
    type: REMOVE_USER,
  };
};

// * Thunks
export const signup = (user) => async (dispatch) => {
  const { username, firstName, lastName, email, password } = user;
  const response = await csrfFetch("/api/users", {
    method: "POST",
    body: JSON.stringify({
      username,
      firstName,
      lastName,
      email,
      password,
    }),
  });
  const data = await response.json();
  dispatch(setUser(data.user, data.stockSummary));
  return response;
};

export const login = (user) => async (dispatch) => {
  const { credential, password } = user;

  const response = await csrfFetch("/api/session", {
    method: "POST",
    body: JSON.stringify({
      credential,
      password,
    }),
  });
  const userInfo = await response.json();

  if (userInfo.user) {
    const response = await csrfFetch("/api/transactions/stock-summary");
    const data = await response.json();

    dispatch(setUser(userInfo.user, data));
  }
};

export const logout = () => async (dispatch) => {
  const response = await csrfFetch("/api/session/logout");
  dispatch(removeUser());
  return response;
};

export const restoreUser = () => async (dispatch) => {
  const response = await csrfFetch("/api/session");
  const userInfo = await response.json();

  if (userInfo.user) {
    const response = await csrfFetch("/api/transactions/stock-summary");
    const stockSummary = await response.json();

    dispatch(setUser(userInfo.user, stockSummary));
  }

  return response;
};

export const editUser = (user) => async (dispatch, getState) => {
  const { username, image } = user;
  const formData = new FormData();

  formData.append("username", username);
  if (image) formData.append("image", image);

  const response = await csrfFetch("/api/session", {
    method: "PUT",
    body: formData,
  });
  const userInfo = await response.json();

  if (userInfo.user) {
    const currentState = getState();
    dispatch(setUser(userInfo.user, currentState.session.user.stockSummary));
  }
};

export const editPassword = (passwordInfo) => async (dispatch) => {
  const { currentPassword, newPassword } = passwordInfo;

  const response = await csrfFetch("/api/session/update-password", {
    method: "PUT",
    body: JSON.stringify({
      currentPassword,
      newPassword,
    }),
  });

  const data = await response.json();

  if (data.err) {
    return data;
  } else {
    dispatch(restoreUser());
    return data;
  }
};

// * Selectors
export const userSelector = (state) => state.session.user;
export const selectUser = createSelector([userSelector], (user) => user);

// * Reducer
const initialState = { user: null };

const sessionReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        user: { ...action.user, stockSummary: { ...action.stockSummary } },
      };
    case REMOVE_USER:
      return { ...state, user: null };
    case ADD_ACCOUNT_TRANSACTION:
      return {
        ...state,
        user: {
          ...state.user,
          balance: action.updatedBalance,
          stockSummary: {
            ...state.user.stockSummary,
            balance: action.updatedBalance,
          },
        },
      };
    case ADD_STOCK_TRANSACTION:
      return {
        ...state,
        user: {
          ...state.user,
          balance: action.updatedBalance,
          stockSummary: action.updatedStockSummary,
        },
      };
    default:
      return state;
  }
};

export default sessionReducer;
