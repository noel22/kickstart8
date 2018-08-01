import web3 from './web3';

import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
    JSON.parse(CampaignFactory.interface),
    // address of new  deployed factory instance
    '0x312252DFDdFBdD43d9590c1EEc8F57412D880D9B'
);

// we need access to our web 3 instance
// we import factory.js
export default instance;
