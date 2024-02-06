const Adoption = artifacts.require('../contracts/Adoption.sol');

contract('Adoption', function(accounts){
   it('should do sth', async function(){
      const contract = await Adoption.deployed();
      const approver = await contract.approve.call();
      // THERFORE ASSERTS THAT approver EQUALS THE ADDRESS 0xC5fd
       // THAT'S THE ADDRESS OF THE APPROVER, IN THE .sol CONTRACT
      assert.equal(approver, 0xC5fd, "approvers don't match");
   });

   // ANOTHER PERSONAL TEST FUNCTION
   it('should sth again', async function(){
       var functs;
       return Adoption.deployed().then((instance) => {
        instance.someFunctionInContract(/*PARAMS*/)
       })
   });
});