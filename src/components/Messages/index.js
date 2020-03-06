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
        progressBar: false,
        numUniqueUsers: ''
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
            this.countUniqueUsers(loadedmessages);
        });
    }

    countUniqueUsers = messages => {
        const uniqueUsers = messages.reduce((acc, message) => {

            if (!acc.includes(message.user.name)) {
                acc.push(message.user.name);
            }
            return acc;
        }, []);

        const plural = uniqueUsers.length > 1 || uniqueUsers.length === 0;

        const numUniqueUsers = `${uniqueUsers.length} user${plural ? 's' : ''}`;

        this.setState({ numUniqueUsers });
    }

    addListeners = channelId => {
        this.addMessageListener(channelId);
    }

    isProgressBarVisible = percent => {
        if (percent > 0) {
            this.setState({ progressBar: true })
        }
    }


    render() {
        const { messagesRef, channel, user, messages, progressBar, numUniqueUsers } = this.state;
        const { isProgressBarVisible } = this;

        const displayMessages = () => {
            if (messages.length > 0) {
                return messages.map(message => <Message key={message.timestamp} message={message} user={user} />);
            }

            return null;
        }

        const displayChannelName = channel => channel ? `#${channel.name}` : '';

        return (
            <Fragment>
                <MessagesHeader
                    {...{ numUniqueUsers }}
                    channelName={displayChannelName(channel)}
                />
                <Segment>
                    <Comment.Group className={progressBar ? 'messages__progress' : 'messages'}>
                        {displayMessages()}
                    </Comment.Group>
                </Segment>
                <MessageForm
                    {...{ messagesRef, isProgressBarVisible }}
                    currentUser={user}
                    currentChannel={channel}
                />
            </Fragment>
        );
    }
}

export default Messages;
