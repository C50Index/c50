const C50 = artifacts.require('C50V2');
const EVMRevert = 'revert';
const BN  = web3.utils.BN;

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BN))
  .should();

function ether (n) {
  return new BN(web3.toWei(n, 'ether'));
}

contract('C50V2', function ([_, owner, investor, purchaser]) {
  const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

  const _name = 'Cryptocurrency 50 Index';
  const _symbol = 'C50';
  const _decimals = 18;
  const _maxSupply =  new BN('250000000000').mul(new BN('10').pow(new BN(String(_decimals))));
  const _initialSupply = new BN('10000000').mul(new BN('10').pow(new BN(String(_decimals))));
  const rate = new BN('500');

  const value = new BN(String(1 * 10 ** _decimals));

  const expectedTokenAmount = rate.mul(value);

  beforeEach(async function () {
    token = await C50.new({from: owner});
  });

  describe('accepting payments', function () {
    it('should accept payments', async function () {
      await token.addToWhiteList(_, {from: owner});
      status = await token.onWhitelist(_, {from: investor});
      assert.equal(status, true);
      await token.send(value);
    });
  });

  describe('high-level purchase', function () {
    it('should log purchase', async function () {
      await token.addToWhiteList(investor, {from: owner});

      const { logs } = await token.sendTransaction({ value: value, from: investor });
      const event = logs.find(e => e.event === 'TokenPurchase');

      assert.equal(event.event, 'TokenPurchase');
      assert.equal(event.args.purchaser, investor);
      assert.equal(event.args.value.toString(), value.toString());
      assert.equal(event.args.amount.toString(), expectedTokenAmount.toString());
    });

    it('should assign tokens to sender', async function () {
      await token.addToWhiteList(investor, {from: owner});

      await token.sendTransaction({ value: value, from: investor });
      const balance = await token.balanceOf(investor);

      assert.equal(balance.toString(), expectedTokenAmount.toString());
    });

    it('should forward funds to owner', async function () {
      await token.addToWhiteList(investor, {from: owner});
      const pre = await web3.eth.getBalance(owner);
      await token.sendTransaction({ value, from: investor });
      const post = await web3.eth.getBalance(owner);
      const after = new BN(post).sub(new BN(pre));
      assert.equal(after.toString(), value.toString());
    });
  });

  describe('low-level purchase', function () {
    it('should log purchase', async function () {
      await token.addToWhiteList(investor, {from: owner});
      const { logs } = await token.buyTokens(investor, { value: value, from: purchaser });
      const event = logs.find(e => e.event === 'TokenPurchase');
      assert.equal(event.event, 'TokenPurchase');
      assert.equal(event.args.purchaser, purchaser);
      assert.equal(event.args.value.toString(), value.toString());
      assert.equal(event.args.amount.toString(), expectedTokenAmount.toString());
    });

    it('should assign tokens to beneficiary', async function () {
      await token.addToWhiteList(investor, {from: owner});
      await token.buyTokens(investor, { value, from: purchaser });
      const balance = await token.balanceOf(investor);
      assert.equal(balance.toString(), expectedTokenAmount.toString());
    });

    it('should forward funds to owner', async function () {
      await token.addToWhiteList(investor, {from: owner});

      const pre = await web3.eth.getBalance(owner);
      const { logs } = await token.buyTokens(investor, { value, from: purchaser });
      const event = logs.find(e => e.event === 'TokenPurchase');
      assert.equal(event.event, 'TokenPurchase');
      const post = await web3.eth.getBalance(owner);
      const after = new BN(post).sub(new BN(pre));

      assert.equal(after.toString(), value.toString());
    });
  });
});