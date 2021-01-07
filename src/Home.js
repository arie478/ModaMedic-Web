import React, {Component} from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import App from './App';
import HomeLogin from './HomeLogin';
import Questionnaire from './Questionnaire/SurveyComponent';
import QuestionnairesManger from './Questionnaire/QuestionnaireManger';
import SurveyComponent from './Questionnaire/SurveyComponent';

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
                    <Route exact path="/questionnaires">
                        <App component='questionnaires'/>
                    </Route>
                    <Route exact path="/instructions">
                        <App component='instructions'/>
                    </Route>
                    <Route exact path="/exercises">
                        <App component='exercises'/>
                    </Route>
                    <Route path='/userQuestionnaire/:QuestionnaireID' render={(props) => <App component='survey' {...props}/>}>
                        {/*<App component='survey'/>*/}
                    </Route>
                </Switch>
              </Router>
        )
    }
}

export default Home;