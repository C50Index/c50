# 50 Cryptos in 1 - Buy 1 own them all

<img align="right" src="http://www.c50index.com/wp-content/uploads/2018/05/c50-finallogo2b1-1-e1526222711779-206x300.png" alt="c50 Index">

There are thousands of new crypto projects popping up in the world. It takes too much time and skill to sift through all of them.  Why do so much work trying to pick a winner when you can own C50 instead?

C50 is a token backed by the top 50 cryptocurrencies.

It is a simple, safe, and secure way to diversify into crypto in one transaction. No hassle. No stress. No missing out on the next big thing.
Criteria

## All coins and tokens that are included in the C50 Index must meet the following criteria.

- Minimum of one-year since being listed on an exchange
- Yearly average market capitalization of $70 million USD
- Daily trade volume of $1 million
- 50% of the total supply publicly tradable
- Not backed by fiat or commodities (ex. Tether)
- Not backed by other financial instruments
- Not an index of coins or tokens

## Testing
```sh
export PATH=$(dirname $(nodenv which npm)):$PATH; node --inspect-brk $(which truffle) test test/C50V2.test.js
chrome://inspect/
```


## How to deploy c50
The deploy script uses [Ethers JS](https://docs.ethers.io/ethers.js/html/index.html) to handle deployments. 
 It is a rough implemntation of the example code used in the ethers js documentation found here: https://docs.ethers.io/ethers.js/html/api-contract.html?highlight=deploy

#### Steps to deploy:
1. Run `truffle compile` to generate the `/build` files for the contract
2. Create a file named `.mnemonic` in the same directory as `deploy.js'
3. In the `.mnemonic` paste in the mnemonic of the wallet to be deployed
4. Set the `INFURA_PROJECT_ID` environment variable to your Infura project Id [Infura IO](https://infura.io)
5. In `deploy.js` update the infura provider, 
    ```js
    let provider = new ethers.providers.InfuraProvider('ropsten', infuraProjectId);
    ```
    It should work for homestead, ropsten, rinkeby, goerli, and kovan.
    **NOTE 'homestead' is for deploying on the mainnet**

    Infura Provider: https://github.com/ethers-io/ethers.js/blob/04c92bb8d56658b6af6d740d21c3fb331affb9c5/providers/infura-provider.js

6. Run the command `node deploy.js`

## How to Purchase C50

In order to purcahse c50, you must be added to the whitelist by an administrator, if you aren't added you can't buy it

# To Interact with the contract

1. Go to the contracts tab on myetherwallet https://www.myetherwallet.com/#contracts

2. Add the contract address and the ABI.  The ABI will be found in c50/build/contracts/C50V2.json.  You will need to copy only the ABI part, if you copy anything else you won't be able to do transactions.  
```js
{
  "contractName": "C50V2",
  "abi": [copy everything here],
}
```
Note: When you paste in the contract address, make sure it is the checksummed address.  WHich means the address will be uppercase and lowercase letters. https://kb.myetherwallet.com/addresses/what-does-checksummed-mean.html


<img align="right" src="https://user-images.githubusercontent.com/5359580/44953719-2c09b900-aed2-11e8-9477-e5004253fbd3.png" alt="My Ether Wallet Contract Tab">

3. Do your transaction with your wallet provider, ie. Trezor, Ledger, Metamask, etc.
