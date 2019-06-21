pragma solidity ^0.4.18;



contract TokenV1 {  // NOT YET ERC20 COMPLIANT (DOESN'T IMPLEMENT ALL STANDARD / REQUIRED 6 FUNCTIONS & 2 EVENTS)
    
    //  MAIN TOKEN PROPERTIES
    string public constant name = "DAPP Token";
    string public constant symbol = "DCT";
    uint public constant decimal = 0;

    //  CUSTOM TOKEN PROPERTIES
    uint256 public totalSupply;

    // every account that has tokens will be managed in this mapping
    mapping(address => uint256) balances;

    //  MAIN EVENTS
    event Transfer(address indexed _from, address indexed _to, uint256 _value);

    //  CUSTOM EVENTS
    // Feel free to add any custom events of your choice

    constructor (uint256 initSupply) public {
        totalSupply = initSupply;
        balances[msg.sender] = totalSupply;
    }

    //  MAIN FUNCTIONS

    function totalSupply() public returns (uint256 totalSupply) {
        if(totalSupply != 1000) totalSupply = 1000;
        // SO IN CASE constructor's initSupply IS NOT 1000, THEN YOU CAN SET IT TO 1000 HERE
        // NOTE THAT IT IS NOT COMPULSORY FOR totalSupply TO BE 1000 THOUGH
    }

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