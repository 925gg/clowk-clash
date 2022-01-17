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

  constructor(IERC20 _token, uint256 _start, string memory _vestingName) {
      token = _token;
      start = _start;
      vestingName = _vestingName;
  }

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

  function getUnlockEvents() external view returns (UnlockEvent[] memory) {
    return unlockEvents;
  }

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

  function addBeneficiaries(address[] memory _beneficiaries, uint256[] memory _tokenAmounts) onlyOwner external {
    require(_beneficiaries.length == _tokenAmounts.length, "Invalid params");

    for (uint i = 0; i <_beneficiaries.length; i++) {
      addBeneficiary(_beneficiaries[i], _tokenAmounts[i]);
    }

  // require(totalAmounts() == token.balanceOf(address(this)), "Invalid token amount");
  }

  function addBeneficiary(address _beneficiary, uint256 _tokenAmount) internal {
    require(_beneficiary != address(0), "The beneficiary's address cannot be 0");
    require(_tokenAmount > 0, "Amount has to be greater than 0");

    if (tokenAmounts[_beneficiary] == 0) {
      beneficiaries.push(_beneficiary);
    }

    tokenAmounts[_beneficiary] = tokenAmounts[_beneficiary] + _tokenAmount;
  }

  function getBeneficiaries() external view returns (address[] memory) {
    return beneficiaries;
  }

  function claimTokens() external {
    require(tokenAmounts[msg.sender] > 0, "No tokens to claim");
    require(releasedAmount[msg.sender] < tokenAmounts[msg.sender], "User already released all available tokens");

    uint256 unreleased = _claimableAmount(msg.sender);
    
    if (unreleased > 0) {
      released += unreleased;
      token.safeTransfer(msg.sender, unreleased);
      releasedAmount[msg.sender] += unreleased;
      emit Released(msg.sender, unreleased);
    }
  }


  function _claimableAmount(address _beneficiary) internal returns (uint256) {
    uint256 supply = _unlockedSupply();

    if(supply == 0) return 0;

    uint256 dailyPercentage = tokenAmounts[_beneficiary] * BP / supply;
    uint256 daysPassed = (block.timestamp - start) / 1 days;

    uint256 claimablePercent = daysPassed * dailyPercentage;

    if(claimablePercent > BP) claimablePercent = BP; 

    return tokenAmounts[_beneficiary] * claimablePercent / BP - releasedAmount[_beneficiary];
  }


  function claimableAmount(address _beneficiary) public view returns (uint256) {
    uint256 supply = unlockedSupply();

    if(supply == 0) return 0;

    uint256 dailyPercentage = tokenAmounts[_beneficiary] * BP / supply;
    uint256 daysPassed = (block.timestamp - start) / 1 days;

    uint256 claimablePercent = daysPassed * dailyPercentage;

    if(claimablePercent > BP) claimablePercent = BP; 

    return tokenAmounts[_beneficiary] * claimablePercent / BP - releasedAmount[_beneficiary];
  }


}