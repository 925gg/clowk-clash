# Audit updates

Fixed issues and recommendations from the audit report

## Notices

   1. ClashToken contract may be paused by admin => After discussing, we removed Pauseable feature

   2. Admin can mint any amount of ClashTokens => After discussing, we set the maximum amount to 5,000,000,000

## Issues:

   1. Vesting.sol contract logic does not guarantee that contract has enough tokens. => Fixed

   2. Vesting.sol contract has `_claimablePercent` function and it is supposed that `start` equal to `unlockEvents[0].unlockTime`, but there is no value check on `unlockEvent` creation. => Fixed
   3. Vesting.sol contract has `addUnlockEvents` function which may be called more than once. The function does not check if new values in `_unlockTime` array are greater than previously added values. => Fixed

## Recommendations

   1. Remove `getBeneficiaries` function. It returns the value from the public field `beneficiaries` which has getter by default. => We changed `beneficiaries` to private variable `_beneficiaries` and keep `getBeneficiaries`.

   2. Variables naming for `totalDaysForCurrentMonth`, `daysPassedForCurrentMonth` variables implies that there is a monthly period between `unlockEvents`, but it is not guaranteed, buy the contract logic. => We changed `totalDaysForCurrentMonth` to `totalDaysForCurrentPeriod`, `daysPassedForCurrentMonth` to `daysPassedForCurrentPeriod`
