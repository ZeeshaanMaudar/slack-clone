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

class Login extends Component {

    state = {
        email: '',
        password: '',
        errors: [],
        loading: false
    }

    isFormValid = ({ email, password }) => email && password;

    handleSubmit = event => {
        event.preventDefault();

        const { state, isFormValid } = this;

        const { email, password, errors } = state;

        if (isFormValid(state)) {

            this.setState({ errors: [], loading: true });
            
            firebase
                .auth()
                .signInWithEmailAndPassword(email, password)
                .then(signedInUser => {
                    console.log(signedInUser);
                    this.setState({ loading: false });
                }) 
                .catch(error => {
                    
                    let signedInError = errors.concat(error);

                    this.setState({ errors: signedInError, loading: false });
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

        const { email, password, errors, loading } = this.state;

        const displayErrors = errors => {
            return errors.map((error, index) => (
                <p key={index}>{error.message}</p>
            ))
        }

        return (
            <Grid textAlign='center' verticalAlign='middle' className='app'>
                <Grid.Column style={{ maxWidth: 450 }}>
                    <Header as='h1' icon color='violet' textAlign='center'>
                        <Icon name='code branch' color='violet' />
                        Login to ZeeChat
                    </Header>
                    <Form size='large' onSubmit={handleSubmit}>
                        <Segment stacked>
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
                            <Button
                                className={loading ? 'loading ': ''}
                                disabled={loading}
                                color='violet'
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
                    <Message>Don't have an account? <Link to='/register'>Register</Link> </Message>
                </Grid.Column>
            </Grid>
        );
    }
};

export default Login;
