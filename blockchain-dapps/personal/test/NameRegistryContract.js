const NameRegistryContract = artifacts.require('../../contracts/NameRegistryContract.sol');

contract('NameRegistryContract', function(accounts){
   it('should assert true', async function(){
      const contract = await NameRegistryContract.deployed();
      contract.registerName('Name of contract / account', generateRandomAddress(), 1);
      contract.registerName('Name of contract / account', generateRandomAddress(), 1);
      printRegistry(NameRegistryContract); // NOW, UPDATE INFO OF A CONTRACT
      contract.registerName('Name of contract / account', generateRandomAddress(), 2);
      printRegistry(NameRegistryContract); // AND printRegistry() AGAIN

    });
});