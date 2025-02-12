import { csrfFetch } from "./csrf";

const GET_TRANSACTIONS = "transactions/GET_TRANSACTIONS";
const SET_TRANSACTION = "transactions/SET_TRANSACTION";

const GET_STOCK_TRANSACTIONS = "transactions/GET_STOCK_TRANSACTIONS";

const BUY_STOCK = "transactions/BUY_STOCK";

const setBuyStock = (transaction, balance) => {
  return {
    type: BUY_STOCK,
    transaction,
    balance,
  };
};

const setStockTransactions = (transactions) => {
  return {
    type: GET_STOCK_TRANSACTIONS,
    transactions,
  };
};

const setTransaction = (balance, transaction) => {
  return {
    type: SET_TRANSACTION,
    balance,
    transaction,
  };
};

const setTransactions = (transactions) => {
  return {
    type: GET_TRANSACTIONS,
    transactions,
  };
};

export const buyStock = (transaction) => async (dispatch) => {
  console.log("transaction:--->", transaction);
  const response = await csrfFetch(
    `/api/transactions/buy/${transaction.stockId}`,
    {
      method: "POST",
      body: JSON.stringify({
        stockId: transaction.stockId,
        price: transaction.price,
        quantity: transaction.quantity,
      }),
    }
  );
  const data = await response.json();
  console.log("data:", data);

  dispatch(setBuyStock(data.transaction, data.balance));
};

export const getStockTransactions = () => async (dispatch) => {
  const response = await csrfFetch("/api/transactions/stock-transactions");
  const data = await response.json();
  console.log("data:", data);

  dispatch(setStockTransactions(data.transactions));
};

export const getTransactions = () => async (dispatch) => {
  const response = await csrfFetch("/api/transactions");
  const data = await response.json();

  dispatch(setTransactions(data.transactions));
};

export const depositMoney = (amount) => async (dispatch) => {
  console.log("redux", amount);
  const response = await csrfFetch("/api/transactions/deposit", {
    method: "POST",
    body: JSON.stringify({
      amount,
    }),
  });

  const data = await response.json();
  dispatch(setTransaction(data.balance, data.transaction));
};

export const withdrawMoney = (amount) => async (dispatch) => {
  console.log("redux", amount);
  const response = await csrfFetch("/api/transactions/withdraw", {
    method: "POST",
    body: JSON.stringify({
      amount,
    }),
  });

  const data = await response.json();
  dispatch(setTransaction(data.balance, data.transaction));
};

const transactionsReducer = (
  state = { accountTransactions: [], stockTransactions: [] },
  action
) => {
  switch (action.type) {
    case GET_TRANSACTIONS:
      return {
        ...state,
        accountTransactions: [...action.transactions],
        stockTransactions: [...state.stockTransactions],
      };
    case GET_STOCK_TRANSACTIONS:
      return {
        ...state,
        stockTransactions: [...action.transactions],
        accountTransactions: [...state.accountTransactions],
      };
    case SET_TRANSACTION:
      return {
        ...state,
        accountTransactions: [...state.accountTransactions, action.transaction],
        stockTransactions: [...state.stockTransactions],
      };
    case BUY_STOCK:
      return {
        ...state,
        stockTransactions: [...state.stockTransactions, action.transaction],
        accountTransactions: [...state.accountTransactions],
      };
    default:
      return state;
  }
};

export default transactionsReducer;
