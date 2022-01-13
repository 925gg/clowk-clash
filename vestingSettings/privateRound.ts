import moment from 'moment';
import { addMonths, toSec, toWei, UnlockEvent } from '../utils';


export const vestingName = `Private Round`;

export const lockupTime = toSec(moment());

export const unlockEvents: UnlockEvent[] = [
  {
    amount: toWei('24000000'),
    unlockTime: addMonths(lockupTime, 1)
  },
  {
    amount: toWei('36000000'),
    unlockTime: addMonths(lockupTime, 3)
  },
  {
    amount: toWei('36000000'),
    unlockTime: addMonths(lockupTime, 4)
  },
  {
    amount: toWei('36000000'),
    unlockTime: addMonths(lockupTime, 5)
  },
  {
    amount: toWei('36000000'),
    unlockTime: addMonths(lockupTime, 6)
  },
  {
    amount: toWei('36000000'),
    unlockTime: addMonths(lockupTime, 7)
  },
  {
    amount: toWei('36000000'),
    unlockTime: addMonths(lockupTime, 8)
  },
  {
    amount: toWei('36000000'),
    unlockTime: addMonths(lockupTime, 9)
  },
  {
    amount: toWei('36000000'),
    unlockTime: addMonths(lockupTime, 10)
  },
  {
    amount: toWei('36000000'),
    unlockTime: addMonths(lockupTime, 11)
  },
  {
    amount: toWei('36000000'),
    unlockTime: addMonths(lockupTime, 12)
  },
  {
    amount: toWei('36000000'),
    unlockTime: addMonths(lockupTime, 13)
  },
  {
    amount: toWei('36000000'),
    unlockTime: addMonths(lockupTime, 14)
  },
  {
    amount: toWei('36000000'),
    unlockTime: addMonths(lockupTime, 15)
  },
  {
    amount: toWei('36000000'),
    unlockTime: addMonths(lockupTime, 16)
  },
  {
    amount: toWei('36000000'),
    unlockTime: addMonths(lockupTime, 17)
  },
  {
    amount: toWei('36000000'),
    unlockTime: addMonths(lockupTime, 18)
  },
];