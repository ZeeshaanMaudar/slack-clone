import React, { Component } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Segment, Button, Input } from 'semantic-ui-react';

import firebase from '../../../firebase';

import FileModal from '../FileModal';
import ProgressBar from '../ProgressBar';

export class MessageForm extends Component {
    state = {
        message: '',
        loading: false,
        errors: [],
        channel: this.props.currentChannel,
        user: this.props.currentUser,
        modal: false,
        uploadState: '',
        uploadTask: null,
        storageRef: firebase.storage().ref(),
        percentUploaded: 0,
    };

    openModal = () => this.setState({ modal: true });

    closeModal = () => this.setState({ modal: false });

    uploadFile = (file, metadata) => {
        const { storageRef } = this.state;
        const { id } = this.state.channel;
        const { messagesRef } = this.props;

        const pathToUpload = id;
        const ref = messagesRef;
        const filePath = `chat/public/${uuidv4()}.jpg`;

        this.setState({
            uploadState: 'uploading',
            uploadTask: storageRef.storage.ref(filePath).put(file, metadata)
        }, () => {
            this.state.uploadTask.on('state_changed', snap => {
                const percentUploaded = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
                this.props.isProgressBarVisible(percentUploaded);
                this.setState({ percentUploaded });
            },
            err => {
                console.error(err);
                let errors = this.state.errors.concat(err);
                this.setState({ errors, uploadState: 'error', uploadTask: null });
            },
            () => {
                this.state.uploadTask.snapshot.ref.getDownloadURL()
                    .then(downloadUrl => {
                        this.sendFileMessage(downloadUrl, ref, pathToUpload);
                    })
                    .catch(err => {
                        console.error(err);
                        let errors = this.state.errors.concat(err);
                        this.setState({ errors, uploadState: 'error', uploadTask: null });
                    })
            })
        });
    }

    sendFileMessage = (fileUrl, ref, pathToUpload) => {
        ref
            .child(pathToUpload)
            .push()
            .set(this.createMessage(fileUrl))
            .then(() => {
                this.setState({ uploadState: 'done' });
            })
            .catch(err => {
                console.error(err);
                let errors = this.state.errors.concat(err);
                this.setState({ errors });
            })

    }

    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    }

    createMessage = fileUrl => {
        const message = {
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            user: {
                id: this.state.user.uid,
                name: this.state.user.displayName,
                avatar: this.state.user.photoURL
            },
        };

        if (fileUrl && fileUrl !== null) {
            message['image'] = fileUrl;
        } else {
            message['content'] = this.state.message;
        }

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
        const { errors, message, loading, modal, uploadState, percentUploaded } = this.state;
        const { handleChange, sendMessage, openModal, closeModal, uploadFile } = this;

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
                        onClick={openModal}
                        disabled={uploadState === 'uploading'}
                    />
                </Button.Group>
                <FileModal
                    {...{ modal, closeModal, uploadFile }}
                />
                <ProgressBar {...{ uploadState, percentUploaded }} />
            </Segment>
        );
    }
}

export default MessageForm;
