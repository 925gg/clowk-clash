import { expect } from "chai";
// import chai from "chai";
// import { web3 } from "hardhat";
import hre, { ethers } from "hardhat";
// eslint-disable-next-line node/no-missing-import
import TimeTraveler from "../TimeTraveler";
import {
  addMonths,
  availableConfigFiles,
  errorReason,
  toSec,
  toWei,
  UnlockEvent,
  VestingSettings,
  // eslint-disable-next-line node/no-missing-import
} from "../utils";
import BigNumber from "bignumber.js";
// import { solidity } from "ethereum-waffle";
import moment from "moment";
// eslint-disable-next-line node/no-missing-import
import { ClashToken, Vesting } from "../typechain-types";

// chai.use(solidity);

const timeTraveler = new TimeTraveler(hre.network.provider);

describe("Vesting", function () {
  const CONFIG_FILE = `privateRound`;
  if (!availableConfigFiles.includes(CONFIG_FILE as string))
    throw new Error("Invalid Config File");

  let TOKEN_ADDRESS: string;
  let vesting: Vesting;
  let clashToken: ClashToken;
  let account: string;

  it("Should deploy Token", async function () {
    const TokenFactory = await ethers.getContractFactory("ClashToken");
    clashToken = (await TokenFactory.deploy(
      "Chibi Clash",
      "CLASH"
    )) as ClashToken;

    await clashToken.deployed();
    console.log("Token deployed:", clashToken.address);

    TOKEN_ADDRESS = clashToken.address;

    account = await ethers.provider.getSigner().getAddress();
  });

  it("Should deploy Vesting", async function () {
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    const { vestingName, start } = (await import(
      `../vestingSettings/${CONFIG_FILE}`
    )) as VestingSettings;

    // We get the contract to deploy
    const VestingFactory = await ethers.getContractFactory("Vesting");
    vesting = (await VestingFactory.deploy(
      TOKEN_ADDRESS,
      start,
      vestingName
    )) as Vesting;

    await vesting.deployed();
    console.log(`Vesting ${vestingName} deployed: ${vesting.address}`);
  });

  it("Should fail adding Wrong Lock Events total Params", async function () {
    let errorMessage = "";

    try {
      await vesting.addUnlockEvents(
        [toWei("24000000"), toWei("24000000")],
        [Math.round(Date.now() / 1000)]
      );
    } catch (err: any) {
      errorMessage = errorReason(err.message);
    }

    expect(errorMessage).to.be.equal("Invalid params");
  });

  it("Should fail adding Lock Events in Wrong order", async function () {
    let errorMessage = "";

    const start = toSec(moment());

    const unlockEvents: UnlockEvent[] = [
      {
        percent: 5,
        unlockTime: addMonths(start, 3),
      },
      {
        percent: 4,
        unlockTime: addMonths(start, 1),
      },
    ];

    try {
      await vesting.addUnlockEvents(
        unlockEvents.map((e) => e.percent),
        unlockEvents.map((e) => e.unlockTime)
      );
    } catch (err: any) {
      errorMessage = errorReason(err.message);
    }

    expect(errorMessage).to.be.equal("Unlock time has to be in order");
  });

  it("Should add Unlock Events", async function () {
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    const { unlockEvents } = (await import(
      `../vestingSettings/${CONFIG_FILE}`
    )) as VestingSettings;

    await (
      await vesting.addUnlockEvents(
        unlockEvents.map((e) => e.percent),
        unlockEvents.map((e) => e.unlockTime)
      )
    ).wait(1);
  });

  it("Should get Unlock Events", async function () {
    const unlockEvents = await vesting.getUnlockEvents();

    expect(unlockEvents).to.have.length.greaterThan(0);
  });

  it("Should Transfer Token to Vesting Contract", async function () {
    const amount = toWei(`600000000`);

    await (await clashToken.transfer(vesting.address, amount)).wait();

    expect((await clashToken.balanceOf(vesting.address)).toString()).to.equal(
      amount
    );
  });

  it("Should fail adding zero address as Beneficiary", async function () {
    let errorMessage = "";

    const amount = toWei(`1000000`);

    try {
      await vesting.addBeneficiaries([ethers.constants.AddressZero], [amount]);
    } catch (err: any) {
      errorMessage = errorReason(err.message);
    }

    expect(errorMessage).to.be.equal("The beneficiary's address cannot be 0");
  });

  it("Should fail adding zero amount to Beneficiary", async function () {
    let errorMessage = "";

    const amount = toWei(`0`);

    try {
      await vesting.addBeneficiaries([account], [amount]);
    } catch (err: any) {
      errorMessage = errorReason(err.message);
    }

    expect(errorMessage).to.be.equal("Amount has to be greater than 0");
  });

  it("Should Fail Claiming Tokens for non existent beneficiary", async function () {
    let errorMessage = "";

    try {
      await vesting.claimTokens();
    } catch (err: any) {
      errorMessage = errorReason(err.message);
    }

    expect(errorMessage).to.be.equal("No tokens to claim");
  });

  it("Should add Beneficiary", async function () {
    const amount = toWei(`1000000`);

    await (await vesting.addBeneficiaries([account], [amount])).wait(1);

    const beneficiary = await vesting.beneficiaries(0);
    const tokenAmount = await vesting.tokenAmounts(beneficiary);

    expect(beneficiary).to.equal(account);
    expect(tokenAmount.toString()).to.equal(amount);
  });

  it("Should get Beneficiaries", async function () {
    const beneficiaries = await vesting.getBeneficiaries();

    expect(beneficiaries).to.have.length.greaterThan(0);
  });

  // it("Should get Claimable Amount after some days", async function () {
  //   await timeTraveler.increaseTime(240);

  //   const daysPassed = 3;
  //   await timeTraveler.increaseTime(daysPassed * 24 * 3600);

  //   const unlockedSupply = new BigNumber((await vesting.unlockedSupply())._hex);
  //   const tokenAmount = new BigNumber(
  //     (await vesting.tokenAmounts(account))._hex
  //   );
  //   const claimableAmount = new BigNumber(
  //     (await vesting.claimableAmount(account))._hex
  //   );

  //   const dailyPercentage = new BigNumber(tokenAmount).div(unlockedSupply);

  //   const claimablePercent = new BigNumber(daysPassed).times(dailyPercentage);

  //   expect(
  //     new BigNumber(tokenAmount).times(claimablePercent).toNumber()
  //   ).to.be.equal(claimableAmount.toNumber());
  // });

  it("Should Claim Tokens", async function () {
    const previousClaimableAmount = new BigNumber(
      (await vesting.claimableAmount(account))._hex
    );

    await (await vesting.claimTokens()).wait();

    const currentClaimableAmount = new BigNumber(
      (await vesting.claimableAmount(account))._hex
    );
    const releasedAmount = new BigNumber(
      (await vesting.releasedAmount(account))._hex
    );

    expect(currentClaimableAmount.toFixed()).to.be.equal(`0`);
    expect(releasedAmount.toFixed()).to.be.equal(
      previousClaimableAmount.toFixed()
    );
  });

  // it("Should get Unlocked Supply after some months", async function () {
  //   // eslint-disable-next-line node/no-unsupported-features/es-syntax
  //   const { unlockEvents } = (await import(
  //     `../vestingSettings/${CONFIG_FILE}`
  //   )) as VestingSettings;

  //   const previousUnlockedSupply = new BigNumber(
  //     (await vesting.unlockedSupply())._hex
  //   );

  //   expect(previousUnlockedSupply.toFixed()).to.equal(unlockEvents[0].amount);

  //   const monthPassed = 3;
  //   await timeTraveler.increaseTime((monthPassed - 1) * 30 * 24 * 3600);

  //   const currentUnlockedSupply = new BigNumber(
  //     (await vesting.unlockedSupply())._hex
  //   );

  //   expect(
  //     new BigNumber(unlockEvents[0].amount)
  //       .plus(unlockEvents[1].amount)
  //       .toFixed()
  //   ).to.be.equal(currentUnlockedSupply.toFixed());
  // });
});
