import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import 'semantic-ui-css/semantic.min.css';

import { BrowserRouter as Router, Switch, Route, withRouter } from 'react-router-dom';
import { createStore } from 'redux';
import { Provider, connect } from 'react-redux';
import { composeWithDevTools } from 'redux-devtools-extension';

import App from './components/App';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import * as serviceWorker from './serviceWorker';
import firebase from './firebase';
import rootReducer from './reducers';
import { setUser } from './actions';
import Spinner from './Spinner';


const store = createStore(rootReducer, composeWithDevTools());

class Root extends Component {

    componentDidMount() {

        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                console.log('user: ', user);
                this.props.setUser(user);
                this.props.history.push('/');
            }
        })
    }
    
    render() {
        const { isLoading } = this.props;

        if(isLoading) {
            return <Spinner />;
        }

        return (
            <Switch>
                <Route exact path='/' component={App} />
                <Route path='/login' component={Login} />
                <Route path='/register' component={Register} />
            </Switch>
        );
    }
};

const mapStateFromProps = state => ({
    isLoading: state.user.isLoading
});

const RoothWithAuth = withRouter(connect(mapStateFromProps, { setUser })(Root));

ReactDOM.render(
    <Provider store={store}>
        <Router>
            <RoothWithAuth />
        </Router>
    </Provider>,
document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
