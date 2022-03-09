import { expect } from "chai";
import { ethers } from "hardhat";
import {
  availableConfigFiles,
  errorReason,
  // eslint-disable-next-line node/no-missing-import
} from "../utils";
// eslint-disable-next-line node/no-missing-import
import { ClashToken } from "../typechain-types";

describe("ClashToken", function () {
  const CONFIG_FILE = `privateRound`;
  if (!availableConfigFiles.includes(CONFIG_FILE as string))
    throw new Error("Invalid Config File");

  let clashToken: ClashToken;
  let account: string;

  it("Should deploy Token", async function () {
    account = await ethers.provider.getSigner().getAddress();
    const TokenFactory = await ethers.getContractFactory("ClashToken");
    clashToken = (await TokenFactory.deploy(
      "Chibi Clash",
      "CLASH",
      account
    )) as ClashToken;

    await clashToken.deployed();
    console.log("Token deployed:", clashToken.address);
  });

  it("Should not let a user withdraw ERC20 tokens if he is not the owner", async function () {
    let errorMessage = "";
    try {
      const unauthorizedUser = (await ethers.getSigners())[1];
      const contract = clashToken.connect(unauthorizedUser);

      const withdrawAllERC20Tx = await contract.withdrawAllERC20(
        clashToken.address
      );
      await withdrawAllERC20Tx.wait();
    } catch (err: any) {
      errorMessage = errorReason(err.message);
    }
    expect(errorMessage).to.eq("Ownable: caller is not the owner");
  });

  it("Should let owner withdraw all tokens", async function () {
    const mintTx = await clashToken.transfer(
      clashToken.address,
      ethers.utils.parseEther("1")
    );
    await mintTx.wait();

    let currentOwnerBalance = await clashToken.balanceOf(account);
    let currentContractBalance = await clashToken.balanceOf(clashToken.address);
    const total = currentOwnerBalance.add(currentContractBalance);

    const withdrawAllERC20Tx = await clashToken.withdrawAllERC20(
      clashToken.address
    );
    await withdrawAllERC20Tx.wait();

    currentOwnerBalance = await clashToken.balanceOf(account);
    currentContractBalance = await clashToken.balanceOf(clashToken.address);
    expect(currentOwnerBalance.eq(total)).to.be.eq(true);
    expect(currentContractBalance.toNumber()).to.eq(0);
  });

  it("Should not let a user withdraw tokens if balance is 0", async function () {
    let errorMessage = "";
    try {
      const withdrawAllERC20Tx = await clashToken.withdrawAllERC20(
        clashToken.address
      );
      await withdrawAllERC20Tx.wait();
    } catch (err: any) {
      errorMessage = errorReason(err.message);
    }
    expect(errorMessage).to.eq("Balance must be greater than 0");
  });
});
