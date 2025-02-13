import { csrfFetch } from "./csrf";

// * Constants
const SET_ACCOUNT_TRANSACTIONS = "transactions/SET_ACCOUNT_TRANSACTIONS";
const ADD_ACCOUNT_TRANSACTION = "transactions/ADD_ACCOUNT_TRANSACTION";

const SET_STOCK_TRANSACTIONS = "transactions/SET_STOCK_TRANSACTIONS";
const ADD_STOCK_TRANSACTION = "transactions/ADD_STOCK_TRANSACTION";

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

const addStockTransaction = (createdTransaction, updatedBalance, updatedStockSummary) => {
  return {
    type: ADD_STOCK_TRANSACTION,
    createdTransaction,
    updatedBalance,
    updatedStockSummary
  };
};

// * Thunks
export const fetchAccountTransactions = () => async (dispatch) => {
  const response = await csrfFetch("/api/transactions");
  const { transactions } = await response.json();

  dispatch(setAccountTransactions(transactions));
};

// refactor in one route - updateFunds
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

export const executeStockTrade = (transaction, transactionType) => async (dispatch) => {
    console.log("transaction:", transaction);
    const { stockId, price, quantity } = transaction;

    const response = await csrfFetch(`/api/transactions/trade/${stockId}`, {
      method: "POST",
      body: JSON.stringify({
        stockId,
        price,
        quantity,
        transactionType,
      }),
    });

    const data = await response.json();

    dispatch(addStockTransaction(data.transaction, data.balance, data.stockSummary));
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
    default:
      return state;
  }
};

export default transactionsReducer;
