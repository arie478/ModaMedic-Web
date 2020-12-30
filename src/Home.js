import React, {Component} from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route, Redirect
} from "react-router-dom";
import App from './App';
import HomeLogin from './HomeLogin';
import MessagesPage from "./MessagesPage";
import PatientSearchNew from "./PatientSearchNew";


class Home extends Component{
    /*
    constructor(props){
        super(props);
    }
    */

    render(){
        return(
            <Router basename={window.location.pathname || ''}>
                <Switch>
                    <Route exact path="/">
                        <HomeLogin />
                    </Route>
                    <Route exact path="/search">
                        <App component={<PatientSearchNew />}/>
                    </Route>
                    <Route exact path="/messages">
                        <App component={<MessagesPage />}/>
                    </Route>
                </Switch>
              </Router>
        )
    }
}

export default Home;