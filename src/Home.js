import React, {Component} from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import App from './App';
import HomeLogin from './HomeLogin';
import PatientSearch from "./PatientSearch";


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
                    <Route path="/search">
                        <App />
                    </Route>
                    <Route path="/patientSearch">
                        <PatientSearch />
                    </Route>
                </Switch>
              </Router>
        )
    }
}

export default Home;