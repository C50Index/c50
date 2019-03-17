const C50 = artifacts.require('./c50.sol');
const config = require("../truffle.js");
const Web3 = require('web3');
const Promise = require("bluebird");


const duration = {
    seconds: function (val) { return val; },
    minutes: function (val) { return val * this.seconds(60); },
    hours: function (val) { return val * this.minutes(60); },
    days: function (val) { return val * this.hours(24); },
    weeks: function (val) { return val * this.days(7); },
    years: function (val) { return val * this.days(365); },
};

module.exports = function(deployer, network, accounts) {
    let web3;
    console.log("this is currently unused");

    if (network == 'development') {
        const {
          host,
          port,
        } = config.networks[network]
        web3 = new Web3(new Web3.providers.HttpProvider('http://'+host+':'+port))
    } else if (network == 'ropsten') {
        web3 = new Web3(config.networks[network].provider);
    } else if (network == 'mainnet') {
        web3 = new Web3(config.networks[network].provider);
    } else {
        console.log('We are only able to deploy to a local dev network.')
        console.log('To deploy anywhere else you need to set that up.')
        return
    }

    // if (typeof web3.eth.getAccountsPromise === "undefined") {
    //     Promise.promisifyAll(web3.eth, { suffix: "Promise" })
    // }
    //  web3.eth.getBlockPromise('latest').then(block => {
    // //     return deployer.deploy(C50);
    // });
};