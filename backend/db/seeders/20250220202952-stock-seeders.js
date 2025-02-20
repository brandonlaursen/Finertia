"use strict";
require("dotenv").config();

const { Stock } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

const data = {
  AAPL: { ticker: "AAPL", name: "Apple Inc." },
  MSFT: { ticker: "MSFT", name: "Microsoft Corporation" },
  AMZN: { ticker: "AMZN", name: "Amazon.com, Inc." },
  GOOGL: { ticker: "GOOGL", name: "Alphabet Inc. (Class A)" },
  GOOG: { ticker: "GOOG", name: "Alphabet Inc. (Class C)" },
  "BRK.A": { ticker: "BRK.A", name: "Berkshire Hathaway Inc. (Class A)" },
  "BRK.B": { ticker: "BRK.B", name: "Berkshire Hathaway Inc. (Class B)" },
  TSLA: { ticker: "TSLA", name: "Tesla, Inc." },
  NVDA: { ticker: "NVDA", name: "NVIDIA Corporation" },
  JNJ: { ticker: "JNJ", name: "Johnson & Johnson" },
  V: { ticker: "V", name: "Visa Inc." },
  UNH: { ticker: "UNH", name: "UnitedHealth Group Incorporated" },
  META: { ticker: "META", name: "Meta Platforms, Inc." },
  XOM: { ticker: "XOM", name: "Exxon Mobil Corporation" },
  JPM: { ticker: "JPM", name: "JPMorgan Chase & Co." },
  PG: { ticker: "PG", name: "The Procter & Gamble Company" },
  MA: { ticker: "MA", name: "Mastercard Incorporated" },
  HD: { ticker: "HD", name: "The Home Depot, Inc." },
  CVX: { ticker: "CVX", name: "Chevron Corporation" },
  PFE: { ticker: "PFE", name: "Pfizer Inc." },
  ABBV: { ticker: "ABBV", name: "AbbVie Inc." },
  KO: { ticker: "KO", name: "The Coca-Cola Company" },
  PEP: { ticker: "PEP", name: "PepsiCo, Inc." },
  BAC: { ticker: "BAC", name: "Bank of America Corporation" },
  MRK: { ticker: "MRK", name: "Merck & Co., Inc." },
  DIS: { ticker: "DIS", name: "The Walt Disney Company" },
  NFLX: { ticker: "NFLX", name: "Netflix, Inc." },
  ADBE: { ticker: "ADBE", name: "Adobe Inc." },
  CMCSA: { ticker: "CMCSA", name: "Comcast Corporation" },
  VZ: { ticker: "VZ", name: "Verizon Communications Inc." },
  INTC: { ticker: "INTC", name: "Intel Corporation" },
  CSCO: { ticker: "CSCO", name: "Cisco Systems, Inc." },
  T: { ticker: "T", name: "AT&T Inc." },
  WMT: { ticker: "WMT", name: "Walmart Inc." },
  NKE: { ticker: "NKE", name: "NIKE, Inc." },
  ORCL: { ticker: "ORCL", name: "Oracle Corporation" },
  ABT: { ticker: "ABT", name: "Abbott Laboratories" },
  MCD: { ticker: "MCD", name: "McDonald's Corporation" },
  CRM: { ticker: "CRM", name: "salesforce.com, inc." },
  PYPL: { ticker: "PYPL", name: "PayPal Holdings, Inc." },
  TMO: { ticker: "TMO", name: "Thermo Fisher Scientific Inc." },
  COST: { ticker: "COST", name: "Costco Wholesale Corporation" },
  AMGN: { ticker: "AMGN", name: "Amgen Inc." },
  DHR: { ticker: "DHR", name: "Danaher Corporation" },
  QCOM: { ticker: "QCOM", name: "QUALCOMM Incorporated" },
  TXN: { ticker: "TXN", name: "Texas Instruments Incorporated" },
  LLY: { ticker: "LLY", name: "Eli Lilly and Company" },
  AVGO: { ticker: "AVGO", name: "Broadcom Inc." },
  MDT: { ticker: "MDT", name: "Medtronic plc" },
  UNP: { ticker: "UNP", name: "Union Pacific Corporation" },
  NEE: { ticker: "NEE", name: "NextEra Energy, Inc." },
  HON: { ticker: "HON", name: "Honeywell International Inc." },
  BMY: { ticker: "BMY", name: "Bristol-Myers Squibb Company" },
  LIN: { ticker: "LIN", name: "Linde plc" },
  PM: { ticker: "PM", name: "Philip Morris International Inc." },
  ACN: { ticker: "ACN", name: "Accenture plc" },
  UPS: { ticker: "UPS", name: "United Parcel Service, Inc." },
  MS: { ticker: "MS", name: "Morgan Stanley" },
  SCHW: { ticker: "SCHW", name: "The Charles Schwab Corporation" },
  BABA: { ticker: "BABA", name: "Alibaba Group Holding Limited" },
  WFC: { ticker: "WFC", name: "Wells Fargo & Company" },
  RTX: { ticker: "RTX", name: "Raytheon Technologies Corporation" },
  CVS: { ticker: "CVS", name: "CVS Health Corporation" },
  BA: { ticker: "BA", name: "The Boeing Company" },
  C: { ticker: "C", name: "Citigroup Inc." },
  IBM: {
    ticker: "IBM",
    name: "International Business Machines Corporation",
  },
  GS: { ticker: "GS", name: "The Goldman Sachs Group, Inc." },
  BLK: { ticker: "BLK", name: "BlackRock, Inc." },
  SPGI: { ticker: "SPGI", name: "S&P Global Inc." },
  MMM: { ticker: "MMM", name: "3M Company" },
  GE: { ticker: "GE", name: "General Electric Company" },
  AXP: { ticker: "AXP", name: "American Express Company" },
  LOW: { ticker: "LOW", name: "Lowe's Companies, Inc." },
  SBUX: { ticker: "SBUX", name: "Starbucks Corporation" },
  MO: { ticker: "MO", name: "Altria Group, Inc." },
  INTU: { ticker: "INTU", name: "Intuit Inc." },
  MDLZ: { ticker: "MDLZ", name: "Mondelez International, Inc." },
  AMT: { ticker: "AMT", name: "American Tower Corporation" },
  ISRG: { ticker: "ISRG", name: "Intuitive Surgical, Inc." },
  PLD: { ticker: "PLD", name: "Prologis, Inc." },
  NVO: { ticker: "NVO", name: "Novo Nordisk A/S" },
  TMUS: { ticker: "TMUS", name: "T-Mobile US, Inc." },
  SAP: { ticker: "SAP", name: "SAP SE" },
  SNY: { ticker: "SNY", name: "Sanofi" },
  RY: { ticker: "RY", name: "Royal Bank of Canada" },
  TD: { ticker: "TD", name: "The Toronto-Dominion Bank" },
  SONY: { ticker: "SONY", name: "Sony Group Corporation" },
  BHP: { ticker: "BHP", name: "BHP Group Limited" },
  UL: { ticker: "UL", name: "Unilever PLC" },
  ENB: { ticker: "ENB", name: "Enbridge Inc." },
  SHOP: { ticker: "SHOP", name: "Shopify Inc." },
  DEO: { ticker: "DEO", name: "Diageo plc" },
  BNS: { ticker: "BNS", name: "The Bank of Nova Scotia" },
  RIO: { ticker: "RIO", name: "Rio Tinto Group" },
  BAM: { ticker: "BAM", name: "Brookfield Asset Management Inc." },
  CNQ: { ticker: "CNQ", name: "Canadian Natural Resources Limited" },
  BP: { ticker: "BP", name: "BP p.l.c." },
  EQNR: { ticker: "EQNR", name: "Equinor ASA" },
  NVS: { ticker: "NVS", name: "Novartis AG" },

  AZN: { ticker: "AZN", name: "AstraZeneca PLC" },
  SHEL: { ticker: "SHEL", name: "Shell plc" },
  TOT: { ticker: "TOT", name: "TotalEnergies SE" },
  PTR: { ticker: "PTR", name: "PetroChina Company Limited" },
  BIDU: { ticker: "BIDU", name: "Baidu, Inc." },
  JD: { ticker: "JD", name: "JD.com, Inc." },
  PDD: { ticker: "PDD", name: "Pinduoduo Inc." },
  TCEHY: { ticker: "TCEHY", name: "Tencent Holdings Limited" },
  MELI: { ticker: "MELI", name: "MercadoLibre, Inc." },
  INFY: { ticker: "INFY", name: "Infosys Limited" },
  WIT: { ticker: "WIT", name: "Wipro Limited" },
  HDB: { ticker: "HDB", name: "HDFC Bank Limited" },
  IBN: { ticker: "IBN", name: "ICICI Bank Limited" },
  VALE: { ticker: "VALE", name: "Vale S.A." },
  PBR: { ticker: "PBR", name: "Petróleo Brasileiro S.A. - Petrobras" },
  SCCO: { ticker: "SCCO", name: "Southern Copper Corporation" },
  AMX: { ticker: "AMX", name: "América Móvil, S.A.B. de C.V." },
  CHL: { ticker: "CHL", name: "China Mobile Limited" },
  CHA: { ticker: "CHA", name: "China Telecom Corporation Limited" },
  CHU: { ticker: "CHU", name: "China Unicom (Hong Kong) Limited" },
  NTES: { ticker: "NTES", name: "NetEase, Inc." },
  TME: { ticker: "TME", name: "Tencent Music Entertainment Group" },
  EDU: {
    ticker: "EDU",
    name: "New Oriental Education & Technology Group Inc.",
  },
  TAL: { ticker: "TAL", name: "TAL Education Group" },
  YUMC: { ticker: "YUMC", name: "Yum China Holdings, Inc." },
  LFC: { ticker: "LFC", name: "China Life Insurance Company Limited" },
  SNP: { ticker: "SNP", name: "China Petroleum & Chemical Corporation" },
  CEO: { ticker: "CEO", name: "CNOOC Limited" },
  ACH: { ticker: "ACH", name: "Aluminum Corporation of China Limited" },
  ZNH: { ticker: "ZNH", name: "China Southern Airlines Company Limited" },
  CEA: {
    ticker: "CEA",
    name: "China Eastern Airlines Corporation Limited",
  },
  GSH: { ticker: "GSH", name: "Guangshen Railway Company Limited" },
  SHI: {
    ticker: "SHI",
    name: "Sinopec Shanghai Petrochemical Company Limited",
  },
  HNP: { ticker: "HNP", name: "Huaneng Power International, Inc." },
  JKS: { ticker: "JKS", name: "JinkoSolar Holding Co., Ltd." },
  DQ: { ticker: "DQ", name: "Daqo New Energy Corp." },
  YGE: {
    ticker: "YGE",
    name: "Yingli Green Energy Holding Company Limited",
  },
  TSM: {
    ticker: "TSM",
    name: "Taiwan Semiconductor Manufacturing Company Limited",
  },
  ASML: { ticker: "ASML", name: "ASML Holding N.V." },
  ERIC: { ticker: "ERIC", name: "Telefonaktiebolaget LM Ericsson" },
  NOK: { ticker: "NOK", name: "Nokia Corporation" },
  PHG: { ticker: "PHG", name: "Koninklijke Philips N.V." },
  ING: { ticker: "ING", name: "ING Groep N.V." },
  BBVA: { ticker: "BBVA", name: "Banco Bilbao Vizcaya Argentaria, S.A." },
  SAN: { ticker: "SAN", name: "Banco Santander, S.A." },
  TEF: { ticker: "TEF", name: "Telefónica, S.A." },
  ORAN: { ticker: "ORAN", name: "Orange S.A." },
  VOD: { ticker: "VOD", name: "Vodafone Group Plc" },
  BTI: { ticker: "BTI", name: "British American Tobacco p.l.c." },
  GSK: { ticker: "GSK", name: "GlaxoSmithKline plc" },
  HSBC: { ticker: "HSBC", name: "HSBC Holdings plc" },
  BUD: { ticker: "BUD", name: "Anheuser-Busch InBev SA/NV" },
  TTE: { ticker: "TTE", name: "TotalEnergies SE" },
  BBL: { ticker: "BBL", name: "BHP Group Plc" },
  SMFG: { ticker: "SMFG", name: "Sumitomo Mitsui Financial Group, Inc." },
  CS: { ticker: "CS", name: "Credit Suisse Group AG" },
  DB: { ticker: "DB", name: "Deutsche Bank Aktiengesellschaft" },
  UBS: { ticker: "UBS", name: "UBS Group AG" },
  LYG: { ticker: "LYG", name: "Lloyds Banking Group plc" },
  WBK: { ticker: "WBK", name: "Westpac Banking Corporation" },
  ANZBY: {
    ticker: "ANZBY",
    name: "Australia and New Zealand Banking Group Limited",
  },
  NABZY: { ticker: "NABZY", name: "National Australia Bank Limited" },
  BCS: { ticker: "BCS", name: "Barclays PLC" },
  RBS: { ticker: "RBS", name: "The Royal Bank of Scotland Group plc" },
  SCGLY: { ticker: "SCGLY", name: "Société Générale Société anonyme" },
  BNPQY: { ticker: "BNPQY", name: "BNP Paribas S.A." },
  DBSDY: { ticker: "DBSDY", name: "DBS Group Holdings Ltd" },
  MFG: { ticker: "MFG", name: "Mizuho Financial Group, Inc." },
  MUFG: { ticker: "MUFG", name: "Mitsubishi UFJ Financial Group, Inc." },
  KB: { ticker: "KB", name: "KB Financial Group Inc." },
  SHG: { ticker: "SHG", name: "Shinhan Financial Group Co., Ltd." },
  WF: { ticker: "WF", name: "Woori Financial Group Inc." },
  MTU: { ticker: "MTU", name: "Mitsubishi UFJ Financial Group, Inc." },
  NMR: { ticker: "NMR", name: "Nomura Holdings, Inc." },
  IX: { ticker: "IX", name: "ORIX Corporation" },
  ITUB: { ticker: "ITUB", name: "Itaú Unibanco Holding S.A." },
  BBD: { ticker: "BBD", name: "Banco Bradesco S.A." },
  BSBR: { ticker: "BSBR", name: "Banco Santander (Brasil) S.A." },
  BBAS3: { ticker: "BBAS3", name: "Banco do Brasil S.A." },
  BAP: { ticker: "BAP", name: "Credicorp Ltd." },
  GGAL: { ticker: "GGAL", name: "Grupo Financiero Galicia S.A." },
  BMA: { ticker: "BMA", name: "Banco Macro S.A." },
  SUPV: { ticker: "SUPV", name: "Grupo Supervielle S.A." },
  BBAR: { ticker: "BBAR", name: "Banco BBVA Argentina S.A." },
  PAM: { ticker: "PAM", name: "Pampa Energía S.A." },
  YPF: { ticker: "YPF", name: "YPF Sociedad Anónima" },
  CEPU: { ticker: "CEPU", name: "Central Puerto S.A." },
  EDN: { ticker: "EDN", name: "Empresa Distribuidora y Comercialize" },
};

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = "Stocks";
    try {
      const stocks = [];

      async function createStockSeeders() {
        for (let stock in data) {
          const response = await fetch(
            `https://api.polygon.io/v3/reference/tickers/${stock}?apiKey=${process.env.STOCK_API_KEY2}`
          );

          const stockData = await response.json();
          if (stockData.status === "NOT_FOUND") {
            continue;
          }

          const {
            name,
            market_cap = "",
            address = "",
            description = "",
            total_employees = "",
            sic_description = "",
          } = stockData?.results;

          const newAddress = `${address.city || ""}, ${address.state || ""}`;

          const stockSeed = {
            stockName: name,
            stockSymbol: data[stock].ticker,
            address: newAddress || "-",
            description: description || "-",
            totalEmployees: `${total_employees}` || "-",
            marketCap: `${market_cap}` || "-",
            industry: sic_description || "-",
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          stocks.push(stockSeed);
        }
      }

      await createStockSeeders();
      await Stock.bulkCreate(stocks, { validate: true });
    } catch (e) {
      console.log(e);
    }
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = "Stocks";
    await queryInterface.dropTable(options);
  },
};
