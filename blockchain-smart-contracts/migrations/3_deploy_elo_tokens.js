const EloToken = artifacts.require("ELOToken");
const EloPresaleToken = artifacts.require("ELOPresale");

module.exports = function (deployer) {
  deployer.deploy(EloToken);
  deployer.deploy(EloPresaleToken);
};
