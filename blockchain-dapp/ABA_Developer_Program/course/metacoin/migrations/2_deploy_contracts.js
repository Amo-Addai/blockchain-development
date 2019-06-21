const ConvertLib = artifacts.require("ConvertLib");
const MetaCoin = artifacts.require("MetaCoin");

module.exports = function(deployer) {
  deployer.deploy(ConvertLib); // DEPLOY THIS CONTRACT LIBRARY 1ST ..
  deployer.link(ConvertLib, MetaCoin); //  THEN LINK THE LIBRARY TO THE MetaCoin CONTRACT
  deployer.deploy(MetaCoin); // BEFORE, YOU NOW DEPLOY THE MetaCoin CONTRACT ..
};
