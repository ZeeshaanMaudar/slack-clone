import React from 'react';
import moment from 'moment';
import { Comment, Image } from 'semantic-ui-react';

const isOwnMessage = (message, user) => {
    return message.user.id === user.uid ? 'message__self' : '';
}

const timeFromNow = timestamp => moment(timestamp).fromNow();

const displayCommentOrImage = (message, content) => {
    if (message.hasOwnProperty('image') && !message.hasOwnProperty('content')) {
        return <Image src={message.image} className='message__image' />;
    }

    return <Comment.Text>{content}</Comment.Text>;
}

const Message = ({ message, user }) => {
    const { timestamp, content } = message;
    const { avatar, name } = message.user;

    return (
        <Comment>
            <Comment.Avatar src={avatar} />
            <Comment.Content className={isOwnMessage(message, user)}>
                <Comment.Author as='a'>{name}</Comment.Author>
                <Comment.Metadata>{timeFromNow(timestamp)}</Comment.Metadata>
                {displayCommentOrImage(message, content)}
            </Comment.Content>
        </Comment>
    )
};

export default Message;
