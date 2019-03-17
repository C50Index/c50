const C50 = artifacts.require('C50');
const EVMRevert = 'revert';
const BigNumber = web3.BigNumber;

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should();

contract('Administrable', function ([_, owner, otherUser, administrator]) {
    beforeEach(async function () {
      token = await C50.new({from: owner});
    });

  describe("AddAdministrator", function(){
    it('emits an event', async function () {
      const {logs} = await token.addAdministrator(administrator, {from: owner});
      const event = logs.find(e => e.event === 'AddAdministrator');
      assert.equal(event.args.administrator, administrator);
    });

    it("only other administrators can add", async function() {
      await token.addAdministrator(otherUser, {from: administrator}).should.be.rejectedWith(EVMRevert);
      let status = await token.isAdministrator(otherUser, {from: otherUser});
      assert.equal(status, false);

      await token.addAdministrator(administrator, {from: owner});
      status = await token.isAdministrator(administrator, {from: otherUser});
      assert.equal(status, true);

      await token.addAdministrator(otherUser, {from: administrator});
      status = await token.isAdministrator(otherUser, {from: administrator});
      assert.equal(status, true);
    });
  });

});