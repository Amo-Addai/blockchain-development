pragma solidity ^0.4.18;


contract WithdrawalContract {
    
    struct Payer {
        address payer;
        uint amount; 
    }
    Payer[] payers;
    

    constructor() public {
        
    }

    function pay() public payable {
        if(msg.value == 0) revert("ERROR!");
        payers.push(Payer(msg.sender, msg.value));
    }

    function withdraw() public {
        for (uint i = 0; i < payers.length; i++) {
            if(msg.sender == payers[i].payer) {
                require(payers[i].amount > 0, "...");
                uint amt = payers[i].amount;
                payers[i].amount = 0;
                // IN CASE .send() / .transfer() RETURNS FALSE, THIS FUNCTION STOPS EXECUTING
                msg.sender.transfer(amt);
                assert(true /*SOME EXPRESSION MUST COME HERE*/); // JUST RETURNS true / false
                return;
            }
        }
        revert("ADDRESS NOT FOUND IN payers LIST");
    }

}

