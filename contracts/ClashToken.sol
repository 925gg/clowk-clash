//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ClashToken is ERC20, Ownable {
    uint256 public constant MAX_SUPPLY = 5_0000_000_000e18;

    constructor(string memory _name, string memory _symbol)
        ERC20(_name, _symbol)
    {
        _mint(_msgSender(), MAX_SUPPLY);
    }
}
