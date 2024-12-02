// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract EcoToken is ERC20 {
    constructor() ERC20("EcoToken", "ECO") {
        _mint(msg.sender, 1_000_000 * 10 ** decimals()); // Mint 1 million tokens to deployer
    }

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }

    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }
}
