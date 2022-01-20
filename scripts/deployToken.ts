// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";
// import { sleep } from "../utils";

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  const TokenFactory = await ethers.getContractFactory("ClashToken");
  const clashToken = await TokenFactory.deploy("Chibi Clash", "CLASH");

  await clashToken.deployed();
  console.log("Token deployed:", clashToken.address);

  // console.log(`Pausing 3-4 blocks in order to verify Contract`);
  // await sleep({seconds: 15 * 4});
  // console.log(`Pause finished. Verifying Contract`);

  // try {
  //   await run("verify:verify", {
  //     address: clashToken.address,
  //     constructorArguments: ['Clash', 'CLASH']
  //   });
  //   console.log("Token deployed and verified to:", clashToken.address);

  // } catch (err) {
  //   console.error('Error veryfing Contract. Reason:', err);
  // }

  console.log(`Contract deployed successfully`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
