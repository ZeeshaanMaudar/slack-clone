import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import 'semantic-ui-css/semantic.min.css';

import { BrowserRouter as Router, Switch, Route, withRouter } from 'react-router-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { composeWithDevTools } from 'redux-devtools-extension';

import App from './components/App';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import * as serviceWorker from './serviceWorker';
import firebase from './firebase';


const store = createStore(() => {}, composeWithDevTools());

class Root extends Component {

    componentDidMount() {
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                console.log('user: ', user);
                this.props.history.push('/');
            }
        })
    }
    
    render() {
        return (
            <Switch>
                <Route exact path='/' component={App} />
                <Route path='/login' component={Login} />
                <Route path='/register' component={Register} />
            </Switch>
        );
    }
}

const RoothWithAuth = withRouter(Root);

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
