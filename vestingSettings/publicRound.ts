import moment from 'moment';
import { addMonths, toSec, toWei, UnlockEvent } from '../utils';


export const vestingName = `Public Round`;

export const start = toSec(moment());

export const unlockEvents: UnlockEvent[] = [
  {
    amount: toWei('47500000'),
    unlockTime: addMonths(start, 1)
  },
  {
    amount: toWei('47500000'),
    unlockTime: addMonths(start, 2)
  },
];