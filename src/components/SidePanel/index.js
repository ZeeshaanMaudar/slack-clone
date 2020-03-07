import React, { Component } from 'react';

import UserPanel from './UserPanel';
import Channels from './Channels';
import DirectMessages from './DirectMessages';

import { Menu } from 'semantic-ui-react';

class SidePanel extends Component {
    render() {
        const { currentUser } = this.props;

        return (
            <Menu
                size='large'
                inverted
                fixed='left'
                vertical
                style={{ background: '#4c3c4c', fontSize: '1.2rem' }}
            >
                <UserPanel {...{ currentUser }} />
                <Channels {...{ currentUser }} />
                <DirectMessages />
            </Menu>
        );
    }
}

export default SidePanel;
