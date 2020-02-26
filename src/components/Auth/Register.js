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

import firebase from '../../firebase';

class Register extends Component {

    state = {
        username: '',
        email: '',
        password: '',
        passwordConfirmation: '',
        errors: []
    }

    isPasswordValid = ({ password, passwordConfirmation }) => {

        if (password.length < 6 || passwordConfirmation.length < 6) {
            return false;
        } else if (password !== passwordConfirmation) {
            return false;
        } else {
            return true;
        }

    }

    isFormEmpty = ({ username, email, password, passwordConfirmation }) => {

        return !username.length || !email.length || !password.length || !passwordConfirmation.length 

    }

    isFormValid = () => {
        const { state, isFormEmpty, isPasswordValid } = this;

        let errors = [];
        let error;

        if (isFormEmpty(state)) {
            
            error = { message: 'Fill in all fields' }
            errors = errors.concat(error);

            this.setState({ errors });

            return false;

        } else if (!isPasswordValid(state)) {

            error = { message: 'Password is invalid' }
            errors = errors.concat(error);

            this.setState({ errors });

            return false;

        } else {

            return true;
            
        }
    }

    handleSubmit = event => {
        const { email, password } = this.state;
        const { isFormValid } = this;

        if (isFormValid()) {

            event.preventDefault();
            firebase
                .auth()
                .createUserWithEmailAndPassword(email, password)
                .then(createdUser => {
                    console.log(createdUser);
                })
                .catch(error => {
                    console.log(error);
                });

        }
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
