# notion-coin-updater

## Description
This implementation is a bot that will run periodically getting the list of coins inside a Notion table and updating their prices automatically by using the Binance API.

## Requirements
- Node.js: ^12.22.7

## How to use
- Clone the repository
- Install the dependencies using yarn or npm (npm install)
- Create a .env file containing the following keys
  1. NOTION_API_KEY (The required key given when you create an integration inside notion)
  2. NOTION_BLOCK_ID (The block ID for the table, don't forget that you have to manually add the integration to the page that contains the table)
  3. NOTION_UPDATE_INTERVAL (In seconds)
- Run the application using `yarn start` or `npm start`
