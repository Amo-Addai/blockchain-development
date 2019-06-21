const ConvertLib = artifacts.require("ConvertLib");
const AutoToken = artifacts.require("AutoToken");

module.exports = function(deployer) {
  deployer.deploy(ConvertLib);
  deployer.link(ConvertLib, AutoToken);
  deployer.deploy(AutoToken);
};
