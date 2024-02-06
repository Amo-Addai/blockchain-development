const WithdrawalContract = artifacts.require('../../contracts/WithdrawalContract.sol');

contract('WithdrawalContract', function(accounts){
   it('should assert true', async function(){
      const contract = await WithdrawalContract.deployed();
      contract.pay({}); // OR PASS IN SOME ETHER GAS OR STH ..
      contract.pay({}); // OR PASS IN SOME ETHER GAS OR STH ..
      
    });
});