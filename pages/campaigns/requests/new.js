import React, {Component} from "react";
import Layout from "../../../components/Layout";
import { Form, Message, Button, Input } from 'semantic-ui-react';
import Campaign from '../../../ethereum/campaign';
import web3 from '../../../ethereum/web3';
import { Router, Link } from '../../../routes';

class RequestNew extends Component {
    state = {
        value: '',
        description: '',
        recipient: '',
        loading: false
    };
    
    static async getInitialProps(props) {
        const { address } = props.query;

        return { address: address };
    }

    onSubmit = async () => {
        
        const campaign = Campaign(this.props.address);
        const { description, value, recipient } = this.state;
        this.setState({loading: true});
        
        try {
            const accounts = await web3.eth.getAccounts();
            await campaign.methods
            .createRequest(description, web3.utils.toWei(value, 'ether'), recipient)
            .send({
                from: accounts[0]
            });

        } catch (err) {
        }

        this.setState({loading: false});

    };

    render() {
        return (
            <Layout>
                <Link route={`/campaigns/${this.props.address}/requests`}>
                    <a>Back</a>
                </Link>
                <h3>New request</h3>
                <Form onSubmit={this.onSubmit}>
                    <Form.Field>
                        <label>Description</label>
                        <Input 
                        value={this.state.description}
                        onChange={event => this.setState({description: event.target.value})}
                        />
                    </Form.Field>

                    <Form.Field>
                        <label>Value in Ether</label>
                        <Input 
                        label="eth" 
                        labelPosition="right" 
                        value={this.state.value}
                        onChange={event => this.setState({value: event.target.value})}
                        />
                    </Form.Field>

                    <Form.Field>
                        <label>Recipient</label>
                        <Input 
                        value={this.state.recipient}
                        onChange={event => this.setState({recipient: event.target.value})}
                        />
                    </Form.Field>
                    
                    <Message error header="Oops!" content={this.state.errorMessage} />
                    <Button loading={this.state.loading} primary> Create </Button>

                </Form>
            </Layout>
            
        );
    }
}

export default RequestNew;