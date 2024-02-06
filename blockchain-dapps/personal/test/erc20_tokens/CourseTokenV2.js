const CourseTokenV2 = artifacts.require('../../contracts/erc20_tokens/CourseTokenV2.sol');

contract('CourseTokenV2', function(accounts){
    var addr1 = accounts[0], addr2 = accounts[1], addr3 = accounts[2];
    it('should sth', async function(){
       const contract = await CourseTokenV2.deployed();
        var totalSupply = contract.totalSupply.call();
        console.log("TOTAL SUPPLY -> " + totalSupply);
        // Balance should be 1000
        // Transfer 100 tokens from addr1 to addr2
        contract.transfer(addr2, 100, {from: addr1}); // .from prop is msg.sender in contract function
        var addr2Balance = contract.balanceOf.call(addr2);
        console.log("ADDRESS 2 BALANCE -> " + addr2Balance);
        // ADDRESS 1 APPROVES ADDRESS 2 FOR 50 TOKENS
        contract.approve(addr2, 50, {from: addr1});
        // ADDRESS 2 TRANSFERS 5 TOKENS FROM ADDRESS 1 TO ADDRESS 3
        contract.transferFrom(addr1, addr3, 5, {from: addr2});
        // ASSERT END RESULTS NOW ..
        assert.equal()
        
        // CONTINUE TEST LOGIC IF YOU PREFER :)
    
    });
});
