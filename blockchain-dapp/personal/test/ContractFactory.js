const ContractFactory = artifacts.require('../../contracts/ContractFactory.sol');
const ChildContract = artifacts.require('../../contracts/ChildContract.sol');

contract('ContractFactory', function(accounts){
   it('should assert true', async function(){
      const contract = await ContractFactory.deployed();
      contract.purchase('Name of contract / account', {value: 100, from: accounts[1]});
      contract.purchase('Name of contract / account', {value: 100, from: accounts[2]});
      printOwners(ContractFactory);
      const childAddress = contract.getChildContractAddress.call(0); // PASS IN AN INDEX eg. 0 FOR 1ST CHILD
      const childContract = ChildContract.at(childAddress);
      childContract.transferOwnership(accounts[3], "Some name", {from: accounts[1]});
      // CALLING THE transferOwnership() METHOD TO CHANGE OWNERSHIP FROM accounts[1] TO accounts[3]
    });

});