// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract FlayerToken is ERC20 {
    constructor() ERC20("Flayer", "FLT") {}

    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
}
