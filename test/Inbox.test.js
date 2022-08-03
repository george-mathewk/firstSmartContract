//https://rinkeby.infura.io/v3/bf5daac22fb94718b7810b5dc469cb43


const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());
const { interface, bytecode } = require('../compile');

let accounts;
let inbox;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  inbox = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({
      data: bytecode,
      arguments: ["Hi there!"]
    })
    .send({ from: accounts[0], gas: "1000000" });
});

describe('Inbox', async () => {
  it('it deploys contract', () => {
    assert.ok(inbox.options.address);
  });
  it('it has a default value', async () => {
    const message = await inbox.methods.message().call();
    assert.equal(message, "Hi there!");
  });
  it('it has new message', async () => {
    await inbox.methods.setMessage("bye").send({ from: accounts[0] });
    const message = await inbox.methods.message().call();
    assert.equal(message, "bye");
  });
});
