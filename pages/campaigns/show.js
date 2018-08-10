// we want to show users info about the campaign
import React, { Component } from 'react';
import Layout from '../../components/Layout';
import Campaign from '../../ethereum/campaign';

class CampaignShow extends Component {
    static async getInitialProps(props) {
        //address of campaign to user
        //console.log(props.query.address);
        // we now call the Campaign function and  query the addresses of new campaings
        const campaign = Campaign(props.query.address);

        // we now want to ask some info of the campaign
        const summary = await campaign.methods.getSummary().call();

        console.log(summary);


        return {};
        
    }


    render() {
        return(
            // we want to wrap layout around component
            <Layout>
            <h3>Campaign Show</h3>
            </Layout>

        );
    }
}

export default CampaignShow;