// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IVesting.sol";

contract Vesting is IVesting, Ownable {
    using SafeERC20 for IERC20;

    UnlockEvent[] internal unlockEvents;

    IERC20 public token;
    uint256 public start;

    // uint256 public unlockedSupplyIndex;
    // uint256 public accumulatedUnlockedSupply;

    uint256 public claimablePercentIndex;
    uint256 public accumulatedClaimablePercent;

    mapping(address => uint256) public tokenAmounts;
    mapping(address => uint256) public releasedAmount;

    uint256 internal released;
    uint256 private constant BP = 1e18;
    string public vestingName;

    address[] public beneficiaries;

    /**
     * @param _token The token address.
     * @param _start The TGE timestamp.
     * @param _vestingName The Vesting Schedule name. For instance: Private Round
     */
    constructor(
        IERC20 _token,
        uint256 _start,
        string memory _vestingName
    ) {
        token = _token;
        start = _start;
        vestingName = _vestingName;
    }

    /**
     * @dev Adds the Vesting Schedule Configuration month by month
     * @param _percent The Unlock Percent.
     * @param _unlockTime The Unlock Time (The month in timestamp).
     */
    function addUnlockEvents(
        uint256[] memory _percent,
        uint256[] memory _unlockTime
    ) external override onlyOwner {
        require(_percent.length == _unlockTime.length, "Invalid params");

        for (uint256 i = 0; i < _percent.length; i++) {
            if (i > 0) {
                require(
                    _unlockTime[i] > _unlockTime[i - 1],
                    "Unlock time has to be in order"
                );
            }

            addUnlockEvent(_percent[i], _unlockTime[i]);
        }
    }

    function addUnlockEvent(uint256 _percent, uint256 _unlockTime) internal {
        unlockEvents.push(
            UnlockEvent({percent: _percent, unlockTime: _unlockTime})
        );
    }

    /**
     * @dev Fetches the Vesting Schedule Configuration
     * @return The Vesting Schedule Configuration
     */
    function getUnlockEvents()
        external
        view
        override
        returns (UnlockEvent[] memory)
    {
        return unlockEvents;
    }

    /**
     * @dev Adds Beneficiaries addresses and amounts
     */
    function addBeneficiaries(
        address[] memory _beneficiaries,
        uint256[] memory _tokenAmounts
    ) external override onlyOwner {
        require(
            _beneficiaries.length == _tokenAmounts.length,
            "Invalid params"
        );

        for (uint256 i = 0; i < _beneficiaries.length; i++) {
            addBeneficiary(_beneficiaries[i], _tokenAmounts[i]);
        }
    }

    function addBeneficiary(address _beneficiary, uint256 _tokenAmount)
        internal
    {
        require(
            _beneficiary != address(0),
            "The beneficiary's address cannot be 0"
        );
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
    function getBeneficiaries()
        external
        view
        override
        returns (address[] memory)
    {
        return beneficiaries;
    }

    /**
     * @dev Claims All available User Tokens
     */
    function claimTokens() external override {
        require(tokenAmounts[msg.sender] > 0, "No tokens to claim");
        require(
            releasedAmount[msg.sender] < tokenAmounts[msg.sender],
            "User already released all available tokens"
        );

        (
            uint256 percent,
            uint256 _accumulatedClaimablePercent,
            uint256 _claimablePercentIndex
        ) = _claimablePercent();
        accumulatedClaimablePercent = _accumulatedClaimablePercent;
        claimablePercentIndex = _claimablePercentIndex;
        uint256 unreleased = _claimableAmount(msg.sender, percent);

        if (unreleased > 0) {
            released += unreleased;
            token.safeTransfer(msg.sender, unreleased);
            releasedAmount[msg.sender] += unreleased;
            emit Released(msg.sender, unreleased);
        }
    }

    /**
     * @dev Calculates the total Claimable Percent according to how many days have passed
     * @notice This function doesn't modify the contract state and it's just called for display purposes
     * @return The total Claimable Percent, accumulated Claimable Percent, claimable Percent Index
     */
    function _claimablePercent()
        internal
        view
        returns (
            uint256,
            uint256,
            uint256
        )
    {
        uint256 _accumulatedClaimablePercent = accumulatedClaimablePercent;
        uint256 _claimablePercentIndex = claimablePercentIndex;

        // cannot claim before TGE
        if (block.timestamp < start)
            return (0, _accumulatedClaimablePercent, _claimablePercentIndex);

        uint256 claimablePercentForCurentMonth;

        for (uint256 i = _claimablePercentIndex; i < unlockEvents.length; i++) {
            //unlockEvents[i].percent = 4 for 4%
            uint256 lockedMonthPercent = unlockEvents[i].percent * BP;

            if (block.timestamp > unlockEvents[i].unlockTime) {
                _accumulatedClaimablePercent += lockedMonthPercent;
            } else {
                // "i" will always be greater than 0 since unlockEvents[0].unlockTime = start
                uint256 totalDaysForCurrentMonth = (unlockEvents[i].unlockTime -
                    unlockEvents[i - 1].unlockTime) / 1 days;
                uint256 daysPassedForCurrentMonth = (block.timestamp -
                    unlockEvents[i - 1].unlockTime) / 1 days;

                claimablePercentForCurentMonth +=
                    (lockedMonthPercent * daysPassedForCurrentMonth) /
                    totalDaysForCurrentMonth;

                _claimablePercentIndex = i;
                break;
            }
        }

        uint256 resultPercent = _accumulatedClaimablePercent +
            claimablePercentForCurentMonth;

        if (resultPercent > 100 * BP) resultPercent = 100 * BP;

        // if 4% then it'll return 4 * BP
        return (
            resultPercent,
            _accumulatedClaimablePercent,
            _claimablePercentIndex
        );
    }

    /**
     * @dev Calculates the total Claimable Percent according to how many days have passed
     * @notice This function doesn't modify the contract state and it's just called for display purposes
     * @return The total Claimable Percent
     */
    function claimablePercent() public view override returns (uint256) {
        (uint256 percent, , ) = _claimablePercent();
        return percent;
    }

    /**
     * @dev Calculates the total Claimable Tokens according to how many days have passed
     * @return The total Claimable Tokens
     */
    function claimableAmount(address _beneficiary)
        public
        view
        override
        returns (uint256)
    {
        return _claimableAmount(_beneficiary, claimablePercent());
    }

    function _claimableAmount(address _beneficiary, uint256 __claimablePercent)
        internal
        view
        returns (uint256)
    {
        return
            (tokenAmounts[_beneficiary] * __claimablePercent) /
            (100 * BP) -
            releasedAmount[_beneficiary];
    }
}
