import { csrfFetch } from "./csrf";

const GET_TRANSACTIONS = "transactions/GET_TRANSACTIONS";
const SET_TRANSACTION = "transactions/SET_TRANSACTION";

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
      return { ...state, accountTransactions: [...action.transactions] };
    case SET_TRANSACTION:
      return {
        ...state,
        accountTransactions: [
          ...state.accountTransactions,
          action.transaction,
        ],
      };
    default:
      return state;
  }
};

export default transactionsReducer;
