var ApprovalContract = artifacts.require("./ApprovalContract.sol");
var SomeContract = artifacts.require("./path/to/SmartContract.sol");

module.exports = function(deployer) {
    deployer.deploy(ApprovalContract);
    deployer.deploy(SomeContract);
};
