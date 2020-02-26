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
        errors: [],
        loading: false
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
        event.preventDefault();

        const { email, password } = this.state;
        const { isFormValid } = this;

        if (isFormValid()) {

            this.setState({ errors: [], loading: true });

            firebase
                .auth()
                .createUserWithEmailAndPassword(email, password)
                .then(createdUser => {
                    console.log(createdUser);
                    this.setState({ loading: false });
                })
                .catch(error => {
                    console.log(error);
                    const { errors } = this.state;

                    let authError = errors.concat(error);

                    this.setState({ errors: authError, loading: false });
                });

        }
    }

    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value })
    }

    handleInputError = (errors, inputName) => {
        return errors.some(error => error.message.toLowerCase().includes(inputName)) ? 'error' : '';
    }

    render() {
        const { handleSubmit, handleChange, handleInputError } = this;

        const { username, email, password, passwordConfirmation, errors, loading } = this.state;

        const displayErrors = errors => {
            return errors.map((error, index) => (
                <p key={index}>{error.message}</p>
            ))
        }

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
                                className={handleInputError(errors, 'username')}
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
                                className={handleInputError(errors, 'email')}
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
                                className={handleInputError(errors, 'password')}
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
                                className={handleInputError(errors, 'passwordConfirmation')}
                                value={passwordConfirmation}
                                onChange={handleChange}
                            />
                            <Button
                                className={loading ? 'loading ': ''}
                                disabled={loading}
                                color='orange'
                                fluid
                                size='large'
                            >
                                Submit
                            </Button>
                        </Segment>
                    </Form>
                    {errors.length > 0 && (
                        <Message error>
                            <h3>Error</h3>
                            {displayErrors(errors)}
                        </Message>
                    )}
                    <Message>Already a user? <Link to='/login'>Login</Link> </Message>
                </Grid.Column>
            </Grid>
        );
    }
};

export default Register;
