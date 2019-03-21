const ethers = require('ethers');
const path = require('path'); // Helps to find the path to the contract across whatever OS you are using form compile.js to xxx.sol files
const fs = require('fs'); // Load the FileSystem Module.

const contractPath = path.resolve(__dirname, 'build', 'contracts', 'C50.json'); //Creation of cross SO's path.
const mnemonicPath = path.resolve(__dirname, '.mnemonic');

const source = JSON.parse(fs.readFileSync(contractPath));
const mnemonic = fs.readFileSync(mnemonicPath);
const abi = source.abi;
const bytecode = source.bytecode;
const infuraProjectId = process.env.INFURA_PROJECT_ID;

// Connect to the network
let provider = new ethers.providers.InfuraProvider('ropsten', infuraProjectId);

// Load the wallet to deploy the contract with
let wallet = ethers.Wallet.fromMnemonic(mnemonic.toString()).connect(provider);


// Deployment is asynchronous, so we use an async IIFE
(async function() {

    // Create an instance of a Contract Factory
    let factory = new ethers.ContractFactory(abi, bytecode, wallet);

    let contract = await factory.deploy();

    console.log("The address the Contract WILL have once mined");
    console.log("See:");
    console.log("Successfully deployed contract: ", contract.address);
    console.log(`Go to https://ropsten.etherscan.io/address/${contract.address} for more details\n\n`)

    console.log("The transaction that was sent to the network to deploy the Contract")
    console.log(`See: https://ropsten.etherscan.io/tx/${contract.deployTransaction.hash}`)
    console.log(contract.deployTransaction.hash);

    console.log("The contract is NOT deployed yet; we must wait until it is mined")
    await contract.deployed()

    console.log("Done! The contract is deployed.")
})();
