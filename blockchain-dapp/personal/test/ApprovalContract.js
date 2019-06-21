const ApprovalContract = artifacts.require('../../contracts/ApprovalContract.sol');

contract('ApprovalContract', function(accounts){
   it('should sth', async function(){
      const contract = await ApprovalContract.deployed();
      const approver = await contract.approve.call();
      // THERFORE ASSERTS THAT approver EQUALS THE ADDRESS 0xC5fd
       // THAT'S THE ADDRESS OF THE APPROVER, IN THE .sol CONTRACT
      assert.equal(approver, 0xC5fd, "approvers don't match");
   });

   it('takes a deposit', async function() {
      const contract = await ApprovalContract.deployed();
      await contract.deposit(accounts[0], { value: 1e+18, from: accounts[1] });
      assert.equal(web3.eth.getBalance(contract.address), 1e+18, "amount did not match");
   });

   // ANOTHER PERSONAL TEST FUNCTION
   it('should sth again', async function(){
       var functs;
       return ApprovalContract.deployed().then((instance) => {
        instance.someFunctionInContract(/*PARAMS*/)
       })
   });
});