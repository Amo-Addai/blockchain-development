const AutoToken = artifacts.require("AutoToken");

contract('autotoken', function(accounts) {
  
  it("should assert true", function(done) {
    var autotoken = AutoToken.deployed();
    assert.isTrue(true);
    done();
  });
  
  it('should put 10000 AutoToken in the first account', async () => {
    const autoTokenInstance = await AutoToken.deployed();
    const balance = await autoTokenInstance.getBalance.call(accounts[0]);

    assert.equal(balance.valueOf(), 10000, "10000 wasn't in the first account");
  });
  
  it('should call a function that depends on a linked library', async () => {
    const autoTokenInstance = await AutoToken.deployed();
    const autoTokenBalance = (await autoTokenInstance.getBalance.call(accounts[0])).toNumber();
    const autoTokenEthBalance = (await autoTokenInstance.getBalanceInEth.call(accounts[0])).toNumber();

    assert.equal(autoTokenEthBalance, 2 * autoTokenBalance, 'Library function returned unexpected function, linkage may be broken');
  });
  
  it('should send Token correctly', async () => {
    const autoTokenInstance = await AutoToken.deployed();

    // Setup 2 accounts.
    const accountOne = accounts[0];
    const accountTwo = accounts[1];

    // Get initial balances of first and second account.
    const accountOneStartingBalance = (await autoTokenInstance.getBalance.call(accountOne)).toNumber();
    const accountTwoStartingBalance = (await autoTokenInstance.getBalance.call(accountTwo)).toNumber();

    // Make transaction from first account to second.
    const amount = 10;
    await autoTokenInstance.sendToken(accountTwo, amount, { from: accountOne });

    // Get balances of first and second account after the transactions.
    const accountOneEndingBalance = (await autoTokenInstance.getBalance.call(accountOne)).toNumber();
    const accountTwoEndingBalance = (await autoTokenInstance.getBalance.call(accountTwo)).toNumber();


    assert.equal(accountOneEndingBalance, accountOneStartingBalance - amount, "Amount wasn't correctly taken from the sender");
    assert.equal(accountTwoEndingBalance, accountTwoStartingBalance + amount, "Amount wasn't correctly sent to the receiver");
  });

});
