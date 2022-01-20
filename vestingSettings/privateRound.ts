import moment from "moment";
// eslint-disable-next-line node/no-missing-import
import { addMonths, toSec, UnlockEvent } from "../utils";

export const vestingName = `Private Round`;

export const start = toSec(moment());

const unlockEvents: UnlockEvent[] = [
  {
    percent: 4,
    unlockTime: addMonths(start, 1),
  },
  {
    percent: 0,
    unlockTime: addMonths(start, 2),
  },
];

for (let i = 3; i <= 18; i++) {
  unlockEvents.push({
    percent: 6,
    unlockTime: addMonths(start, i),
  });
}

export { unlockEvents };
