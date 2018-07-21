// we are going to import some essential files
const path = require ('path');
const solc = require ('solc');
const fs = require ('fs-extra');   // gives access to file system on local computer


// we now want to add logic which will delete build folder if it exists
const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath);    //nlooks at build folder and deletes everything inside it


// we want to read in the campaign.sol file
const campaignPath = path.resolve(__dirname, 'contracts', 'Campaign.sol');

// we now want to read in the source code to the file
const source = fs.readFileSync(campaignPath, 'utf8');
const output = solc.compile(source, 1).contracts;

// we now need to recreate the build folder and check to see if it exists
fs.ensureDirSync(buildPath);

// we want to loop over output object take each contract inside 
//and write to new file in build directory
for (let contract in output) {
	fs.outputJsonSync(
		path.resolve(buildPath, contract.replace(':', '') + '.json' ),
		output[contract]

	);
}
