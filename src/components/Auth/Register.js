import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import {
    Grid,
    Form,
    Segment,
    Button,
    Header,
    Message,
    Icon
} from 'semantic-ui-react';

class Register extends Component {

    state = {
        username: '',
        email: '',
        password: '',
        passwordConfirmation: ''
    }

    handleSubmit = event => {
        event.preventDefault();
    }

    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value })
    }

    render() {
        const { handleSubmit, handleChange } = this;

        const { username, email, password, passwordConfirmation } = this.state;

        return (
            <Grid textAlign='center' verticalAlign='middle' className='app'>
                <Grid.Column style={{ maxWidth: 450 }}>
                    <Header as='h2' icon color='orange' textAlign='center'>
                        <Icon name='puzzle piece' color='orange' />
                        Register for ZeeChat
                    </Header>
                    <Form size='large' onSubmit={handleSubmit}>
                        <Segment stacked>
                            <Form.Input
                                fluid
                                type='text'
                                name='username'
                                icon='user'
                                iconPosition='left'
                                placeholder='Username'
                                value={username}
                                onChange={handleChange}
                            />
                            <Form.Input
                                fluid
                                type='email'
                                name='email'
                                icon='mail'
                                iconPosition='left'
                                placeholder='Email Address'
                                value={email}
                                onChange={handleChange}
                            />
                            <Form.Input
                                fluid
                                type='password'
                                name='password'
                                icon='lock'
                                iconPosition='left'
                                placeholder='Password'
                                value={password}
                                onChange={handleChange}
                            />
                            <Form.Input
                                fluid
                                type='password'
                                name='passwordConfirmation'
                                icon='repeat'
                                iconPosition='left'
                                placeholder='Confirm Password'
                                value={passwordConfirmation}
                                onChange={handleChange}
                            />
                            <Button color='orange' fluid size='large'>Submit</Button>
                        </Segment>
                    </Form>
                    <Message>Already a user? <Link to='/login'>Login</Link> </Message>
                </Grid.Column>
            </Grid>
        );
    }
};

export default Register;
