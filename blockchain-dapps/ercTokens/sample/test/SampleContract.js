const SampleContract = artifacts.require('../../contracts/SampleContract.sol');

contract('SampleContract', function(accounts){
   it('should assert true', async function(){
      const contract = await SampleContract.deployed();
      contract.someFunction();
      
    });
});