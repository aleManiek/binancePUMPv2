require('dotenv').config();
const fs = require('fs');
const ccxt = require('ccxt');

const apiKey = process.env.APIKEY;
const secret = process.env.SECRET;
const exchangeName = process.env.EXCHANGE;

const amount = process.env.AMOUNT;
const estimatedProfit = process.env.ESTIMATED_PROFIT;
const ticker = process.argv[2];
const coin = process.env.COIN;
const symbol = `${ticker}/${coin}`;

const exchange = new ccxt[exchangeName]({
  apiKey,
  secret,
  enableRateLimit: true,
});

const params = {
  quoteOrderQty: amount,
};

const file = fs.readFileSync('marketInfo.json');
const marketInfo = JSON.parse(file);

(async function () {
  const { amount: precisionAmount, price: precisionPrice } = marketInfo[symbol].precision;
  const { taker } = marketInfo[symbol];
  const { amount, trades } = await exchange.createOrder(symbol, 'market', 'buy', undefined, undefined, params);
  console.log(`Kupiono ${amount}`);
  const amountToSell = amount * (1 - taker).toFixed(precisionAmount);
  const price = (trades[trades.length - 1].price * estimatedProfit).toFixed(precisionPrice);
  const sell = await exchange.createOrder(symbol, 'limit', 'sell', amountToSell, price);
  console.log(sell);
  console.log(`Wystawiono za ${price}`);
})();
