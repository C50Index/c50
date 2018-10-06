const C50 = artifacts.require("./C50V2.sol");

module.exports = function(deployer, network, accounts) {
	if(network === "development") {
		return deployer.deploy(C50);
	} else if (network === "ropsten") {
		return deployer.deploy(C50, {from: "0xe7e09b476c2b742b5c237ecb4dc201672ccc6bb1"});
	} else if (network === "mainnet") {
		return deployer.deploy(C50); // TODO
	}
}
