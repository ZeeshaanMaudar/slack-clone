import React, { Component } from 'react';
import { Segment, Button, Input } from 'semantic-ui-react';

import firebase from '../../../firebase';

export class MessageForm extends Component {
    state = {
        message: '',
        loading: false,
        errors: [],
        channel: this.props.currentChannel,
        user: this.props.currentUser
    };

    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    }

    createMessage = () => {
        const message = {
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            user: {
                id: this.state.user.uid,
                name: this.state.user.displayName,
                avatar: this.state.user.photoURL
            },
            content: this.state.message
        };

        return message;
    }

    sendMessage = () => {
        const { createMessage } = this;
        const { message, channel } = this.state;
        const { messagesRef } = this.props;

        const { id } = channel;

        if (message) {
            this.setState({ loading: true });
            messagesRef
                .child(id)
                .push()
                .set(createMessage())
                .then(() => {
                    this.setState({ loading: false, message: '', errors: [] })
                })
                .catch(err => {
                    let errors = this.state.errors.concat(err);
                    this.setState({ loading: false, errors });
                })
        } else {
            let errors = this.state.errors.concat({ message: 'Add a message' });
            this.setState({ errors });
        }
    }

    render() {
        const { errors, message, loading } = this.state;
        const { handleChange, sendMessage } = this;

        return (
            <Segment className='message__form'>
                <Input
                    fluid
                    name='message'
                    value={message}
                    style={{ marginBottom: '0.7em' }}
                    label={<Button icon='add' />}
                    labelPosition='left'
                    placeholder='Write your message...'
                    onChange={handleChange}
                    className={errors.some(({ message }) => message.includes('message')) ? 'error' : ''}
                />
                <Button.Group icon widths='2'>
                    <Button
                        color='orange'
                        content='Add Reply'
                        labelPosition='left'
                        icon='edit'
                        onClick={sendMessage}
                        disabled={loading}
                    />
                    <Button
                        color='teal'
                        content='Upload Media'
                        labelPosition='right'
                        icon='cloud upload'
                    />
                </Button.Group>
            </Segment>
        );
    }
}

export default MessageForm;
