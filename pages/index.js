import React, { Component } from 'react';
// we now want to import a specific component from react
import{ Card, Button } from 'semantic-ui-react';

// we want to import factory instance
import factory from '../ethereum/factory';

import Layout from '../components/Layout';
import { Link } from '../routes';


// we want to change  functional component to a class based react component
class CampaignIndex extends Component{
// we need to define the following for next.js to get correct data from contract
    static async getInitialProps() {
        const campaigns =  await factory.methods.getDeployedCampaigns().call();

        return { campaigns };
    }

    // we want to create new function to create a card group
   renderCampaigns() {
       const items = this.props.campaigns.map(address => {
           return{
               header: address,
               description: (
                <Link route= {`/campaigns/${address}`}>
                    <a>View Campaign</a>
                </Link>
               ),
               fluid: true
           };
       });

      return <Card.Group items = {items} />; 
   }  
  
    // we need to output some jsx for react so we do not get an error
    //this will render the address of the campaign on the page
    render() {
            // we want first element from this arrray
        return (
            <Layout>
            <div>
                <h3>Open Campaigns</h3>

                <Link route = "/campaigns/new">
                    <a>
                        <Button floated = 'right'
                            content = 'Create Campaign'
                            icon = 'add circle'
                            primary 
                />
            </a>
        </Link>

            {this.renderCampaigns()}
        </div>
        </Layout>
        );
    }
}

// we need to export component from this file
export default CampaignIndex;


