import React, { Component } from 'react';
import { Form, Button, Input, Message } from 'semantic-ui-react';
import Layout from '../../components/Layout';
// lower case factory as it is an instance
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';
//link allows render of anchor tags while Router redirects ppl from page to page
import { Router } from '../../routes';

class CampaignNew extends Component {
    state = {
        minimumContribution: '',
        errorMessage: '' , 
        loading: false

    };

    // we want to make a new event handler to handel a form submitttal
    onSubmit = async (event) => {
        event.preventDefault();

        // we want to set the spinner up to say processinng is being done
        this.setState({ loading: true, errorMessage: '' });

        try{

        const accounts = await web3.eth.getAccounts();

        await factory.methods
            .createCampaign(this.state.minimumContribution)
            .send({
                from: accounts[0]
            });
            
            Router.pushRoute('/');

        }  catch (err)  {
            this.setState({ errorMessage: err.message });
        }
        this.setState({ loading: false });
    };
    // error message assigned to false originally
    render () {
        return (
            //we want to place layout component
            <Layout>

              <h3>Create a Campaign</h3> 
                
        <Form onSubmit= {this.onSubmit} error={!!this.state.errorMessage}> 
            <Form.Field>
                <label>Minimun Contribition</label>
                <Input 
                   label= 'wei' labelPosition='right'
                   value = {this.state.minimumContribution}
                   onChange = {event => this.setState({ minimumContribution: event.target.value })}
                   />
                </Form.Field>

                <Message error header = 'Oops!' content= {this.state.errorMessage} />
                <Button loading={this.state.loading} primary>Create!</Button>
                </Form>
               
        </Layout>
        );
    }
}

export default CampaignNew;
