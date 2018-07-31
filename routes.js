// want to require next route tools
// second brackets return a function and function will be invoked when code is executed
const routes = require('next-routes')();

//will make route for campaign address and wat coomponent we want to show
// after : = wildcard as it can be miltiple addresses depending on the campaign
routes
    .add('/campaigns/new', '/campaigns/new')
    .add('/campaigns/:addrress', '/campaigns/show');

// this will export helpers which will help navigate the different pages
module.exports = routes;

