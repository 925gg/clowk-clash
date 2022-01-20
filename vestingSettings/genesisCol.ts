import moment from "moment";
// eslint-disable-next-line node/no-missing-import
import { addMonths, toSec, UnlockEvent } from "../utils";

export const vestingName = `Genesis Collector Rewards`;

export const start = toSec(moment());

export const unlockEvents: UnlockEvent[] = [
  {
    percent: 100,
    unlockTime: addMonths(start, 1),
  },
];
