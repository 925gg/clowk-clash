// SPDX-License-Identifier: Unlicense

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ClashToken is ERC20, Ownable {
    uint256 public constant MAX_SUPPLY = 5_0000_000_000 ether;

    constructor(
        string memory _name,
        string memory _symbol,
        address treasury
    ) ERC20(_name, _symbol) {
        _mint(treasury, MAX_SUPPLY);
    }

    /**
     * withdraw ERC20 tokens in case of accidentally transfer - owner only
     */
    function withdrawAllERC20(IERC20 erc20Token) external onlyOwner {
        uint256 balance = erc20Token.balanceOf(address(this));
        require(balance > 0, "Balance must be greater than 0");

        erc20Token.transfer(owner(), balance);
    }
}
