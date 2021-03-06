import moment from "moment";
// eslint-disable-next-line node/no-missing-import
import { addMonths, toSec, UnlockEvent } from "../utils";

export const vestingName = `Public Round`;

export const start = toSec(moment());

export const unlockEvents: UnlockEvent[] = [
  {
    percent: 50,
    unlockTime: addMonths(start, 1),
  },
  {
    percent: 50,
    unlockTime: addMonths(start, 2),
  },
];
