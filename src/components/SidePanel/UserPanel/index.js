import React, { Component } from 'react';

import firebase from '../../../firebase';
import { Grid, Header, Icon, Dropdown, Image } from 'semantic-ui-react';

class UserPanel extends Component {

    state = {
        user: this.props.currentUser
    }

    handleSignOut = () => {
        console.log('signing out');

        firebase
            .auth()
            .signOut()
            .then(() => console.log('signed out!'));
    }

    render() {

        const { handleSignOut } = this;
        const { user } = this.state;

        const { displayName, photoURL } = user;

        const dropdownOptions = [
            {
                key: 'user',
                text: <span>Signed in as <strong>{displayName}</strong></span>,
                disabled: true
            },
            {
                key: 'avatar',
                text: <span>Change Avatar</span>
            },
            {
                key: 'signout',
                text: <span onClick={handleSignOut}>Sign Out</span>
            }
        ]

        return (
            <Grid style={{ background: '#4c3c4c' }}>
                <Grid.Column>
                    <Grid.Row style={{ padding: '1.2em', margin: 0 }}>
                        <Header inverted floated='left' as='h2'>
                            <Icon name='code' />
                            <Header.Content>ZeeChat</Header.Content>
                        </Header>
                    </Grid.Row>
                    
                    <Header style={{ padding: '0.25em' }} inverted as='h4'>
                        <Dropdown
                            trigger={
                                <span>
                                    <Image src={photoURL} spaced='right' avatar />
                                    {displayName}
                                </span>
                            }
                            options={dropdownOptions}
                        />
                    </Header>
                </Grid.Column>
            </Grid>
        );
    }
};

export default UserPanel;
