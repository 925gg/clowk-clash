// SPDX-License-Identifier: Unlicense

pragma solidity ^0.8.0;

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
}
