pragma solidity ^0.4.18;

import "./SomeContract.sol";
import "./LibraryContract.sol";


contract SampleContract {
    
    enum TimeUnit {
        Minute, Hour, Day
    }

    uint num; //  THIS IS STORAGE VARIABLE - stored on harddrives of every node within the blockchain
    // STORAGE VARIABLES TAKE A HELL OF A LOT OF SPACE, THEREFORE, USE THEM VERY WISELY (OR ELSE, USE memory)
    event NumberSetEvent(address indexed caller, bytes32 indexed oldNum, bytes32 indexed newNum);
    

    function getNum() public returns (uint n) { n = num; }
    function setNum(uint n) public returns(bool) {
        uint old = num;
        num = n;
        emit NumberSetEvent(msg.sender, bytes32(old), bytes32(num));

        // WORKING WITH MEMORY VARIABLES
        uint memory sth = 0; // THIS VAR ONLY EXISTS IN THIS FUNCTION'S MEMORY, TEMPORARILY ..

        return sth == 0;
    }    


    constructor (uint _num) public {
        num = _num;
    }

}

contract SampleChildContract is SampleContract {

    // WHEN DEFINING THE CONSTRUCTOR, ALSO SETUP THAT OF THE BASE CLASS TOO ..
    constructor(uint _num) SampleContract(_num) public {

    }

    function xx() public constant {
        x = "skajdfa";

    }
}

contract AnotherSampleChildContract is SampleContract(7) {
    // WHEN DEFINING THE CONSTRUCTOR, ALSO SETUP THAT OF THE BASE CLASS TOO ..
    // BUT SINCE YOU'VE SET IT UP IN THE contract {} HEADER, YOU CAN'T DEFINE IT IN constructor()
    constructor(uint _num) public { // SampleContract(_num) 

    }

    function xx() public constant {
        x = "skajdfa";

    }
}


contract AbstractContract {
    struct xyz {
        string name;
    }
    xyz n;

    function calc(uint x) public;
    function calc1(uint x) public returns(uint);
}

interface InterfaceContract {

    function calcInter(uint x) public returns(uint);

/*
Interfaces are similar to abstract contracts, but they cannot have any functions implemented. 
There are further restrictions:

-Cannot inherit other contracts or interfaces.
-Cannot define constructor.
-Cannot define variables.
-Cannot define structs.
-Cannot define enums.
NB: Some of these restrictions might be lifted in the future.
Interfaces are basically limited to what the Contract ABI can represent, 
and the conversion between the ABI and an Interface should be possible without any information loss.
*/

} 

contract Sth is AbstractContract, InterfaceContract {

    function calc(uint x) public returns(uint){ // IMPLEMENTING AN ABSTRACT/INTERFACE METHOD
        return x + 10;
    }

}

// INTER-CONTRACT COMMUNICATION (INTEROPERABILITY)

contract C1 {
    
    uint public x;
    
    constructor() public { // NO ARGUMENTS FOR CONSTRUCTOR FOR NOW
        uint _x = 0;
        x = _x;
    }
    
    function someFunc(address addr) public pure returns(bool) {
        // JUST DO STH HERE ..
        return true;
    }
    
}

contract C2 {
    
    function createC1(address addr) public returns(bool) {
        C1 c1 = new C1(); // PASSING c1addr AS AN ARGUMENT DOESN'T WORK (COZ C1's constructor HAS NO ARGS)
        c1.someFunc(addr); // YOU CAN JUST CALL ITS METHOD IN THESE 3 POSSIBLE WAYS
        
        // THESE 2 WAYS ARE BOTH DEPRECATED THOUGH, SO FIND THE CURRENT WAYS OF USING 'EM
        // address(c1).callcode(bytes4(keccak256("someFunc(address)", addr)));
        // address(c1).delegatecall(bytes4(sha3("someFunc(address)", addr)));
        
        return true;
    }
}

library SampleLibraryContract {
    // THIS TYPE OF SMART CONTRACT HAS NO STATE OR STORAGE, JUST CODE TO BE REUSED BY OTHER CONTRACTS ..
    // SO YOU CAN JUST IMPORT THIS LIBRARY IN ANOTHER .sol FILE USING import "./path/to/this/library/file";
}


