import { expect } from "chai";
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
import moment from "moment";
// eslint-disable-next-line node/no-missing-import
import { ClashToken, Vesting } from "../typechain-types";

const timeTraveler = new TimeTraveler(hre.network.provider);

describe("Vesting", function () {
  const CONFIG_FILE = `privateRound`;
  if (!availableConfigFiles.includes(CONFIG_FILE as string))
    throw new Error("Invalid Config File");

  let TOKEN_ADDRESS: string;
  let vesting: Vesting;
  let vesting2: Vesting;
  let clashToken: ClashToken;
  let account: string;
  const blockStartTimestamp = toSec(moment().add(1, "hour"));

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

    TOKEN_ADDRESS = clashToken.address;
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
      await vesting.addUnlockEvents([4, 5], [Math.round(Date.now() / 1000)]);
    } catch (err: any) {
      errorMessage = errorReason(err.message);
    }

    expect(errorMessage).to.be.equal("Invalid params");
  });

  it("Should fail adding Lock Events in Wrong order", async function () {
    let errorMessage = "";
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    const { start } = (await import(
      `../vestingSettings/${CONFIG_FILE}`
    )) as VestingSettings;

    const unlockEvents: UnlockEvent[] = [
      {
        percent: 7,
        unlockTime: addMonths(start, 1),
      },
      {
        percent: 5,
        unlockTime: addMonths(start, 3),
      },
      {
        percent: 4,
        unlockTime: addMonths(start, 2),
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

  it("Should fail adding Lock Events not starting with TGE", async function () {
    let errorMessage = "";
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    const { start } = (await import(
      `../vestingSettings/${CONFIG_FILE}`
    )) as VestingSettings;

    const unlockEvents: UnlockEvent[] = [
      {
        percent: 5,
        unlockTime: addMonths(start, 2),
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

    expect(errorMessage).to.be.equal("Unlock time must start from TGE");
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

  it("Should fail adding Lock Events with unlock time not greater than previously added ones", async function () {
    let errorMessage = "";

    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    const { unlockEvents } = (await import(
      `../vestingSettings/${CONFIG_FILE}`
    )) as VestingSettings;

    const invalidEvents: UnlockEvent[] = [
      {
        percent: 8,
        unlockTime: unlockEvents[unlockEvents.length - 1].unlockTime,
      },
    ];

    try {
      await vesting.addUnlockEvents(
        invalidEvents.map((e) => e.percent),
        invalidEvents.map((e) => e.unlockTime)
      );
    } catch (err: any) {
      errorMessage = errorReason(err.message);
    }

    expect(errorMessage).to.be.equal("Unlock time has to be in order");
  });

  it("Should fail adding Lock Events with total percent greater than 100", async function () {
    let errorMessage = "";
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    const { start } = (await import(
      `../vestingSettings/${CONFIG_FILE}`
    )) as VestingSettings;

    const invalidEvents: UnlockEvent[] = [
      {
        percent: 8,
        unlockTime: addMonths(start, 22),
      },
      // {
      //   percent: 95,
      //   unlockTime: addMonths(start, 12),
      // },
    ];

    try {
      await vesting.addUnlockEvents(
        invalidEvents.map((e) => e.percent),
        invalidEvents.map((e) => e.unlockTime)
      );
    } catch (err: any) {
      errorMessage = errorReason(err.message);
    }

    expect(errorMessage).to.be.equal("Invalid percent values");
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

    const beneficiary = (await vesting.getBeneficiaries())[0];
    const tokenAmount = await vesting.tokenAmounts(beneficiary);

    expect(beneficiary).to.equal(account);
    expect(tokenAmount.toString()).to.equal(amount);
  });

  it("Should get Beneficiaries", async function () {
    const beneficiaries = await vesting.getBeneficiaries();

    expect(beneficiaries).to.have.length.greaterThan(0);
  });

  it("Should get Claimable Amount after some period", async function () {
    await timeTraveler.setNextBlockTimestamp(blockStartTimestamp);

    const BP = new BigNumber(10).pow(18);

    const tokenAmount = new BigNumber(
      (await vesting.tokenAmounts(account)).toHexString()
    );
    const previousClaimablePercent = new BigNumber(
      (await vesting.claimablePercent()).toHexString()
    );
    const previousClaimableAmount = new BigNumber(
      (await vesting.claimableAmount(account)).toHexString()
    );

    // For private round 4% is unlocked at TGE
    expect(previousClaimablePercent.div(BP).toNumber()).to.be.equal(4); // 4%

    expect(previousClaimableAmount.toFixed()).to.be.equal(
      tokenAmount.times(previousClaimablePercent).div(BP.times(100)).toFixed()
    );

    await timeTraveler.setNextBlockTimestamp(
      addMonths(blockStartTimestamp, 3) + 15 * 24 * 3600 // current date = month 3 + 15 days
    );

    const currentClaimablePercent = new BigNumber(
      (await vesting.claimablePercent()).toHexString()
    );
    const currentClaimableAmount = new BigNumber(
      (await vesting.claimableAmount(account)).toHexString()
    );

    // For private round 6% is unlocked after month 3. 3% more is unlocked after 15 days corresponding to month 4
    expect(currentClaimablePercent.div(BP).toNumber()).to.be.closeTo(13, 1); // 4% + 6% + ~3% = ~13%

    expect(currentClaimableAmount.toFixed()).to.be.equal(
      tokenAmount.times(currentClaimablePercent).div(BP.times(100)).toFixed()
    );
  });

  it("Should Claim Tokens", async function () {
    const previousClaimableAmount = new BigNumber(
      (await vesting.claimableAmount(account)).toHexString()
    );

    await (await vesting.claimTokens()).wait();

    const currentClaimableAmount = new BigNumber(
      (await vesting.claimableAmount(account)).toHexString()
    );
    const releasedAmount = new BigNumber(
      (await vesting.releasedAmount(account)).toHexString()
    );

    expect(currentClaimableAmount.toFixed()).to.be.equal(`0`);
    expect(releasedAmount.toFixed()).to.be.equal(
      previousClaimableAmount.toFixed()
    );
  });

  it("Should Claim Tokens 2nd time", async function () {
    const BP = new BigNumber(10).pow(18);
    await timeTraveler.setNextBlockTimestamp(
      addMonths(blockStartTimestamp, 5) + 20 * 24 * 3600 // current date = month 5 + 20 days
    );

    const currentClaimablePercent = new BigNumber(
      (await vesting.claimablePercent()).toHexString()
    );

    // For private round 6% is unlocked after month 3. 4% more is unlocked after 20 days corresponding to month
    expect(currentClaimablePercent.div(BP).toNumber()).to.be.closeTo(26, 1); // 4% + 6% + 6% + 6% + ~4% = ~26%

    const previousClaimableAmount = new BigNumber(
      (await vesting.claimableAmount(account)).toHexString()
    );
    const previousReleasedAmount = new BigNumber(
      (await vesting.releasedAmount(account)).toHexString()
    );

    await (await vesting.claimTokens()).wait();

    const currentClaimableAmount = new BigNumber(
      (await vesting.claimableAmount(account)).toHexString()
    );
    const releasedAmount = new BigNumber(
      (await vesting.releasedAmount(account)).toHexString()
    );

    expect(currentClaimableAmount.toFixed()).to.be.equal(`0`);
    expect(releasedAmount.toFixed()).to.be.equal(
      previousClaimableAmount.plus(previousReleasedAmount).toFixed()
    );

    await timeTraveler.setNextBlockTimestamp(
      addMonths(blockStartTimestamp, 6) + 1 * 24 * 3600 // current date = month 6 + 1 day
    );

    const nextClaimablePercent = new BigNumber(
      (await vesting.claimablePercent()).toHexString()
    );
    expect(nextClaimablePercent.div(BP).toNumber()).to.be.closeTo(28, 1); // 4% + 6% + 6% + 6% + ~6% = ~28%
  });

  it("Should not add beneficiaries that contract cannot cover", async function () {
    let errorMessage = "";
    try {
      const more = toWei(`600000000`);
      await vesting.addBeneficiaries([account], [more]);
    } catch (err: any) {
      errorMessage = errorReason(err.message);
    }
    expect(errorMessage).to.eq("Not enough token to cover");
  });

  it("Should not get claimable amount before TGE", async function () {
    const start2 = toSec(moment().add(1, "year"));
    const vestingName = "Vesting 2";
    // We get the contract to deploy
    const VestingFactory = await ethers.getContractFactory("Vesting");
    vesting2 = (await VestingFactory.deploy(
      TOKEN_ADDRESS,
      start2,
      vestingName
    )) as Vesting;

    await vesting2.deployed();
    console.log(`Vesting ${vestingName} deployed: ${vesting2.address}`);
    await vesting2.addUnlockEvents([100], [addMonths(start2, 1)]);

    const claimablePercent = await vesting2.claimablePercent();
    expect(claimablePercent).to.be.equal(0);
  });

  it("Should not let a user withdraw ERC20 tokens if he is not the owner", async function () {
    let errorMessage = "";
    try {
      const unauthorizedUser = (await ethers.getSigners())[1];
      const contract = vesting.connect(unauthorizedUser);

      const withdrawAllERC20Tx = await contract.withdrawAllERC20(
        clashToken.address
      );
      await withdrawAllERC20Tx.wait();
    } catch (err: any) {
      errorMessage = errorReason(err.message);
    }
    expect(errorMessage).to.eq("Ownable: caller is not the owner");
  });

  it("Should let owner withdraw all unassigned tokens", async function () {
    let withdrawAllERC20Tx = await vesting.withdrawAllERC20(clashToken.address);
    await withdrawAllERC20Tx.wait();

    const amount = ethers.utils.parseEther("10");
    const beneficiary = ethers.utils.parseEther("4");
    const mintTx = await clashToken.transfer(vesting.address, amount);
    await mintTx.wait();

    await vesting.addBeneficiaries([account], [beneficiary]);

    const ownerBalanceBefore = await clashToken.balanceOf(account);
    const contractBalanceBefore = await clashToken.balanceOf(vesting.address);

    withdrawAllERC20Tx = await vesting.withdrawAllERC20(clashToken.address);
    await withdrawAllERC20Tx.wait();

    const available = amount.sub(beneficiary);
    const ownerBalanceAfter = await clashToken.balanceOf(account);
    const contractBalanceAfter = await clashToken.balanceOf(vesting.address);
    expect(ownerBalanceAfter.sub(ownerBalanceBefore).eq(available)).to.be.eq(
      true
    );
    expect(
      contractBalanceBefore.sub(contractBalanceAfter).eq(available)
    ).to.be.eq(true);
  });

  it("Should not let a user withdraw tokens from a zero-balance", async function () {
    let errorMessage = "";
    try {
      const withdrawAllERC20Tx = await vesting2.withdrawAllERC20(
        clashToken.address
      );
      await withdrawAllERC20Tx.wait();
    } catch (err: any) {
      errorMessage = errorReason(err.message);
    }
    expect(errorMessage).to.eq("Balance must be greater than 0");
  });

  it("Should not let a user withdraw tokens if there are no available tokens left", async function () {
    let errorMessage = "";
    const amount = ethers.utils.parseEther("10");
    const beneficiary = ethers.utils.parseEther("10");
    const mintTx = await clashToken.transfer(vesting.address, amount);
    await mintTx.wait();

    await vesting.addBeneficiaries([account], [beneficiary]);
    try {
      const withdrawAllERC20Tx = await vesting.withdrawAllERC20(
        clashToken.address
      );
      await withdrawAllERC20Tx.wait();
    } catch (err: any) {
      errorMessage = errorReason(err.message);
    }
    expect(errorMessage).to.eq("No available tokens");
  });
});
