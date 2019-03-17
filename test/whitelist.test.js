const C50 = artifacts.require('C50');
const EVMRevert = 'revert';
const BN  = web3.utils.BN;

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BN))
  .should();

contract('WhiteList', function ([_, owner, investor, purchaser, administrator]) {
  beforeEach(async function () {
    token = await C50.new({from: owner});
  });

  describe('Whitelist', function () {

    describe("Add To WhiteList", function(){
      it('It should emit an event', async function () {
        const {logs} = await token.addToWhiteList(purchaser, {from: owner});
        const event = logs.find(e => e.event === 'AddToWhiteList');
        assert.equal(event.args.investor, purchaser);
      });

      it("Adds to WhiteList", async function() {
        let beforeAddToWhiteList = await token.onWhitelist(purchaser, {from: investor});
        assert.equal(beforeAddToWhiteList, false);

        await token.addToWhiteList(purchaser, {from: owner});

        afterAdd = await token.onWhitelist(purchaser, {from: investor});
        assert.equal(afterAdd, true);
      });

      it("Only an administrator can add", async function() {
        let status = await token.onWhitelist(purchaser, {from: administrator});
        assert.equal(status, false);

        await token.addToWhiteList(purchaser, {from: administrator}).should.be.rejectedWith(EVMRevert);
        status = await token.onWhitelist(purchaser, {from: administrator});
        assert.equal(status, false);

        await token.addAdministrator(administrator, {from: owner});
        await token.addToWhiteList(purchaser, {from: administrator})
        status = await token.onWhitelist(purchaser, {from: administrator});

        assert.equal(status, true);
      });
    });

    describe("Remove from WhiteList", function() {
      it("Adds and removes", async function() {
        let status = await token.onWhitelist(purchaser, {from: investor});
        assert.equal(status, false);

        await token.addToWhiteList(purchaser, {from: owner});
        status = await token.onWhitelist(purchaser, {from: investor});
        assert.equal(status, true);
        
        await token.removeFromWhiteList(purchaser, {from: owner});
        status = await token.onWhitelist(purchaser, {from: investor});

        assert.equal(status, false);
      });
    });


  });

});