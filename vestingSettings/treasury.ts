import moment from "moment";
import { addMonths, toSec, toWei, UnlockEvent } from "../utils";

export const vestingName = `Treasury`;

export const start = toSec(moment());

const unlockEvents: UnlockEvent[] = [
  {
    amount: toWei("64000000"),
    unlockTime: addMonths(start, 1),
  },
  {
    amount: toWei("128000000"),
    unlockTime: addMonths(start, 2),
  },
];

for (let i = 3; i <= 24; i++) {
  unlockEvents.push({
    amount: toWei("64000000"),
    unlockTime: addMonths(start, i),
  });
}


export { unlockEvents };
