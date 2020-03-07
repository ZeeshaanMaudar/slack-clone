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
        numUniqueUsers: '',
        searchTerm: '',
        searchLoading: false,
        searchResults: []
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

    handleSearchChange = event => {
        let searchTerm = event.target.value;

        this.setState({ searchTerm, searchLoading: true }, () => this.handleSearchMessages());
    }

    handleSearchMessages = () => {
        const channelMessages = [...this.state.messages];
        const regex = new RegExp(this.state.searchTerm, 'gi');

        const searchResults = channelMessages.reduce((acc, message) => {
            if ((message.content && message.content.match(regex)) || message.user.name.match(regex)) {
                acc.push(message);
            }
            return acc;
        }, []);

        this.setState({ searchResults });
        setTimeout(() => this.setState({ searchLoading: false }), 1000);
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

        const {
            messagesRef,
            channel,
            user,
            messages,
            progressBar,
            numUniqueUsers,
            searchTerm,
            searchResults,
            searchLoading
        } = this.state;

        const { isProgressBarVisible, handleSearchChange } = this;

        const displayMessages = messages => {
            if (messages.length > 0) {
                return messages.map(message => <Message key={message.timestamp} message={message} user={user} />);
            }

            return null;
        }

        const displayChannelName = channel => channel ? `#${channel.name}` : '';

        return (
            <Fragment>
                <MessagesHeader
                    {...{ numUniqueUsers, handleSearchChange, searchLoading }}
                    channelName={displayChannelName(channel)}
                />
                <Segment>
                    <Comment.Group className={progressBar ? 'messages__progress' : 'messages'}>
                        {searchTerm ? displayMessages(searchResults) : displayMessages(messages) }
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
