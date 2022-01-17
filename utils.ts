import moment from "moment";

declare const web3: any;


export interface UnlockEvent {
  amount: string;
  unlockTime: number;
}

export interface VestingSettings {
  unlockEvents: UnlockEvent[];
  start: number;
  vestingName: string;
}

export function toSec(value: moment.Moment) {
  return Math.floor(value.toDate().getTime() / 1000);
}

export function toWei(value: string | number) {
  return web3.utils.toWei(value);
}

export function addMonths(time: number, months: number) {
  return toSec(moment(time * 1000).add(months - 1, 'months'));
}

export function sleep(prop: { seconds: number }) {
  return new Promise(resolve => setTimeout(resolve, prop.seconds * 1000));
}



export const availableConfigFiles = [
  'privateRound',
  'publicRound',
  'genesisCol',
  'liquidity',
  'team',
  'treasury'
];