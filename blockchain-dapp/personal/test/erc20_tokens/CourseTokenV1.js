const CourseTokenV1 = artifacts.require('../../contracts/erc20_tokens/CourseTokenV1.sol');

contract('CourseTokenV1', function(accounts){
    var addr1 = accounts[0], addr2 = accounts[1], addr3 = accounts[2];
    it('should sth', async function(){
       const contract = await CourseTokenV1.deployed();
        var totalSupply = contract.totalSupply.call();
        console.log("TOTAL SUPPLY -> " + totalSupply);
        // Balance should be 1000
        assert.equal(totalSupply.valueOf(), 1000, "Token Contract initialized");
        // Transfer 100 tokens from addr1 to addr2
        contract.transfer(addr2, 100, {from: addr1}); // .from prop is msg.sender in contract function
        var addr2Balance = contract.balanceOf.call(addr2);
        
        // CONTINUE TEST LOGIC IF YOU PREFER :)
    
    });
});
