import web3 from './web3';
//we need the ABI of the Campaign
import Campaign from './build/Campaign.json'; 


// this gets called with an address  
// in the function we ceate an instance of a campaign 
// return it to point at the address
export default (address) => {
    return new web3.eth.Contract(
        JSON.parse(Campaign.interface),
        //over time there will be many addresses
        address
        );
};