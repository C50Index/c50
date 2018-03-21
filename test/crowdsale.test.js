function ether (n) {
  return new web3.BigNumber(web3.toWei(n, 'ether'));
}

function latestTime () {
  return web3.eth.getBlock('latest').timestamp;
}

function advanceBlock () {
  return new Promise((resolve, reject) => {
    web3.currentProvider.sendAsync({
      jsonrpc: '2.0',
      method: 'evm_mine',
      id: Date.now(),
    }, (err, res) => {
      return err ? reject(err) : resolve(res);
    });
  });
}

const duration = {
    seconds: function (val) { return val; },
    minutes: function (val) { return val * this.seconds(60); },
    hours: function (val) { return val * this.minutes(60); },
    days: function (val) { return val * this.hours(24); },
    weeks: function (val) { return val * this.days(7); },
    years: function (val) { return val * this.days(365); },
};

function increaseTime (duration) {
  const id = Date.now();

  return new Promise((resolve, reject) => {
    web3.currentProvider.sendAsync({
      jsonrpc: '2.0',
      method: 'evm_increaseTime',
      params: [duration],
      id: id,
    }, err1 => {
      if (err1) return reject(err1);

      web3.currentProvider.sendAsync({
        jsonrpc: '2.0',
        method: 'evm_mine',
        id: id + 1,
      }, (err2, res) => {
        return err2 ? reject(err2) : resolve(res);
      });
    });
  });
}

function increaseTimeTo (target) {
  let now = latestTime();
  if (target < now) throw Error(`Cannot increase current time(${now}) to a moment in the past(${target})`);
  let diff = target - now;
  return increaseTime(diff);
}

const EVMRevert = 'revert';
const BigNumber = web3.BigNumber;

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should();

const Crowdsale = artifacts.require('C50Crowdsale.sol');
const C50 = artifacts.require('C50');

