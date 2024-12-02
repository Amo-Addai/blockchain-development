const EcoToken = artifacts.require("EcoToken");
const EcoToken1 = artifacts.require("EcoToken1");
const EcoToken2 = artifacts.require("EcoToken2");

module.exports = function (deployer) {
  deployer.deploy(EcoToken);
  deployer.deploy(EcoToken1);
  deployer.deploy(EcoToken2);
};
