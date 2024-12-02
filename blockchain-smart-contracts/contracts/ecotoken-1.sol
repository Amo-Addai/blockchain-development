// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract EcoToken1 is ERC20, Ownable {
    constructor() ERC20("EcoToken", "ECO") Ownable(msg.sender) { // Ownable (with @openzeppelin) base-call triggers an 'invalid opcode' deployment error
        // Ownable.transferOwnership(msg.sender);  // Explicitly transferring ownership - also triggers error
        // todo: use a custom Ownable implementation

        _mint(msg.sender, 1_000_000 * 10 ** decimals()); // Mint 1 million tokens to deployer
    }

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }
}
