import React from 'react';
import moment from 'moment';
import { Comment } from 'semantic-ui-react';

const isOwnMessage = (message, user) => {
    return message.user.id === user.uid ? 'message__self' : '';
}

const timeFromNow = timestamp => moment(timestamp).fromNow();

const Message = ({ message, user }) => {
    const { timestamp, content } = message;
    const { avatar, name } = message.user;

    return (
        <Comment>
            <Comment.Avatar src={avatar} />
            <Comment.Content className={isOwnMessage(message, user)}>
                <Comment.Author as='a'>{name}</Comment.Author>
                <Comment.Metadata>{timeFromNow(timestamp)}</Comment.Metadata>
                <Comment.Text>{content}</Comment.Text>
            </Comment.Content>
        </Comment>
    )
};

export default Message;
