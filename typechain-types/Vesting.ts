/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import { FunctionFragment, Result, EventFragment } from "@ethersproject/abi";
import { Listener, Provider } from "@ethersproject/providers";
import { TypedEventFilter, TypedEvent, TypedListener, OnEvent } from "./common";

export declare namespace IVesting {
  export type UnlockEventStruct = {
    amount: BigNumberish;
    unlockTime: BigNumberish;
  };

  export type UnlockEventStructOutput = [BigNumber, BigNumber] & {
    amount: BigNumber;
    unlockTime: BigNumber;
  };
}

export interface VestingInterface extends utils.Interface {
  contractName: "Vesting";
  functions: {
    "accumulatedUnlockedSupply()": FunctionFragment;
    "addBeneficiaries(address[],uint256[])": FunctionFragment;
    "addUnlockEvents(uint256[],uint256[])": FunctionFragment;
    "beneficiaries(uint256)": FunctionFragment;
    "claimTokens()": FunctionFragment;
    "claimableAmount(address)": FunctionFragment;
    "getBeneficiaries()": FunctionFragment;
    "getUnlockEvents()": FunctionFragment;
    "owner()": FunctionFragment;
    "releasedAmount(address)": FunctionFragment;
    "renounceOwnership()": FunctionFragment;
    "start()": FunctionFragment;
    "token()": FunctionFragment;
    "tokenAmounts(address)": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
    "unlockedSupply()": FunctionFragment;
    "unlockedSupplyIndex()": FunctionFragment;
    "vestingName()": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "accumulatedUnlockedSupply",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "addBeneficiaries",
    values: [string[], BigNumberish[]]
  ): string;
  encodeFunctionData(
    functionFragment: "addUnlockEvents",
    values: [BigNumberish[], BigNumberish[]]
  ): string;
  encodeFunctionData(
    functionFragment: "beneficiaries",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "claimTokens",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "claimableAmount",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "getBeneficiaries",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getUnlockEvents",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "releasedAmount",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "start", values?: undefined): string;
  encodeFunctionData(functionFragment: "token", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "tokenAmounts",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "unlockedSupply",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "unlockedSupplyIndex",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "vestingName",
    values?: undefined
  ): string;

  decodeFunctionResult(
    functionFragment: "accumulatedUnlockedSupply",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "addBeneficiaries",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "addUnlockEvents",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "beneficiaries",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "claimTokens",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "claimableAmount",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getBeneficiaries",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getUnlockEvents",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "releasedAmount",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "start", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "token", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "tokenAmounts",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "unlockedSupply",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "unlockedSupplyIndex",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "vestingName",
    data: BytesLike
  ): Result;

  events: {
    "OwnershipTransferred(address,address)": EventFragment;
    "Released(address,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Released"): EventFragment;
}

export type OwnershipTransferredEvent = TypedEvent<
  [string, string],
  { previousOwner: string; newOwner: string }
>;

export type OwnershipTransferredEventFilter =
  TypedEventFilter<OwnershipTransferredEvent>;

export type ReleasedEvent = TypedEvent<
  [string, BigNumber],
  { beneficiary: string; amount: BigNumber }
>;

export type ReleasedEventFilter = TypedEventFilter<ReleasedEvent>;

export interface Vesting extends BaseContract {
  contractName: "Vesting";
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: VestingInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    accumulatedUnlockedSupply(overrides?: CallOverrides): Promise<[BigNumber]>;

