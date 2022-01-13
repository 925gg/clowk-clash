// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers, run } from "hardhat";
import { availableConfigFiles, VestingSettings } from "../utils";


async function main() {
  const {configFile} = process.env;
  if(!availableConfigFiles.includes(configFile as string)) throw new Error('Invalid Config File');

  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  const TokenFactory = await ethers.getContractFactory("ClashToken");
  const clashToken = await TokenFactory.deploy('Clash', 'CLASH');

  await clashToken.deployed();
  console.log("Token deployed:", clashToken.address);

  
  // Verifying contract
  try {
    await run("verify:verify", {
      address: clashToken.address,
      constructorArguments: ['Clash', 'CLASH']
    });
    console.log("Token deployed and verified to:", clashToken.address);
    
  } catch (err) {
    console.error('Error veryfing Contract. Reason:', err);
  }


  const token = clashToken.address;




  const {vestingName, lockupTime, unlockEvents} = await import(`../vestingSettings/${configFile}`) as VestingSettings;

  console.log(unlockEvents);

  // We get the contract to deploy
  const VestingFactory = await ethers.getContractFactory("Vesting");
  const vesting = await VestingFactory.deploy(token, lockupTime, vestingName);

  await vesting.deployed();
  console.log("Vesting deployed:", vesting.address);


  // await new Promise(resolve => setTimeout(resolve, 60000)); // pause 3-4 blocks for etherscan update

  try {
    await run("verify:verify", {
      address: vesting.address,
      constructorArguments: [token, lockupTime, vestingName]
    });
  
    console.log("Vesting deployed and verified to:", vesting.address);
    
  } catch (err) {
    console.error('Error veryfing Contract. Reason:', err);
  }


  await (await vesting.addUnlockEvents(
    unlockEvents.map(e => e.amount),
    unlockEvents.map(e => e.unlockTime),
  )).wait(1);

  console.log('Unlock Events', await vesting.getUnlockEvents());


}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
