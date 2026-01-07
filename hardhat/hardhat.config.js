require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config({path: '../backend/.env'});

module.exports = {
  solidity: "0.8.19",
  networks: {
    sepolia: {
      url: process.env.INFURA_URL,
      accounts: [process.env.PRIVATE_KEY]
    }
  }
};