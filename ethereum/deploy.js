// we are going to import modules needed
const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');   //'W' = constructor
const compiledFactory = require('./build/CampaignFactory.json');  //  ./ as its in same directory


// will specify which account we want to unlock and use for ether
// which outside provider we will connect to
// we pass in the account mnemonic
//and link to test network
const provider = new HDWalletProvider( 
	'amount grocery month chat patrol tool slide family solve blame horn enhance',
	'https://rinkeby.infura.io/G9FLezSwLUDwjebwJHpb '
	);

// this will take provider pass it to web3 constructor and get an instance of web3
const web3 = new Web3(provider);

//we need to write function so we can use await function
const deploy = async () => {

	//we want list of all accounts unlocked through wallet provider
	const accounts = await web3.eth.getAccounts();


//console log for account attempting to deploy the contract
	console.log('Attempting to deploy from account', accounts[0]);

// contract deployment statement   interce = ABI  deploy will contain arguments and bytecode
const result = await new web3.eth.Contract(JSON.parse(compiledFactory.interface)
)
.deploy({ data: '0x' + compiledFactory.bytecode })
.send({ gas: '1000000', from: accounts[0]});

// console log the address that contract is deployed any bytecode

console.log('Contract deployed to', result.options.address);
};

//we immediatly call deploy to use aasync await syntex
deploy();