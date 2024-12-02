// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Ownable {
    address private _owner;

    constructor(address initialOwner) {
        _owner = initialOwner;
    }

    modifier onlyOwner() {
        require(msg.sender == _owner, "Ownable: caller is not the owner");
        _;
    }

    function transferOwnership(address newOwner) external onlyOwner {
        _owner = newOwner;
    }

    function owner() public view returns (address) {
        return _owner;
    }
}

contract EcoToken2 is ERC20 {
    address private _owner;

    constructor() ERC20("EcoToken", "ECO") {
        // _owner = msg.sender;
        _mint(msg.sender, 1_000_000 * 10 ** decimals()); // Mint 1 million tokens to deployer
    }

    modifier onlyOwner() {
        require(msg.sender == _owner, "Ownable: caller is not the owner");
        _;
    }

    function mint(address to, uint256 amount) external {// onlyOwner {
        _mint(to, amount);
    }

    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }

    function transferOwnership(address newOwner) external {// onlyOwner {
        _owner = newOwner;
    }

    function owner() public view returns (address) {
        return _owner;
    }
}
