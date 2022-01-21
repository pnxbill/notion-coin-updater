const { Client } = require('@notionhq/client');
const axios = require('axios');
require('dotenv').config();

const notion = new Client({ auth: process.env.NOTION_API_KEY });

const blockId = process.env.NOTION_BLOCK_ID;

// Get the current price of a coin via binance API.
const getCurrentPrice = async (acronym) => {
  const res = await axios.get(`https://api.binance.com/api/v3/ticker/price?symbol=${acronym}USDT`); 
  return String(parseFloat(res.data.price).toFixed(2));
}

// Get a list of the coins listed in notion table and their block ids,
// to be used when updating the coin price.
//
// **returns**: A promise that resolves with an array of objects cointaining 
// the coin acronym and block id.
// ex: [{ acronym: 'BTC', block_id: 'c6b4a50083fa4a11946a54e2f278bdf7' }]
const getAllCoins = async () => {
  const response = await notion.blocks.children.list({
    block_id: blockId,
    page_size: 50,
  });

  return response.results.slice(1).map(block => {
      const key = block.id;
      const acronym = block.table_row.cells[0][0].text.content;

      return { key, acronym };
    });
};

// Update the price of a coin in the notion table.
// **params**: 
// - `coin`: The coin object returned from getAllCoins containing the 
// coin acronym and block id.
// - `coinPrice`: The current price of the coin.
async function updateCoinPrice({ key: block_id, acronym }, coinPrice) {
   try {
     await notion.blocks.update({
      block_id,
      table_row: {
        cells: [[
          {
            type: "text",
            text: {
              content: acronym
            }
          }
        ], [
          {
            type: "text",
            text: {
              content: coinPrice
            }
          }
        ], []],
      }
    });
  } catch(ex) {
    console.log(ex)
  }
};

const main = () => {
  getAllCoins().then(async coins => {
    for (const coin of coins) {
      const coinPrice = await getCurrentPrice(coin.acronym);
      await updateCoinPrice(coin, coinPrice);
      console.log('updated: ', coin.acronym,' = ', coinPrice);
    }

    console.log('DONE', `Next update in ${process.env.NOTION_UPDATE_INTERVAL} seconds`);
    const updateIntervalInSeconds = 1000 * process.env.NOTION_UPDATE_INTERVAL;
    setTimeout(main, updateIntervalInSeconds);
  });
}

main();







