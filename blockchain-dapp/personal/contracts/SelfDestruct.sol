pragma solidity ^0.4.18;


contract SelfDestruct {
    
    address public owner;
    string public someValue = "sth";

    function setValue(string value) private {
        someValue = value;
    }

    modifier OwnerOnly {
        if(msg.sender != owner) revert("Only the Owner of this Smart Contract can access it");
        else _;
    }

    constructor() public {
        owner = msg.sender;
    }

    function killContract() public OwnerOnly { 
        selfdestruct(owner); // TAKES AN ADDRESS OF CONTRACT TO KILL
    }
}

