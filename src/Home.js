import React, {Component} from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import App from './App';
import HomeLogin from './HomeLogin';
import Questionnaire from './src/Questionnaire/SurveyComponent';
import QuestionnairesManger from './src/Questionnaire/QuestionnaireManger';
import SurveyComponent from './src/Questionnaire/SurveyComponent';

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
                    <QuestionnairesManger />
                        <HomeLogin />
                    </Route>
                    <Route path="/search">
                        <App />
                    </Route>
                    <Route path='/userQuestionnaire/:QuestionnaireID' render={(props) => <SurveyComponent {...props}/>} >
                    </Route>
                </Switch>
              </Router>
        )
    }
}

export default Home;