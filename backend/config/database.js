const config = require("./index");

module.exports = {
  development: {
    storage: config.dbFile,
    dialect: "sqlite",
    seederStorage: "sequelize",
    logQueryParameters: true,
    typeValidation: true,
    logging: false, // remove to see queries
  },
  production: {
    use_env_variable: "DATABASE_URL",
    dialect: "postgres",
    seederStorage: "sequelize",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
      // keepAlive: true, // Keeps connection alive
      statement_timeout: 120000,
      query_timeout: 120000,
    },
    pool: {
      // max: 10, // Max connections (adjust based on Render's plan)
      // min: 1, // Keep at least 1 connection open
      acquire: 120000, // 15 minutes (wait time to get a connection)
      idle: 30000, // Close idle connections after 30 seconds
    },
    define: {
      schema: process.env.SCHEMA,
    },
  },
};
