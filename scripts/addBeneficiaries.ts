// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";
import { Vesting } from "../typechain-types";

const testAccounts = [
  "0xc5ddE77926D3846301dE931e4128c92fAd2A4499", // Thinh
  "0x07E6991e07cF310Ab586c1d98Df4009cAB5C16F5",
  "0xAF49b1b5135b85e5D70A44f8De60A9ac24b24474", // Tung
  "0x5fA4F33329522Af9f32bf4cc74508E540C91a5Db", // Company wallet
  "0xcB5C7eA84F0DC23fBbF1133d9d9BC1421A10ea47", // Pedro
  "0x1be393F5248A15A9E3e6c04Dcbbf9eDD7FBd7Cf5", // itzBolt
  "0x4bA03B3E53CDA5F6dEB8109490d0a1D89EF99555", // Jason
  "0x447Ef36e78505E98EB98fE3105526AAFddCe80b2", // Alixto
  "0x8d3c8186544aE4A14A9D7733564bffd3039666bD", // Tim
  "0x89955Ad8fc009374949d9FBa93Bc497aB102bF4C", // Thieu
];

async function main() {
  const { VESTING_ADDRESS } = process.env;
  const VestingFactory = await ethers.getContractFactory("Vesting");
  const vestingContract = VestingFactory.attach(
    VESTING_ADDRESS as string
  ) as Vesting;
  const tx = await vestingContract.addBeneficiaries(
    testAccounts,
    testAccounts.map((_acc) => ethers.utils.parseEther("1000000"))
  );
  await tx.wait();
  console.log("Vesting contract", VESTING_ADDRESS);
  console.log("Added Beneficiaries");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
