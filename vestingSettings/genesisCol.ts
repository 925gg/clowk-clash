import moment from 'moment';
import { addMonths, toSec, toWei, UnlockEvent } from '../utils';


export const vestingName = `Genesis Collector Rewards`;

export const start = toSec(moment());

export const unlockEvents: UnlockEvent[] = [
  {
    amount: toWei('55000000'),
    unlockTime: addMonths(start, 1)
  },
];