import React, { Component, Fragment } from 'react';
import { Segment, Comment } from 'semantic-ui-react';
import firebase from '../../firebase';

import MessagesHeader from './MessagesHeader';
import MessageForm from './MessageForm';
import Message from './Message';

class Messages extends Component {
    state ={
        messagesRef: firebase.database().ref('messages'),
        channel: this.props.currentChannel,
        user: this.props.currentUser,
        messages: [],
        messagesLoading: true,
    }

    componentDidMount() {
        const { channel, user } = this.state;
        
        if (channel && user) {
            this.addListeners(channel.id);
        }
    }

    addMessageListener = channelId => {
        const { messagesRef } = this.state;

        let loadedmessages = [];
        messagesRef.child(channelId).on('child_added', snap => {
            loadedmessages.push(snap.val());
            this.setState({ messages: loadedmessages, messagesLoading: false });
        });
    }

    addListeners = channelId => {
        this.addMessageListener(channelId);
    }

    render() {
        const { messagesRef, channel, user, messages } = this.state;

        const displayMessages = () => {
            if (messages.length > 0) {
                return messages.map(message => <Message key={message.timestamp} message={message} user={user} />);
            }

            return null;
        }

        return (
            <Fragment>
                <MessagesHeader />
                <Segment>
                    <Comment.Group className='messages'>
                        {displayMessages()}
                    </Comment.Group>
                </Segment>
                <MessageForm
                    {...{ messagesRef }}
                    currentUser={user}
                    currentChannel={channel}
                />
            </Fragment>
        );
    }
}

export default Messages;
