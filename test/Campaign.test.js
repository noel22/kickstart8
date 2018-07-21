const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

// we now want to import campaign and campaignFactory
//  ../ = out of directory
const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');


// we will decalre variables
let accounts;
let factory;
let campaignAddress; 
let campaign;

beforeEach(async () => {
	//get list of accounts
	accounts = await web3.eth.getAccounts();

	// we want to pass in the ABI of the cpntracts
	// we need to convert from json to js
	factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
		.deploy({ data: compiledFactory.bytecode })
		.send({ from: accounts[0], gas: '1000000' });

	//we re now going to use the factory to make an instance of the campaign
	// we have to pass in min contribution
	await factory.methods.createCampaign('100').send({
	//person sending
		from: accounts[0],
		gas: '1000000'
	});

	// to get acess to address we must read data off the function
	// takes first element from array and assigns it to campaignAddress
	[campaignAddress] = await factory.methods.getDeployedCampaigns().call();

	// we now want web 3 to create javascript version instance of the contract
	campaign = await new web3.eth.Contract(
		JSON.parse(compiledCampaign.interface),
		//now the address of campaign
		campaignAddress
		);
	});

// we now write a new test and run on mocha
describe('Campaigns', () => {
	it('deploys a factory and a campaign', () => {
		assert.ok(factory.options.address);
		assert.ok(campaign.options.address);

	});

	// nwe want to test hat who ever calls create campaign 
	//is listed as manager and accounts[0]
	it('marks caller as the campaign manager', async () => {
		// we retrive address of manager
		const manager  = await campaign.methods.manager().call();
		// we now compare against accounts[0]
		// by asserting what it should be to what it actually is
		assert.equal(accounts[0], manager);

	});

});