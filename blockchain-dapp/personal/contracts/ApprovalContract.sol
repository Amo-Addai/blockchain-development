pragma solidity ^0.4.18;

contract ApprovalContract {

    address public sender;
    address public receiver;
    address public constant approver = 0xC5fd; // THE ADDRESS IS LONGER

    // external: allows this funct to be called from outside contract too
    // payable: so function takes in ether
    function deposit(address _receiver) external payable {
        // msg (special object) has props (.sender of money & .value of ether sent)
        require(msg.value > 0); // IF THIS ASSERTION IS FALSE, AN ERROR IS THROWN
        // THEREFORE, IF THIS FAILS, THIS FUNCTION ENDS

        sender = msg.sender; // msg.sender IS AN address OBJECT
        receiver = _receiver; // _receiver IS AN address OBJECT
    }

    //  pure: USED WHEN FUNCT ACCESSES A constant WHICH WON'T CHANGE, & DOESN'T COST ANY ETHER GAS
    function viewApprover() external pure returns(address) {
        return(approver);
    }

    function approve() external {
        require(msg.sender == approver, "...");
        // TRANSFER BALANCE OF THIS contract's address TO THE receiver contract
        receiver.transfer(address(this).balance); // FUNCTIONS OTHER THAN transfer() CAN BE USED
    }


}