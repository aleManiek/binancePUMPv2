require("dotenv").config();
const fs = require("fs");
const ccxt = require("ccxt");

const apiKey = process.env.APIKEY;
const secret = process.env.SECRET;
const exchangeName = process.env.EXCHANGE;

const exchange = new ccxt[exchangeName]({
  apiKey,
  secret,
});

(async function () {
  const markets = await exchange.loadMarkets();
  const json = JSON.stringify(markets);

  fs.writeFile("marketInfo.json", json, "utf-8", (err) => {
    if (err) console.log("Błąd", err);
    else {
      console.log("Zapisano do pliku");
    }
  });
})();
