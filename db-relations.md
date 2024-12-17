# Database Schema



## Users

| Field            | Type         |
|------------------|--------------|
| `id`  | INT (PK)     |
| `firstName` | VARCHAR
| `lastName`        | VARCHAR
| `username` | VARCHAR      |
| `balance` | DECIMAL
| `email` | VARCHAR
| `profilePic` | VARCHAR
| `hashedPassword` | VARCHAR


---

## UserTransactions

| Field            | Type         |
|------------------|--------------|
| `id`  | INT (PK)     |
| `userId`        | INT (FK)     |
| `amount`        | DECIMAL       |
| `transactionType` | VARCHAR      |
| `transactionDate` | TIMESTAMP    |

---

## Stocks
| Field           | Type      |
|------------------|------------|
| `id`       | INT (PK)  |
| `stockName`     | VARCHAR   |
| `stockSymbol`   | VARCHAR   |
| `currentPrice`   | VARCHAR   |
| `marketCap`     | DECIMAL   |

---

## StockLists
| Field           | Type      |
|------------------|-----------|
| `id`  | INT (PK)     |
| `name`          | VARCHAR   |
| `type`          | VARCHAR   |
| `userId`        | INT (FK)  |


---

## StockListJoins
| Field           | Type      |
|------------------|-----------|
| `id`  | INT (PK)     |
| `stockId`       | INT (FK)  |
| `stockListId`        | INT (FK)  |

---

## StockUserTransaction
| Field           | Type      |
|------------------|-----------|
| `id`  | INT (PK)     |
| `userId`        | INT (FK)  |
| `stockId`       | INT (FK)  |
| `transactionType` | VARCHAR   |
| `quantity`      | INT       |
| `purchasePrice`  | DECIMAL   |
| `purchaseDate`   | TIMESTAMP |
