pragma solidity >=0.4.25 <0.6.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/AutoToken.sol";

contract TestAutoToken {

  function testInitialBalanceUsingDeployedContract() public {
    AutoToken meta = AutoToken(DeployedAddresses.AutoToken());

    uint expected = 10000;

    Assert.equal(meta.getBalance(tx.origin), expected, "Owner should have 10000 AutoToken initially");
  }

  function testInitialBalanceWithNewAutoToken() public {
    AutoToken meta = new AutoToken();

    uint expected = 10000;

    Assert.equal(meta.getBalance(tx.origin), expected, "Owner should have 10000 AutoToken initially");
  }

}
