pragma solidity ^0.4.18;


contract ChildContract {
    
    address public owner;
    uint8 public identity;
    bytes32 public name;

    modifier OwnerOnly {
        if(msg.sender != owner) revert("Only the Owner of this Smart Contract can access it");
        else _; // _ (underscore) REPS WHERE THE FUNCTION OWNED BY THIS MODIFIER WILL EXECUTE
    }
    event ChildOwnerTransfered(uint8 identity, bytes32 from, bytes32 to);

    constructor(uint8 id, address own, bytes32 nm) public {
        identity = id;
        owner = own;
        name = nm;
    }

    function transferOwnership(address newOwner, bytes32 nm) public OwnerOnly {
        bytes32 former = name;
        owner = newOwner;
        name = nm;
        emit ChildOwnerTransfered(identity, former, name);
    }

    function isOwner(address addr) public view returns(bool) {
        return (addr == owner);
    }

    function kill() public { if( msg.sender == owner ) selfdestruct(owner); }

    // FALLBACK FUNCTION TO RUN WHENEVER THERE'S SOME KINDA ISSUE ..
    function () external payable { // NO function name, params, or return values ..
        // THIS FALLBACK FUNCTION WILL EXECUTE IF THE CLIENT CALLS A FUNCTION
        // THAT DOESN'T EXIST IN THIS CONTRACT (i.e. funct's identifier isn't defined)
        // CONTRACTS CAN HAVE ONLY 1 FALLBACK FUNCTION
        // AUTO'LY HAS A GAS LIMIT OF 2300, 
        // MAKE FALLBACK FUNCTIONS AS CHEAP AS POSSIBLE

    }
}

