import Web3 from 'web3';

// we want to define web3 in differnt ways
let web3;

// to check if we are running i browser and check if it is defined
if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined')  {
    // then we are in browser and metamask is running

    // to make sure we are using same version of web3
    web3 = new Web3(window.web3.currentProvider);

}
  else{
//we are on the server *or* the user is not running metamask
    const provider = new Web3.providers.HttpProvider(
        'https://rinkeby.infura.io/G9FLezSwLUDwjebwJHpb'
);
    web3 = new Web3(provider);
}   

export default web3;
