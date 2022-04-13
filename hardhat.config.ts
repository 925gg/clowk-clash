/* eslint-disable import/first */
import * as dotenv from "dotenv";

dotenv.config();

import "@nomiclabs/hardhat-truffle5";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-web3";
import "solidity-coverage";
import "@typechain/hardhat";
import "@nomiclabs/hardhat-waffle";

/**
 * @type import('hardhat/config').HardhatUserConfig
 */

const {
  INFURA_KEY,
  ETHERSCAN_API_KEY,
  PRIVATE_KEY,
  PRIVATE_KEY_TESTNET,
  MUMBAI_RPC_URL,
  MUMBAI_PRIVATE_KEY,
  POLYGON_RPC_URL,
  POLYGON_PRIVATE_KEY,
  POLYGON_API_KEY,
} = process.env;

module.exports = {
  solidity: {
    version: "0.8.1",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      forking: {
        url: POLYGON_RPC_URL,
      },
    },
    mainnet: {
      url: `https://mainnet.infura.io/v3/${INFURA_KEY}`,
      accounts: [PRIVATE_KEY],
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${INFURA_KEY}`,
      accounts: [PRIVATE_KEY_TESTNET],
    },
    ropsten: {
      url: `https://ropsten.infura.io/v3/${INFURA_KEY}`,
      accounts: [PRIVATE_KEY_TESTNET],
    },
    kovan: {
      url: `https://kovan.infura.io/v3/${INFURA_KEY}`,
      accounts: [PRIVATE_KEY_TESTNET],
    },
    polygon: {
      url: POLYGON_RPC_URL,
      accounts: [POLYGON_PRIVATE_KEY],
    },
    mumbai: {
      url: MUMBAI_RPC_URL,
      accounts: [MUMBAI_PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: POLYGON_API_KEY,
  },
};
