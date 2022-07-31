require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");
require('hardhat-deploy');

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.9",
  networks: {
    hardhat: {
      chainId: 3,
      forking: {
        url: process.env.RPC_URL,
      }
    },
    ropsten: {
      url: process.env.RPC_URL,
      accounts: { mnemonic: process.env.MNEMONIC }
    }
  }
};
