import React, {Component} from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import App from './App';
import HomeLogin from './HomeLogin';


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
                        <App component='search'/>
                    </Route>
                    <Route exact path="/messages">
                        <App component='messages'/>
                    </Route>
                </Switch>
              </Router>
        )
    }
}

export default Home;