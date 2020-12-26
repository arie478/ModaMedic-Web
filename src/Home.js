import React, {Component} from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route, Redirect
} from "react-router-dom";
import App from './App';
import HomeLogin from './HomeLogin';
import MessagesPage from "./MessagesPage";
import PatientSearch from "./PatientSearch";
import Search from "./Search";


class Home extends Component{
    /*
    constructor(props){
        super(props);
    }
    */

    render(){
        const patientSearch = <PatientSearch/>;
        const messagesPage = <MessagesPage/>;
        return(
            <Router basename={window.location.pathname || ''}>
            {/*<Router basename={window.location.pathname || ''}>*/}
                <Switch>
                    <Route exact path="/">
                        <HomeLogin />
                    </Route>
                    <Route exact path="/search">
                        <App component={patientSearch}/>
                    </Route>
                    <Route exact path="/messages">
                        <App component={messagesPage}/>
                    </Route>
                </Switch>
              </Router>
        )
    }
}

export default Home;