import moment from 'moment';
import { addMonths, toSec, toWei, UnlockEvent } from '../utils';


export const vestingName = `Team & Advisors`;

export const start = toSec(moment());


const unlockEvents: UnlockEvent[] = [];

for(let i = 6; i <= 10; i++ ) {
  unlockEvents.push({
    amount: toWei('72000000'),
    unlockTime: addMonths(start, i)
  });
}

for(let i = 11; i <= 24; i++ ) {
    unlockEvents.push({
      amount: toWei('60000000'),
      unlockTime: addMonths(start, i)
    });
  }
  

export {unlockEvents};