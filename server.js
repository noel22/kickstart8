const { createServer } = require('http');
const next = require('next');

// we are going to create a new app instance
const app = next({
    //specifies if we are running server in production or development mode
    dev: process.env.NODE_ENV != 'production'
});

const routes = require('./routes');
const handler = routes.getRequestHandler(app);

// we now set up the app to listen to a specific port
app.prepare().then(() => {
    createServer(handler).listen(3000, (err) => {
        //call back function to seee if erroe exists
        if (err) throw err;

        console.log('Ready on localhost:3000');

    });

});