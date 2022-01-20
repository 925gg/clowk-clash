import moment from "moment";
import { addMonths, toSec, UnlockEvent } from "../utils";

export const vestingName = `Team & Advisors`;

export const start = toSec(moment());

const unlockEvents: UnlockEvent[] = [];

for (let i = 1; i <= 5; i++) {
  unlockEvents.push({
    percent: 0,
    unlockTime: addMonths(start, i),
  });
}

for (let i = 6; i <= 10; i++) {
  unlockEvents.push({
    percent: 6,
    unlockTime: addMonths(start, i),
  });
}

for (let i = 11; i <= 24; i++) {
  unlockEvents.push({
    percent: 5,
    unlockTime: addMonths(start, i),
  });
}

export { unlockEvents };
