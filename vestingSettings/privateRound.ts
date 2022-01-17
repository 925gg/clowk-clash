import moment from 'moment';
import { addMonths, toSec, toWei, UnlockEvent } from '../utils';


export const vestingName = `Private Round`;

export const start = toSec(moment());


const unlockEvents: UnlockEvent[] = [
  {
    amount: toWei('24000000'),
    unlockTime: addMonths(start, 1)
  }
];

for(let i = 3; i <= 18; i++ ) {
  unlockEvents.push({
    amount: toWei('36000000'),
    unlockTime: addMonths(start, i)
  })
}

export {unlockEvents};