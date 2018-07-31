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
		console.log(manager)

	});

	it('allows people to contribute money and marks them as approvers', async () => {
		await campaign.methods.contribute().send({
		  value: '200',
		  from: accounts[1]
		});
		// we want to make sure contributor has been marked an appprover
		const isContributor = await campaign.methods.approvers(accounts[1]).call();
		// assert will fail if value is false
		assert(isContributor);
	});

	it('requires a minimun contribution', async () => {
		// we want to pass in less than minimum amount to get an error
		try{
			// we place function call inside of  try
			await campaign.methods.contrubute().send({
				value: '5',
				from: accounts[1]
			})
			//to make test fail
			assert(false);
		} catch (err){
			assert(err);

		}
	});

	it('allows a manager to make a payment request', async () => {
		await campaign.methods.
		createRequest('Buy batteries', '100', accounts[1])
		.send({
			from: accounts[0],
			gas: '1000000'
		});	
		//we now need to pull request which was just made
		const request = await campaign.methods.requests(0).call();

		assert.equal('Buy batteries', request.description);
	});

	// we now want to test all of our campaign functions work
	//and make sure some party recieves money form the request
	it('processes requests', async () => {
		await campaign.methods.contribute().send({
			from: accounts[0],
			value: web3.utils.toWei('10', 'ether')
		});

		await campaign.methods
		//creates request to send 5 ether to accounts[1]
		.createRequest('A', web3.utils.toWei('5', 'ether'), accounts[1])
		.send({ from: accounts[0], gas: '1000000' });

		// it need to now  be approved before it can be finalised
		await campaign.methods.approveRequest(0).send({
			from: accounts[0],
			gas: '1000000'
		});
		//we ow ant to finalize request and transfer funds to accounts[1]
		await campaign.methods.finalizeRequest(0).send({
			from: accounts[0],
			gas: '1000000'

		});
		//we now need to verify the balance at accounts[1] to make sure ether have been sent
		// we use let as we are reassining 
		let balance = await web3.eth.getBalance(accounts[1]);
		// get balance returns a string we need to convert turn into ether
		balance = web3.utils.fromWei(balance, 'ether');
		//takes string and converts to decimal number
		balance = parseFloat(balance);
		console.log(balance);
		// and comapre with a number to make a comparrission of accounts balance
		assert(balance > 104);

	});

});
