import web3 from './web3';

import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
    JSON.parse(CampaignFactory.interface),
    '0x57163F6012B0e409d4DF6c0AceD6976Cf8bA6118'
);

// we need access to our web 3 instance
// we import factory.js
export default instance;