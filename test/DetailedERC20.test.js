const BigNumber = web3.BigNumber;

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should();

const C50Test4 = artifacts.require('C50.sol');

contract('C50Test4', accounts => {
  let c50Test4 = null;

  const _name = 'Cryptocurrency 50 Index';
  const _symbol = 'C50';
  const _decimals = 18;
  const _totalSupply = 21000000;

  beforeEach(async function () {
    c50Test4 = await C50Test4.new();
  });

  it('has a name', async function () {
    const name = await c50Test4.name();
    name.should.be.equal(_name);
  });

  it('has a symbol', async function () {
    const symbol = await c50Test4.symbol();
    symbol.should.be.equal(_symbol);
  });

  it('has an amount of decimals', async function () {
    const decimals = await c50Test4.decimals();
    decimals.should.be.bignumber.equal(_decimals);
  });

  it('has a total supply', async function () {
    const totalSupply = await c50Test4.totalSupply();
    totalSupply.should.be.bignumber.equal(_totalSupply * 10**_decimals);
  });
});