pragma solidity >=0.4.22 <0.6.0;

contract Adoption {
    
    address[16] public adopters; // public, SO HAS A GETTER FUNCTION
    // HOWEVER, ITS GETTER, COZ THIS IS AN ARRAY, WILL REQUIRE AN INDEX PARAM TO RETURN JUST 1 ITEM
    
    
    function adopt(uint petId) public returns(uint) {
        require(petId >= 0 && petId <= 15);
        adopters[petId] = msg.sender; // ADDRESS OF SENDER/CALLER OF THIS FUNCTION
        return petId;
    }
    
    function getAdopters() public view returns(address[16] memory) {
        return adopters; // THIS CUSTOM GETTER IS TO RETURN THE WHOLE ARRAY (& NOT JUST 1 ITEM)
    }
    
}
