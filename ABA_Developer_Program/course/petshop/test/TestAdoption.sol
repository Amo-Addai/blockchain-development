pragma solidity >=0.4.22 <0.6.0;

import "truffle/Assert.col";
import "truffle/DeployedAddresses.sol";
import "../contracts/Adoption.sol";

contract TestAdoption {
    
    Adoption adoption = Adoption(DeployedAddresses.Adoption());

    function testUserCanAdoptPet() public {
        uint returnedId = adoption.adopt(8); // CONTRACT'S METHOD
        uint expected = 0;
        Assert.equal(returnedId, expected, "Adoption of get ID 8 should be recorded.");
    }

    function testGetAdopterAddressByPetId() public {
        address expected = this; // EXPECTED OWNER IS THIS TEST CONTRACT ITSELF ..
        address adopter = adoption.adopters[8]; // CONTRACT'S PROPERTY
        Assert.equal(adopter, expected, "Owner of pet ID 8 should be recorded.");
    }

    function testGetAdopterAddressByPetIdInArray() public {
        address expected = this;
        // STORE ADOPTERS IN MEMORY, RATHER THAN CONTRACT'S STORAGE ..
        // Coz you only need the array temporarily in memory, to use with Assert statements ..
        address[16] memory adopters = adoption.getAdopters(); // CONTRACT'S METHOD
        Assert.equal(adopters[8], expected, "Owner of pet ID 8 should be recorded.");
    }
    
    function testAdopt() public {
        
    }
    
    function testGetAdopters() public {
        
    }
    
}


//  NOW, FOR THE TESTING HOOKS IN TEST CONTRACT ..

contract TestHooks {
    uint someValue;

    function beforeEach() public {
        someValue = 5;
    } // ALSO AVAILABLE - beforeAll() afterEach() afterAll()

    // USE THIS EXTRA TESTING HOOK; IT'S GOOD FOR SETTING UP COMPLEX TESTING OPERATIONS ..
    function beforeEachAgain() public {
        someValue++;
    }
}
