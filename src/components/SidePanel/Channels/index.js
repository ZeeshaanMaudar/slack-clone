import React, { Component, Fragment } from 'react';
import { Menu, Icon, Modal, Form, Input, Button } from 'semantic-ui-react';

import firebase from '../../../firebase';

export class Channels extends Component {

    state = {
        channels: [],
        modal: false,
        channelName: '',
        channelDetails: '',
        channelsRef: firebase.database().ref('channels')
    }

    closeModal = () => this.setState({ modal: false });

    openModal = () => this.setState({ modal: true });

    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    }

    isFormValid = () => {
        const { channelName, channelDetails } = this.state;
        return channelName && channelDetails
    }

    addChannel = () => {
        const { channelsRef, channelName, channelDetails } = this.state;
        const { displayName, photoURL } = this.props.currentUser;
        const { closeModal } = this;

        const key = channelsRef.push().key;

        const newChannel = {
            id: key,
            name: channelName,
            details: channelDetails,
            createdBy: {
                name: displayName,
                avatar: photoURL
            }
        }

        channelsRef
            .child(key)
            .update(newChannel)
            .then(() => {
                this.setState({ channelName: '', channelDetails: '' });
                closeModal();
                console.log('channel added');
            })
            .catch(err => {
                console.log(err);
            })
    }

    handleSubmit = event => {
        event.preventDefault();

        const { isFormValid, addChannel } = this;

        if (isFormValid()) {
            addChannel()
        }
    }

    render() {
        const { channels, modal } = this.state;
        const { closeModal, handleChange, openModal, handleSubmit } = this;

        return (
            <Fragment>
                <Menu.Menu style={{ paddingBottom: '2em' }}>
                    <Menu.Item>
                        <span>
                            <Icon name='exchange' /> CHANNELS
                        </span>{' '}
                        ({channels.length}) <Icon name='add' onClick={openModal} />
                    </Menu.Item>

                </Menu.Menu>

                <Modal
                    basic
                    open={modal}
                    onClose={closeModal}
                >
                    <Modal.Header>Add a Channel</Modal.Header>
                    <Modal.Content>
                        <Form onSubmit={handleSubmit}>
                            <Form.Field>
                                <Input
                                    fluid
                                    label='Name of Channel'
                                    name='channelName'
                                    onChange={handleChange}
                                />
                            </Form.Field>
                            <Form.Field>
                                <Input
                                    fluid
                                    label='About the Channel'
                                    name='channelDetails'
                                    onChange={handleChange}
                                />
                            </Form.Field>
                        </Form>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color='green' inverted onClick={handleSubmit}>
                            <Icon name='checkmark' /> Add
                        </Button>
                        <Button color='red' inverted onClick={closeModal}>
                            <Icon name='remove' /> Cancel
                        </Button>
                    </Modal.Actions>
                </Modal>
            </Fragment>
        );
    }
}

export default Channels;
