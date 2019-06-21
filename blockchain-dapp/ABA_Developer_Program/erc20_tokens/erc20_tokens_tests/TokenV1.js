const TokenV1 = artifacts.require('../erc20_tokens_contracts/TokenV1.sol');

contract('TokenV1', function(accounts){
    var addr1 = accounts[0], addr2 = accounts[1], addr3 = accounts[2];
    it('should assert true', async function(){
       const contract = await TokenV1.deployed();
        var totalSupply = contract.totalSupply.call();
        console.log("TOTAL SUPPLY -> " + totalSupply);
        // Total Supply Balance should be 1000
        assert.equal(totalSupply.valueOf(), 1000, "Token Contract initialized");
        // Transfer 100 tokens from addr1 to addr2
        contract.transfer(addr2, 100, {from: addr1}); // .from prop is msg.sender in contract function
        // Now, balance of addr1 (should be 900) and addr2 (should be 100)
        var addr1Balance = contract.balanceOf.call(addr1);
        console.log("BALANCE OF ADDRESS 1 -> " + addr1Balance);
        var addr2Balance = contract.balanceOf.call(addr2);
        console.log("BALANCE OF ADDRESS 2 -> " + addr2Balance);
        
        // CONTINUE TEST LOGIC IF YOU PREFER :)
    
    });
});
