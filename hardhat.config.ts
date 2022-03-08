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

const { INFURA_KEY, ETHERSCAN_API_KEY, PRIVATE_KEY, PRIVATE_KEY_TESTNET } =
  process.env;

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
      // forking: {
      //   url: `https://mainnet.infura.io/v3/${INFURA_KEY}`,
      //   accounts: [PRIVATE_KEY_TESTNET],
      // },
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
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
};
