// SPDX-License-Identifier: MIT

pragma solidity 0.8.10;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract Vesting is Ownable {
  using SafeERC20 for IERC20;

  struct UnlockEvent {
    uint256 amount;
    uint256 unlockTime;
  }

  UnlockEvent[] internal unlockEvents;

        
  event Released(address beneficiary, uint256 amount);

  IERC20 public token;
  uint256 public start;

  uint256 public unlockedSupplyIndex;
  uint256 public accumulatedUnlockedSupply;

  mapping (address => uint256) public tokenAmounts;
  mapping (address => uint256) public releasedAmount;

  uint256 released;
  uint256 private BP = 1e18;
  string public vestingName;

  address[] public beneficiaries;

  /**
   * @param _token The token address.
   * @param _start The TGE timestamp.
   * @param _vestingName The Vesting Schedule name. For instance: Private Round
   */
  constructor(IERC20 _token, uint256 _start, string memory _vestingName) {
      token = _token;
      start = _start;
      vestingName = _vestingName;
  }

  /**
   * @dev Adds the Vesting Schedule Configuration month by month
   * @param _amount The Unlock Amount.
   * @param _unlockTime The Unlock Time (The month in timestamp).
   */
  function addUnlockEvents(uint256[] memory _amount, uint256[] memory _unlockTime) onlyOwner external {
    require(_amount.length == _unlockTime.length, "Invalid params");

    for (uint i = 0; i < _amount.length; i++) {
      if(i > 0) {
        require(_unlockTime[i] > _unlockTime[i - 1], 'Unlock time has to be in order');
      }

      addUnlockEvent(_amount[i], _unlockTime[i]);
    }
  }

  function addUnlockEvent(uint256 _amount, uint256 _unlockTime) internal {
    unlockEvents.push(UnlockEvent({
      amount: _amount,
      unlockTime: _unlockTime
    }));
  }

  /**
   * @dev Fetches the Vesting Schedule Configuration
   * @return The Vesting Schedule Configuration
   */
  function getUnlockEvents() external view returns (UnlockEvent[] memory) {
    return unlockEvents;
  }

  /**
   * @dev Calculates the total tokens unlocked in contract (Unlocked Supply) according to current month
   * @notice This internal function is only called by contract and 
   * modifies the contract state so the call doesn't run the for loop from the beggining everytime
   * @return The Unlocked Supply
   */
  function _unlockedSupply() internal returns (uint256) {
    for(uint256 i = unlockedSupplyIndex; i < unlockEvents.length; i++) {
      if (block.timestamp > unlockEvents[i].unlockTime) {
        accumulatedUnlockedSupply += unlockEvents[i].amount;
      
      } else {
        unlockedSupplyIndex = i;
        break;
      }
      
    }

    return accumulatedUnlockedSupply;
  }

  /**
   * @dev Calculates the total tokens unlocked in contract (Unlocked Supply) according to current month
   * @notice This function doesn't modify the contract state and it's just called for display purposes
   * @return The Unlocked Supply
   */
  function unlockedSupply() public view returns (uint256) {
    uint256 _amount = accumulatedUnlockedSupply;

    for(uint256 i = unlockedSupplyIndex; i < unlockEvents.length; i++) {
      if (block.timestamp > unlockEvents[i].unlockTime) {
        _amount += unlockEvents[i].amount;
      
      } else {
        break;
      }
      
    }

    return _amount;
  }

  /**
   * @dev Adds Beneficiaries addresses and amounts
   */
  function addBeneficiaries(address[] memory _beneficiaries, uint256[] memory _tokenAmounts) onlyOwner external {
    require(_beneficiaries.length == _tokenAmounts.length, "Invalid params");

    for (uint i = 0; i <_beneficiaries.length; i++) {
      addBeneficiary(_beneficiaries[i], _tokenAmounts[i]);
    }
  }

  function addBeneficiary(address _beneficiary, uint256 _tokenAmount) internal {
    require(_beneficiary != address(0), "The beneficiary's address cannot be 0");
    require(_tokenAmount > 0, "Amount has to be greater than 0");

    if (tokenAmounts[_beneficiary] == 0) {
      beneficiaries.push(_beneficiary);
    }

    tokenAmounts[_beneficiary] = tokenAmounts[_beneficiary] + _tokenAmount;
  }

  /**
   * @dev Gets All Beneficiaries Addresses
   * @return All Beneficiaries Addresses
   */
  function getBeneficiaries() external view returns (address[] memory) {
    return beneficiaries;
  }

  /**
   * @dev Claims All available User Tokens
   */
  function claimTokens() external {
    require(tokenAmounts[msg.sender] > 0, "No tokens to claim");
    require(releasedAmount[msg.sender] < tokenAmounts[msg.sender], "User already released all available tokens");

    uint256 unreleased = _claimableAmount(msg.sender, _unlockedSupply());
    
    if (unreleased > 0) {
      released += unreleased;
      token.safeTransfer(msg.sender, unreleased);
      releasedAmount[msg.sender] += unreleased;
      emit Released(msg.sender, unreleased);
    }
  }

  /**
   * @dev Calculates the total Claimable Tokens according to how many days have passed
   * @return The total Claimable Tokens
   */
  function claimableAmount(address _beneficiary) external view returns (uint256) {
    return _claimableAmount(_beneficiary, unlockedSupply());
  }

  function _claimableAmount(address _beneficiary, uint256 supply) internal view returns (uint256) {
    if(supply == 0) return 0;

    uint256 dailyPercentage = tokenAmounts[_beneficiary] * BP / supply;
    uint256 daysPassed = (block.timestamp - start) / 1 days;

    uint256 claimablePercent = daysPassed * dailyPercentage;

    if(claimablePercent > BP) claimablePercent = BP; 

    return tokenAmounts[_beneficiary] * claimablePercent / BP - releasedAmount[_beneficiary];
  }


}