contract('C50Crowdsale', function ([_, owner, wallet, investor, purchaser, tokenWallet]) { 
  const rate = new BigNumber(6720);
  const cap = ether(313);
  const lessThanCap = ether(312);
  const maxSupply = new BigNumber('2.1e25');
  const value = ether(1);
  const crowdsaleAmount = new web3.BigNumber('2.1e24');
  const expectedTokenAmount = rate.mul(value);

  beforeEach(async function () {
    this.openingTime = latestTime() + duration.weeks(1);
    this.closingTime = this.openingTime + duration.weeks(1);
    this.afterClosingTime = this.closingTime + duration.seconds(1);
    this.token = await C50.new({from: owner});
    this.crowdsale = await Crowdsale.new(this.openingTime, this.closingTime, rate, wallet, cap, tokenWallet, this.token.address, { from: owner });
  });

  describe('full test', function() {
    it('success', async function () {
      // investor starts with 0 c50
      let balance = await this.token.balanceOf(investor);
      balance.should.be.bignumber.equal(0);

      let investorPreEth = web3.eth.getBalance(investor);


      const walletBefore = web3.eth.getBalance(wallet);

      let ownerBalance = await this.token.balanceOf(owner);
      ownerBalance.should.be.bignumber.equal(maxSupply);

      await this.token.transfer(tokenWallet, crowdsaleAmount, {from: owner});
      let tokenWalletBalance = await this.token.balanceOf(tokenWallet);
      tokenWalletBalance.should.be.bignumber.equal(crowdsaleAmount);

      // Can't send until crowdsale is the owner of the token and time is started and the wallet has the money
      await this.crowdsale.sendTransaction({ value: value, from: investor }).should.be.rejectedWith(EVMRevert);
      await this.token.approve(this.crowdsale.address, crowdsaleAmount, { from: tokenWallet })

      await this.crowdsale.sendTransaction({ value: value, from: investor }).should.be.rejectedWith(EVMRevert);
      await increaseTimeTo(this.openingTime);

      await this.crowdsale.sendTransaction({ from: investor, value: value }).should.be.fulfilled;

      // // Wallet is increased by the value of ether
      let walletAfter = web3.eth.getBalance(wallet);
      walletAfter.minus(walletBefore).should.be.bignumber.equal(value);

      // // Investor should increase tokens by val * rate
      let investorSupply = await this.token.balanceOf(investor);
      investorSupply.should.be.bignumber.equal(value.mul(rate));


      // // If cap is reached crowdsale can't receive any more
      // // When crowdsale ends, no more can be sent
      await increaseTimeTo(this.afterClosingTime);
      await this.crowdsale.sendTransaction({ value: value, from: investor }).should.be.rejectedWith(EVMRevert);
    })
  });

  describe('timed crowdsale', function() {
    it('should be ended only after end', async function () {
      let ended = await this.crowdsale.hasClosed();
      ended.should.equal(false);
      await increaseTimeTo(this.afterClosingTime);
      ended = await this.crowdsale.hasClosed();
      ended.should.equal(true);
    });

    describe('accepting payments', function () {
      beforeEach(async function () {
          await this.token.approve(this.crowdsale.address, crowdsaleAmount, { from: tokenWallet })
          await this.token.transfer(tokenWallet, crowdsaleAmount, {from: owner});
      });
      it('should reject payments before start', async function () {
        await this.crowdsale.sendTransaction({ value: value, from: investor }).should.be.rejectedWith(EVMRevert);
        await this.crowdsale.buyTokens(investor, { from: purchaser, value: value }).should.be.rejectedWith(EVMRevert);
      });

      it('should accept payments after start', async function () {
        await increaseTimeTo(this.openingTime + 1);
        await this.crowdsale.sendTransaction({ from: investor, value: value });
        await this.crowdsale.buyTokens(investor, { value: value, from: purchaser }).should.be.fulfilled;
      });

      it('should reject payments after end', async function () {
        await increaseTimeTo(this.afterClosingTime);
        await this.crowdsale.sendTransaction({ value: value, from: investor }).should.be.rejectedWith(EVMRevert);
        await this.crowdsale.buyTokens(investor, { value: value, from: purchaser }).should.be.rejectedWith(EVMRevert);
      });
    });
  });

  describe('Basic crowdsale', function () {
    beforeEach(async function () {
      await this.token.approve(this.crowdsale.address, crowdsaleAmount, { from: tokenWallet })
      await this.token.transfer(tokenWallet, crowdsaleAmount, {from: owner});
      // Advance to the next block to correctly read time in the solidity "now" function interpreted by testrpc
      await advanceBlock();
    });
    
    describe('high-level purchase', function () {
      it('should log purchase', async function () {
        await increaseTimeTo(this.openingTime);
        const { logs } = await this.crowdsale.sendTransaction({ value: value, from: investor });
        const event = logs.find(e => e.event === 'TokenPurchase');
        event.args.purchaser.should.equal(investor);
        event.args.beneficiary.should.equal(investor);
        event.args.value.should.be.bignumber.equal(value);
        event.args.amount.should.be.bignumber.equal(expectedTokenAmount);
      });

      it('should assign tokens to sender', async function () {
        await increaseTimeTo(this.openingTime);
        await this.crowdsale.sendTransaction({ value: value, from: investor });
        let balance = await this.token.balanceOf(investor);
        balance.should.be.bignumber.equal(expectedTokenAmount);
      });

      it('should forward funds to wallet immediately', async function () {
        await increaseTimeTo(this.openingTime);
        const pre = web3.eth.getBalance(wallet);
        await this.crowdsale.sendTransaction({ value, from: investor });
        const post = web3.eth.getBalance(wallet);
        post.minus(pre).should.be.bignumber.equal(value);
      });
    });

    describe('low-level purchase', function () {
      it('should log purchase', async function () {
        await increaseTimeTo(this.openingTime);
        const { logs } = await this.crowdsale.buyTokens(investor, { value: value, from: purchaser });
        const event = logs.find(e => e.event === 'TokenPurchase');
        event.args.purchaser.should.equal(purchaser);
        event.args.beneficiary.should.equal(investor);
        event.args.value.should.be.bignumber.equal(value);
        event.args.amount.should.be.bignumber.equal(expectedTokenAmount);
      });

      it('should assign tokens to beneficiary', async function () {
        await increaseTimeTo(this.openingTime);
        await this.crowdsale.buyTokens(investor, { value, from: purchaser });
        const balance = await this.token.balanceOf(investor);
        balance.should.be.bignumber.equal(expectedTokenAmount);
      });

      it('should forward funds to wallet', async function () {
        await increaseTimeTo(this.openingTime);
        const pre = web3.eth.getBalance(wallet);
        await this.crowdsale.buyTokens(investor, { value, from: purchaser });
        const post = web3.eth.getBalance(wallet);
        post.minus(pre).should.be.bignumber.equal(value);
      });
    });

  });


});