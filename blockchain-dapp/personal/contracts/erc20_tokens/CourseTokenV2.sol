pragma solidity ^0.4.18;

import "./CourseTokenV1.sol";

contract CourseTokenV2 is CourseTokenV1 {  // ERC20 COMPLIANT COZ IT HAS ALL STANDARD / REQUIRED 6 FUNCTIONS & 2 EVENTS
     
    //  MAIN TOKEN PROPERTIES
    

    //  CUSTOM TOKEN PROPERTIES
    
    // map [approver_account_address] [spender_account_address] -> uint256 value is number of tokens allowed to be spent
    mapping(address => mapping(address => uint256)) allowances;

    //  MAIN EVENTS
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);
    //  CUSTOM EVENTS
    

    constructor (uint256 initSupply) CourseTokenV1(initSupply) public {
        
    }

    //  MAIN FUNCTIONS
    function approve(address _spender, uint256 _value) public returns (bool success) {
        if(_value < 0) return false;
        allowances[msg.sender][_spender] = _value; // ADD/EDIT THE AMOUNT IN THE MAPPING
        emit Approval(msg.sender, _spender, _value); // EMIT THIS EVENT
        success = true; // SINCE success IS AUTO-RETURNED
        // return true;
    }

    //  MAIN FUNCTIONS
    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
        if(_value <= 0) return false;
        // CHECK IF SPENDER IS ALLOWED TO SPEND _value FROM _from ACCOUNT
        if(allowances[_from][msg.sender] < _value) return false;
        // CHECK IF ACCOUNT _from HAS ENOUGH TOKENS
        if(balances[_from] < _value) return false;
        // IF ALL CHECKS ARE SUCCESSFUL, THEN CONTINUE THE EXECUTION
        balances[_from] -= _value; // DECREMENT BALANCE OF SENDER, COZ COME TOKENS ARE ABOUT TO BE TRANSFERED
        balances[_to] += _value;
        allowances[_from][msg.sender] -= _value; // NOW, REDUCE ALLOWANCE COZ TOKEN _value HAS BEEN SENT
        // DONE WITH TRANSFER, NOW EMITTING THE Transfer Event 
        emit Transfer(_from, _to, _value); // EMIT THIS EVENT
        success = true; // SINCE success IS AUTO-RETURNED
        // return true;
    }

    //  CUSTOM FUNCTIONS


}