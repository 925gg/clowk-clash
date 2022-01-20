// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";
// eslint-disable-next-line node/no-missing-import
import { Vesting } from "../typechain-types";
// eslint-disable-next-line node/no-missing-import
import { availableConfigFiles, VestingSettings } from "../utils";

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  const { CONFIG_FILE, TOKEN_ADDRESS } = process.env;
  if (!availableConfigFiles.includes(CONFIG_FILE as string))
    throw new Error("Invalid Config File");

  // eslint-disable-next-line node/no-unsupported-features/es-syntax
  const { vestingName, start, unlockEvents } = (await import(
    `../vestingSettings/${CONFIG_FILE}`
  )) as VestingSettings;

  console.log(`Vesting Start Timestamp: ${start}`);
  // We get the contract to deploy
  const VestingFactory = await ethers.getContractFactory("Vesting");
  const vesting = (await VestingFactory.deploy(
    TOKEN_ADDRESS,
    start,
    vestingName
  )) as Vesting;

  await vesting.deployed();
  console.log(`Vesting ${vestingName} deployed: ${vesting.address}`);

  await (
    await vesting.addUnlockEvents(
      unlockEvents.map((e) => e.percent),
      unlockEvents.map((e) => e.unlockTime)
    )
  ).wait();

  console.log(`Unlock events added`);

  // console.log('Unlock Events', await vesting.getUnlockEvents());

  // console.log(`Pausing 3-4 blocks in order to verify Contract`);
  // await sleep({seconds: 15 * 4});
  // console.log(`Pause finished. Verifying Contract`);

  // try {
  //   await run("verify:verify", {
  //     address: vesting.address,
  //     constructorArguments: [TOKEN_ADDRESS, start, vestingName]
  //   });

  //   console.log("Vesting deployed and verified to:", vesting.address);

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
