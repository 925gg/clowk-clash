import moment from "moment";
import { addMonths, toSec, UnlockEvent } from "../utils";

export const vestingName = `Liquidity`;

export const start = toSec(moment());

const unlockEvents: UnlockEvent[] = [
  {
    percent: 0,
    unlockTime: addMonths(start, 1),
  },
  {
    percent: 12,
    unlockTime: addMonths(start, 2),
  },
];

for (let i = 3; i <= 24; i++) {
  unlockEvents.push({
    percent: 4,
    unlockTime: addMonths(start, i),
  });
}

export { unlockEvents };
