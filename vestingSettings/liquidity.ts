import moment from 'moment';
import { addMonths, toSec, toWei, UnlockEvent } from '../utils';


export const vestingName = `Liquidity`;

export const start = toSec(moment());


const unlockEvents: UnlockEvent[] = [
  {
    amount: toWei('174000000'),
    unlockTime: addMonths(start, 2)
  }
];

for(let i = 3; i <= 24; i++ ) {
  unlockEvents.push({
    amount: toWei('58000000'),
    unlockTime: addMonths(start, i)
  })
}

export {unlockEvents};