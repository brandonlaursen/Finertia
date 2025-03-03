import { csrfFetch } from "./csrf";
import { setUser } from "./session";
// * Constants
const SET_ACCOUNT_TRANSACTIONS = "transactions/SET_ACCOUNT_TRANSACTIONS";
const ADD_ACCOUNT_TRANSACTION = "transactions/ADD_ACCOUNT_TRANSACTION";

const SET_STOCK_TRANSACTIONS = "transactions/SET_STOCK_TRANSACTIONS";
const ADD_STOCK_TRANSACTION = "transactions/ADD_STOCK_TRANSACTION";
const REMOVE_USER = "session/removeUser";

const SET_USER = "session/setUser";

// * Action Creators
const setAccountTransactions = (transactions) => {
  return {
    type: SET_ACCOUNT_TRANSACTIONS,
    transactions,
  };
};

const addAccountTransaction = (updatedBalance, createdTransaction) => {
  return {
    type: ADD_ACCOUNT_TRANSACTION,
    createdTransaction,
    updatedBalance,
  };
};

const setStockTransactions = (transactions) => {
  return {
    type: SET_STOCK_TRANSACTIONS,
    transactions,
  };
};

// * Thunks
export const fetchAccountTransactions = () => async (dispatch) => {
  const response = await csrfFetch("/api/transactions");
  const { transactions } = await response.json();

  dispatch(setAccountTransactions(transactions));
};

export const depositFunds = (amount) => async (dispatch) => {
  const response = await csrfFetch("/api/transactions/deposit", {
    method: "POST",
    body: JSON.stringify({
      amount,
    }),
  });

  const { balance, transaction } = await response.json();
  dispatch(addAccountTransaction(balance, transaction));
};

export const withdrawFunds = (amount) => async (dispatch) => {
  const response = await csrfFetch("/api/transactions/withdraw", {
    method: "POST",
    body: JSON.stringify({
      amount,
    }),
  });

  const { balance, transaction } = await response.json();
  dispatch(addAccountTransaction(balance, transaction));
};

export const fetchStockTransactions = () => async (dispatch) => {
  const response = await csrfFetch("/api/transactions/stock-transactions");
  const { transactions } = await response.json();

  dispatch(setStockTransactions(transactions));
};

export const executeStockTrade = (transaction) => async (dispatch) => {
  const { stockId } = transaction;

  try {
    // Execute the trade
    const response = await csrfFetch(`/api/transactions/trade/${stockId}`, {
      method: "POST",
      body: JSON.stringify(transaction),
    });

    const { user } = await response.json();

    if (user) {
      // Fetch the latest stock summary
      const summaryResponse = await csrfFetch(
        "/api/transactions/stock-summary"
      );
      const stockSummary = await summaryResponse.json();

      // Fetch the latest stock transactions
      const transactionsResponse = await csrfFetch(
        "/api/transactions/stock-transactions"
      );
      const { transactions } = await transactionsResponse.json();

      // Update all relevant state
      dispatch(setUser(user, stockSummary));
      dispatch(setStockTransactions(transactions));

      return { success: true, user, stockSummary, transactions };
    }
  } catch (error) {
    console.error("Error executing trade:", error);
    return { success: false, error: error.message };
  }
};

// * Transactions reducer
const initialState = { accountTransactions: [], stockTransactions: [] };

const transactionsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ACCOUNT_TRANSACTIONS:
      return {
        ...state,
        accountTransactions: [...action.transactions],
        stockTransactions: [...state.stockTransactions],
      };

    case ADD_ACCOUNT_TRANSACTION:
      return {
        ...state,
        accountTransactions: [
          ...state.accountTransactions,
          action.createdTransaction,
        ],
        stockTransactions: [...state.stockTransactions],
      };
    case SET_STOCK_TRANSACTIONS:
      return {
        ...state,
        accountTransactions: [...state.accountTransactions],
        stockTransactions: [...action.transactions],
      };
    case ADD_STOCK_TRANSACTION:
      return {
        ...state,
        accountTransactions: [...state.accountTransactions],
        stockTransactions: [
          ...state.stockTransactions,
          action.createdTransaction,
        ],
      };
    case SET_USER:
      return {
        ...state,
        user: { ...action.user, stockSummary: { ...action.stockSummary } },
      };
    case REMOVE_USER:
      return initialState;
    default:
      return state;
  }
};

export default transactionsReducer;