    addBeneficiaries(
      _beneficiaries: string[],
      _tokenAmounts: BigNumberish[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    addUnlockEvents(
      _amount: BigNumberish[],
      _unlockTime: BigNumberish[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    beneficiaries(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string]>;

    claimTokens(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    claimableAmount(
      _beneficiary: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    getBeneficiaries(overrides?: CallOverrides): Promise<[string[]]>;

    getUnlockEvents(
      overrides?: CallOverrides
    ): Promise<[IVesting.UnlockEventStructOutput[]]>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    releasedAmount(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    start(overrides?: CallOverrides): Promise<[BigNumber]>;

    token(overrides?: CallOverrides): Promise<[string]>;

    tokenAmounts(arg0: string, overrides?: CallOverrides): Promise<[BigNumber]>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    unlockedSupply(overrides?: CallOverrides): Promise<[BigNumber]>;

    unlockedSupplyIndex(overrides?: CallOverrides): Promise<[BigNumber]>;

    vestingName(overrides?: CallOverrides): Promise<[string]>;
  };

  accumulatedUnlockedSupply(overrides?: CallOverrides): Promise<BigNumber>;

  addBeneficiaries(
    _beneficiaries: string[],
    _tokenAmounts: BigNumberish[],
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  addUnlockEvents(
    _amount: BigNumberish[],
    _unlockTime: BigNumberish[],
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  beneficiaries(arg0: BigNumberish, overrides?: CallOverrides): Promise<string>;

  claimTokens(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  claimableAmount(
    _beneficiary: string,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  getBeneficiaries(overrides?: CallOverrides): Promise<string[]>;

  getUnlockEvents(
    overrides?: CallOverrides
  ): Promise<IVesting.UnlockEventStructOutput[]>;

  owner(overrides?: CallOverrides): Promise<string>;

  releasedAmount(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

  renounceOwnership(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  start(overrides?: CallOverrides): Promise<BigNumber>;

  token(overrides?: CallOverrides): Promise<string>;

  tokenAmounts(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

  transferOwnership(
    newOwner: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  unlockedSupply(overrides?: CallOverrides): Promise<BigNumber>;

  unlockedSupplyIndex(overrides?: CallOverrides): Promise<BigNumber>;

  vestingName(overrides?: CallOverrides): Promise<string>;

  callStatic: {
    accumulatedUnlockedSupply(overrides?: CallOverrides): Promise<BigNumber>;

    addBeneficiaries(
      _beneficiaries: string[],
      _tokenAmounts: BigNumberish[],
      overrides?: CallOverrides
    ): Promise<void>;

    addUnlockEvents(
      _amount: BigNumberish[],
      _unlockTime: BigNumberish[],
      overrides?: CallOverrides
    ): Promise<void>;

    beneficiaries(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<string>;

    claimTokens(overrides?: CallOverrides): Promise<void>;

    claimableAmount(
      _beneficiary: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getBeneficiaries(overrides?: CallOverrides): Promise<string[]>;

    getUnlockEvents(
      overrides?: CallOverrides
    ): Promise<IVesting.UnlockEventStructOutput[]>;

    owner(overrides?: CallOverrides): Promise<string>;

    releasedAmount(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    start(overrides?: CallOverrides): Promise<BigNumber>;

    token(overrides?: CallOverrides): Promise<string>;

    tokenAmounts(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    transferOwnership(
      newOwner: string,
      overrides?: CallOverrides
    ): Promise<void>;

    unlockedSupply(overrides?: CallOverrides): Promise<BigNumber>;

    unlockedSupplyIndex(overrides?: CallOverrides): Promise<BigNumber>;

    vestingName(overrides?: CallOverrides): Promise<string>;
  };

  filters: {
    "OwnershipTransferred(address,address)"(
      previousOwner?: string | null,
      newOwner?: string | null
    ): OwnershipTransferredEventFilter;
    OwnershipTransferred(
      previousOwner?: string | null,
      newOwner?: string | null
    ): OwnershipTransferredEventFilter;

    "Released(address,uint256)"(
      beneficiary?: null,
      amount?: null
    ): ReleasedEventFilter;
    Released(beneficiary?: null, amount?: null): ReleasedEventFilter;
  };

  estimateGas: {
    accumulatedUnlockedSupply(overrides?: CallOverrides): Promise<BigNumber>;

    addBeneficiaries(
      _beneficiaries: string[],
      _tokenAmounts: BigNumberish[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    addUnlockEvents(
      _amount: BigNumberish[],
      _unlockTime: BigNumberish[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    beneficiaries(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    claimTokens(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    claimableAmount(
      _beneficiary: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getBeneficiaries(overrides?: CallOverrides): Promise<BigNumber>;

    getUnlockEvents(overrides?: CallOverrides): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    releasedAmount(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    start(overrides?: CallOverrides): Promise<BigNumber>;

    token(overrides?: CallOverrides): Promise<BigNumber>;

    tokenAmounts(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    unlockedSupply(overrides?: CallOverrides): Promise<BigNumber>;

    unlockedSupplyIndex(overrides?: CallOverrides): Promise<BigNumber>;

    vestingName(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    accumulatedUnlockedSupply(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    addBeneficiaries(
      _beneficiaries: string[],
      _tokenAmounts: BigNumberish[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    addUnlockEvents(
      _amount: BigNumberish[],
      _unlockTime: BigNumberish[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    beneficiaries(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    claimTokens(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    claimableAmount(
      _beneficiary: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getBeneficiaries(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getUnlockEvents(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    releasedAmount(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    start(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    token(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    tokenAmounts(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    unlockedSupply(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    unlockedSupplyIndex(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    vestingName(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}
