//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.10;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract ClashToken is ERC20Pausable, Ownable {

  constructor(string memory _name, string memory _symbol) ERC20(_name, _symbol) {
    _mint(_msgSender(), 5000000000 * 1 ether);
  }

  function mint(address _receiver, uint256 _amount) external onlyOwner {
    _mint(_receiver, _amount);
  }

  function burn(uint256 amount) public virtual {
    _burn(_msgSender(), amount);
  }

  function pause() external onlyOwner {
    _pause();
  }

  function unpause() external onlyOwner {
    _unpause();
  }

}