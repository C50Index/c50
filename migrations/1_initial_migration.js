const C50 = artifacts.require("./C50V2.sol");
// var Migrations = artifacts.require("Migrations");

module.exports = function(deployer, network, accounts) {
	  // deployer.deploy(Migrations);
	if(network === "development") {
		return deployer.deploy(C50, {from: "0x171a848f509ef3d9c150f82114d94e26ea6c4a0e"});
	} else if (network === "ropsten") {
		return deployer.deploy(C50, {from: "0xe7e09b476c2b742b5c237ecb4dc201672ccc6bb1"});
	} else if (network === "mainnet") {
		return deployer.deploy(C50); // TODO
	}
}