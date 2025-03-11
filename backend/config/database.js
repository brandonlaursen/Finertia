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
    },
    define: {
      schema: process.env.SCHEMA,
    },
    pool: {
      max: 10, // Maximum number of connections
      min: 1, // Minimum number of connections
      acquire: 120000, // How long to try getting a connection before timing out (ms)
      idle: 10000, // Time (ms) before closing an idle connection
    },
  },
};
