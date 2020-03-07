import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Menu, Icon, Modal, Form, Input, Button } from 'semantic-ui-react';

import { setCurrentChannel } from '../../../actions';

import firebase from '../../../firebase';

export class Channels extends Component {

    state = {
        channels: [],
        modal: false,
        channelName: '',
        channelDetails: '',
        channelsRef: firebase.database().ref('channels'),
        firstLoad: true,
        activeChannel: ''
    }

    addListeners = () => {
        let loadedChannels = [];
        this.state.channelsRef.on('child_added', snap => {
            loadedChannels.push(snap.val());
            this.setState({ channels: loadedChannels }, () => {
                this.setFirstChannel();
            });
        })
    }

    setFirstChannel = () => {
        const { channels, firstLoad } = this.state;

        const firstChannel = channels[0];

        if (firstLoad && channels.length > 0) {
            this.props.setCurrentChannel(firstChannel);
            this.setActiveChannel(firstChannel);
        }

        this.setState({ firstLoad: false });
    }

    componentDidMount() {
        this.addListeners();
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

    setActiveChannel = channel => {
        this.setState({ activeChannel: channel.id });
    }

    changeChannel = channel => {
        const { setCurrentChannel } = this.props;
        this.setActiveChannel(channel);
        setCurrentChannel(channel);
    }

    handleSubmit = event => {
        event.preventDefault();

        const { isFormValid, addChannel } = this;

        if (isFormValid()) {
            addChannel()
        }
    }

    removeListeners = () => {
        this.state.channelsRef.off();
    }

    componentWillUnmount() {
        this.removeListeners();
    }

    render() {
        const { channels, modal, activeChannel } = this.state;
        const { closeModal, handleChange, openModal, handleSubmit, changeChannel } = this;

        const displayChannels = channels => {
            if(channels.length > 0) {
                return channels.map((channel) => (
                    <Menu.Item
                        key={channel.id}
                        onClick={() => changeChannel(channel)}
                        name={channel.name}
                        style={{ opacity: 0.7 }}
                        active={channel.id === activeChannel}
                    >
                        # {channel.name}
                    </Menu.Item>
                ))
            }

            return null;
        }

        return (
            <Fragment>
                <Menu.Menu className='menu'>
                    <Menu.Item>
                        <span>
                            <Icon name='exchange' /> CHANNELS
                        </span>{' '}
                        ({channels.length}) <Icon name='add' onClick={openModal} />
                    </Menu.Item>
                    {displayChannels(channels)}
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

export default connect(null, { setCurrentChannel })(Channels);
