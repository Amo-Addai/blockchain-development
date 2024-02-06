pragma solidity ^0.4.18;

import "./ContractFactory";

contract ContractFactory {
    
    address public owner;
    uint8 public initialPrice;
    ChildContract[] children;

    modifier OwnerOnly {
        if(msg.sender != owner) revert("Only the Owner of this Smart Contract can access it");
        else _;
    }

    constructor(uint8 numParts, uint8 price) public {
        owner = msg.sender;
        for(uint8 i = 0; i < numParts; i++){
            // this REPRESENTS THE ADDRESS OF "this" SMART CONTRACT
            children.push(new ChildContract(i, this, "***"));
        }
        initialPrice = price;
    }

    function purchase(bytes32 name) public payable { 
        if(msg.value < initialPrice) revert("Price is too low");
        for(uint8 i = 0; i < children.length; i++){
            if(children[i].isOwner(this)){
                children[i].transferOwnership(owner, name);
                return;
            }
        }
        revert("Contract Factory does not own any SmartContract with the specified address");
    }

}

