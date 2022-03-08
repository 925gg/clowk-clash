// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IVesting.sol";
import "hardhat/console.sol";

contract Vesting is IVesting, Ownable {
    using SafeERC20 for IERC20;

    UnlockEvent[] private _unlockEvents;

    IERC20 public token;
    uint256 public start;

    uint256 public claimablePercentIndex;
    uint256 public accumulatedClaimablePercent;
    uint256 private _assigned;

    mapping(address => uint256) public tokenAmounts;
    mapping(address => uint256) public releasedAmount;

    uint256 private _released;
    uint256 private constant BP = 1e18;
    string public vestingName;

    address[] private _beneficiaries;

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
     * @dev Adds the Vesting Schedule Configuration
     * @param percent The Unlock Percent.
     * @param unlockTime The Unlock Time.
     */
    function addUnlockEvents(
        uint256[] memory percent,
        uint256[] memory unlockTime
    ) external override onlyOwner {
        require(percent.length == unlockTime.length, "Invalid params");
        if (_unlockEvents.length > 0)
            require(start == unlockTime[0], "Unlock time must start from TGE");

        for (uint256 i = 0; i < percent.length; i++) {
            if (i > 0) {
                require(
                    unlockTime[i] > unlockTime[i - 1],
                    "Unlock time has to be in order"
                );
            }

            _addUnlockEvent(percent[i], unlockTime[i]);
        }
    }

    function _addUnlockEvent(uint256 percent, uint256 unlockTime) private {
        _unlockEvents.push(
            UnlockEvent({percent: percent, unlockTime: unlockTime})
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
        return _unlockEvents;
    }

    /**
     * @dev Adds Beneficiaries addresses and amounts
     */
    function addBeneficiaries(
        address[] memory beneficiaries,
        uint256[] memory amounts
    ) external override onlyOwner {
        require(beneficiaries.length == amounts.length, "Invalid params");

        uint256 total = _assigned;
        console.log("Assigned:", total);

        for (uint256 i = 0; i < beneficiaries.length; i++) {
            total += amounts[i];
            _addBeneficiary(beneficiaries[i], amounts[i]);
        }

        uint256 balance = token.balanceOf(address(this));
        uint256 abc = balance + _released;
        bool ok = abc > total;
        require(ok, "Insufficient Funds");
        _assigned = total;
    }

    function _addBeneficiary(address beneficiary, uint256 tokenAmount) private {
        require(
            beneficiary != address(0),
            "The beneficiary's address cannot be 0"
        );
        require(tokenAmount > 0, "Amount has to be greater than 0");

        if (tokenAmounts[beneficiary] == 0) {
            _beneficiaries.push(beneficiary);
        }

        tokenAmounts[beneficiary] = tokenAmounts[beneficiary] + tokenAmount;
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
        return _beneficiaries;
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
            _released += unreleased;
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
        private
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

        uint256 claimablePercentForCurentPeriod;

        for (
            uint256 i = _claimablePercentIndex;
            i < _unlockEvents.length;
            i++
        ) {
            //unlockEvents[i].percent = 4 for 4%
            uint256 lockedPeriodPercent = _unlockEvents[i].percent * BP;

            if (block.timestamp > _unlockEvents[i].unlockTime) {
                _accumulatedClaimablePercent += lockedPeriodPercent;
            } else {
                // "i" will always be greater than 0 since unlockEvents[0].unlockTime = start
                uint256 totalDaysForCurrentPeriod = (_unlockEvents[i]
                    .unlockTime - _unlockEvents[i - 1].unlockTime) / 1 days;
                uint256 daysPassedForCurrentPeriod = (block.timestamp -
                    _unlockEvents[i - 1].unlockTime) / 1 days;

                claimablePercentForCurentPeriod +=
                    (lockedPeriodPercent * daysPassedForCurrentPeriod) /
                    totalDaysForCurrentPeriod;

                _claimablePercentIndex = i;
                break;
            }
        }

        uint256 resultPercent = _accumulatedClaimablePercent +
            claimablePercentForCurentPeriod;

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
    function claimableAmount(address beneficiary)
        public
        view
        override
        returns (uint256)
    {
        return _claimableAmount(beneficiary, claimablePercent());
    }

    function _claimableAmount(address beneficiary, uint256 percent)
        private
        view
        returns (uint256)
    {
        return
            (tokenAmounts[beneficiary] * percent) /
            (100 * BP) -
            releasedAmount[beneficiary];
    }
}
