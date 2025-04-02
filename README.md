# Finertia

Live Link: [Finertia](https://finertia.onrender.com/)

Finertia is a sleek, full-stack stock trading simulator that mirrors real-time market behavior with a rich, user-friendly interface. Built for users who want the excitement of investing without the financial risk, Finertia empowers you to buy, sell, track, and manage your portfolio just like a real trader.

Inspired by platforms like Robinhood, Finertia blends intuitive UI with powerful backend logic to give users a realistic, educational, and fun trading experience.

Whether you're a beginner learning the ropes or a seasoned investor testing strategies — Finertia gives you the tools to build confidence in the market.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)

## Features

- 📈 Live market simulation using aggregated stock data

- 💸 Real-time stock buying & selling with historical price tracking

- 🗂️ Custom stock lists and watch lists to stay organized

- 🌗 Dark mode and customizable themes for a personalized experience

- 📊 Track portfolio growth over time with clean visual insights

- ⚡ Fully responsive for both mobile and desktop users

## Technologies Used

- **Frontend**:

![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Redux](https://img.shields.io/badge/redux-%23593d88.svg?style=for-the-badge&logo=redux&logoColor=white)
![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)

- **Backend**:

![Node](https://img.shields.io/badge/node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![Sequelize](https://img.shields.io/badge/Sequelize-52B0E7?style=for-the-badge&logo=Sequelize&logoColor=white)

- **Database**:

![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Sqlite3](https://img.shields.io/badge/sqlite3-003B57?style=for-the-badge&logo=sqlite&logoColor=white)

- **APIs**:

![PolygonAPI](https://img.shields.io/badge/Polygon%20API-Act) ![FinnHubAPI](https://img.shields.io/badge/Finnhub%20API-Act)

## Installation

To get a local copy up and running, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/brandonlaursen/finertia.git
   ```

## Backend

2. Install the dependencies for the backend:

   ```bash
   cd finertia/backend
   npm install
   ```

3. Set up your environment variables. Create a `.env` file in the backend directory and add the necessary variables (e.g., database connection string, API keys).
   ```bash
   PORT=8000
   DB_FILE=db/dev.db
   JWT_SECRET=«generate_strong_secret_here»
   JWT_EXPIRES_IN=604800
   SCHEMA=«custom_schema_name_here»
   STOCK_API_KEY=«finhub-api-key-here»
   STOCK_API_KEY2=«polygon-api-key-here»
    ```

- Note you will need to setup a free API key with
  - [Polygon API](https://polygon.io/)
  - [FinnHub](https://finnhub.io/)

4. Start the backend server:

   ```bash
   npm start
   ```

## Frontend

5. Navigate to the frontend directory:

   ```bash
   cd finertia/frontend
   ```

6. Install the dependencies for the frontend:

   ```bash
   npm install
   ```

7. Run the server
   ```bash
   npm run dev
   ```

## Usage

1. Open your browser and navigate to `http://localhost:5173`.
2. Create a new account or log in with an existing account.
3. Explore the features, manage your portfolio, and customize your theme.


## Live Screenshots

### Home Page
