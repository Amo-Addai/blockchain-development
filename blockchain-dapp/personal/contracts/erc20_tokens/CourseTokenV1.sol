pragma solidity ^0.4.18;



contract CourseTokenV1 {  // NOT YET ERC20 COMPLIANT (DOESN'T IMPLEMENT ALL STANDARD / REQUIRED 6 FUNCTIONS & 2 EVENTS)
    
    //  MAIN TOKEN PROPERTIES
    string public constant name = "DAPP Course Token";
    string public constant symbol = "DCT";
    uint public constant decimal = 0;

    //  CUSTOM TOKEN PROPERTIES
    uint256 public totalSupply;
    // every account that has tokens will be managed in this mapping
    mapping(address => uint256) balances;

    //  MAIN EVENTS
    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    //  CUSTOM EVENTS
    

    constructor (uint256 initSupply) public {
        totalSupply = initSupply;
        balances[msg.sender] = totalSupply;
    }

    //  MAIN FUNCTIONS
    function transfer(address _to, uint256 _value) public returns (bool success) {
        if(_value > 0 && balances[msg.sender] < _value) return false;
        balances[msg.sender] -= _value; // DECREMENT BALANCE OF SENDER, COZ COME TOKENS ARE ABOUT TO BE TRANSFERED
        balances[_to] += _value;
        // DONE WITH TRANSFER, NOW EMITTING THE Transfer Event
        emit Transfer(msg.sender, _to, _value); // EMIT THIS EVENT
        success = true; // SINCE success IS AUTO-RETURNED
        // return true;
    }

    function balanceOf(address _owner) public returns (uint256 balance) {
        balance = balances[_owner];
        // return balance
    }

    //  CUSTOM FUNCTIONS


}