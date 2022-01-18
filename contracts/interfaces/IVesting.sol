pragma solidity ^0.8.0;

interface IVesting {
  struct UnlockEvent {
    uint256 amount;
    uint256 unlockTime;
  }

  event Released(address beneficiary, uint256 amount);

  function addUnlockEvents(uint256[] memory _amount, uint256[] memory _unlockTime) external;

  function getUnlockEvents() external view returns (UnlockEvent[] memory);

  function unlockedSupply() external view returns (uint256);

  function addBeneficiaries(address[] memory _beneficiaries, uint256[] memory _tokenAmounts) external;

  function getBeneficiaries() external view returns (address[] memory);

  function claimTokens() external;

  function claimableAmount(address _beneficiary) external view returns (uint256);

}