pragma solidity ^0.4.18;


contract NameRegistryContract {
    
    struct ContractInfo {
        address owner; // OWNER OF THIS CONTRACT ITSELF (AS IN THE DApp THAT INVOKES THIS NameRegistryContract :)
        address contractInstance; // ADDRESS OF THE CONTRACT INSTANCE
        uint16 version;  // version MUST ALWAYS BE >= 1
    }
    mapping(bytes32 => ContractInfo) nameInfo;
    

    constructor() public {
        
    }

    function registerName(bytes32 name, address conAddress, uint16 ver) public returns(bool) { 
        if(ver < 1) revert("Error"); // IF VERSION IS NOT >= 1, ERROR!!!
        ContractInfo storage conInfo = nameInfo[name];
        if(conInfo.contractInstance == 0){ // IF CONTRACT (ContractInfo) DOESN'T ALREADY EXIST ..
            nameInfo[name] = ContractInfo(msg.sender, conAddress, ver);
        } else { // IF CONTRACT ALREADY EXISTS ..
            if (conInfo.owner != msg.sender) revert("This is not the owner of the NameRegistryContract SmartContract");
            // UPDATING NEW DATA (MAYBE NEW ADDRESS OR VERSION) NOW ..
            conInfo.contractInstance = conAddress;
            conInfo.version = ver;
        }
        return true;
    }

    function getContractInfo(bytes32 name) public view returns(address, uint16) { 
        return ( nameInfo[name].contractInstance, nameInfo[name].version );
    }

}

