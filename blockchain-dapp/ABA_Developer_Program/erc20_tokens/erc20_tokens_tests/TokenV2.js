const TokenV2 = artifacts.require('../erc20_tokens_contracts/TokenV2.sol');

contract('TokenV2', function(accounts){
    var addr1 = accounts[0], addr2 = accounts[1], addr3 = accounts[2];
    it('should sth', async function(){
       const contract = await TokenV2.deployed();
        var totalSupply = contract.totalSupply.call();
        // Total Supply / Balance should be 1000
        console.log("TOTAL SUPPLY -> " + totalSupply);
        // Transfer 100 tokens from addr1 to addr2
        contract.transfer(addr2, 100, {from: addr1}); // .from prop is msg.sender in contract function
        
        // ADDRESS 1 APPROVES ADDRESS 2 FOR 50 TOKENS
        contract.approve(addr2, 50, {from: addr1});
        // ADDRESS 2 TRANSFERS 5 TOKENS FROM ADDRESS 1 TO ADDRESS 3
        contract.transferFrom(addr1, addr3, 5, {from: addr2});
        
        var addr1Balance = contract.balanceOf.call(addr1);
        console.log("BALANCE OF ADDRESS 1 -> " + addr1Balance);
        var addr2Balance = contract.balanceOf.call(addr2);
        console.log("BALANCE OF ADDRESS 2 -> " + addr2Balance);
                
        // CONTINUE TEST LOGIC IF YOU PREFER :)
    
    });
});
