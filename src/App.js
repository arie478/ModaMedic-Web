import React, {Component} from 'react';
import "./Logo";
import "./Search";
import "./PatientSearch";


import Logo from './Logo';
import NavBar from "./NavBar";
import axios from "axios";
import Card from "react-bootstrap/Card";
import MessagesPage from "./MessagesPage";
import PatientSearchNew from "./PatientSearchNew";
import QuestionnairesManger from "./Questionnaire/QuestionnaireManger";
import {Route} from "react-router-dom";
import SurveyComponent from "./Questionnaire/SurveyComponent";
import InstructionsSurgery from "./InstructionsSurgery";
import ExercisesPage from "./ExercisesPage";

import { Document, Page, pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            optionsPName: [],
            namesDiv: [],
            isFetchingNames: false,
            users: [],
            pName:'',
            encrypName:'',
            showPopup: false,
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.togglePopup = this.togglePopup.bind(this);
        this.fetchNamesForResearch = this.fetchNamesForResearch.bind(this);
        this.handlePName = this.handlePName.bind(this)
    }

    componentDidMount() {
        if(this.isDoctor()) {
            this.fetchNamesForResearch()
                .then(() => console.log("Fetch names successfully"));
        }
    }

    async fetchNamesForResearch(){
        var list = [];
        var users = [];
        var namesDiv = [];
        this.setState({isFetchingNames: true});
        var response = await axios.get(
            " https://icc.ise.bgu.ac.il/njsw18auth/doctors/metrics/getUsers",
            {
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': sessionStorage.getItem("token")
                }
            }
        );
        if(response.data.data){
            var names = [];
            for(var i = 0; i < response.data.data.length; i++){
                let user = response.data.data[i];
                namesDiv.push({UserID: user.UserID});
                users.push(user);
                // names.push(user.UserID)
            }
            // names = names.sort();
            // var uniqueNames = Array.from(new Set(names));
            // for(i = 0; i < uniqueNames.length; i++){
            //     list.push(<option key={uniqueNames[i]}>{uniqueNames[i]}</option>);
            // }
        }
        this.setState({
            isFetchingNames: false,
            // optionsPName: list,
            namesDiv: namesDiv,
            users: users
        });
    }
    async fetchNames(){
        var list = [];
        var users = [];
        var namesDiv = [];
        this.setState({isFetchingNames: true});
        var response = await axios.get(
            " https://icc.ise.bgu.ac.il/njsw18auth/doctors/metrics/getUsers",
            {
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': sessionStorage.getItem("token")
                }
            }
        );
        if(response.data.data){
            var names = [];
            for(var i = 0; i < response.data.data.length; i++){
                let user = response.data.data[i];
                namesDiv.push({first: user.First_Name, last: user.Last_Name});
                users.push(user);
                names.push(user.First_Name.trim() + " " + user.Last_Name.trim())
            }
            names = names.sort();
            var uniqueNames = Array.from(new Set(names));
            for(i = 0; i < uniqueNames.length; i++){
                list.push(<option key={uniqueNames[i]}>{uniqueNames[i]}</option>);
            }
        }
        this.setState({
            isFetchingNames: false,
            optionsPName: list,
            namesDiv: namesDiv,
            users: users
        });
    }

    togglePopup() {
        this.setState({
            showPopup: !this.state.showPopup
        });
    }

    handlePName(event) {
        this.setState({pName: event.target.value});
    }

    async handleSubmit(event) {
        if(event){
            event.preventDefault()
        }
         await axios.post( ` https://icc.ise.bgu.ac.il/njsw18auth/doctors/metrics/userId`,
            {
                UserID: this.state.pName,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': sessionStorage.getItem("token")
                }
            }).then(res => {
            this.setState({encrypName: res.data.data})
        });
        let usersByName = [];
        this.state.users.forEach(user => {
            if(this.state.encrypName === user.UserID) {
                console.log(`found user ${user}`);
                usersByName.push(user);
            }
        });
        let cards = [];
        for(let i = 0; i < usersByName.length; i++){
            let user = usersByName[i];
            let dateC = new Date(user.BirthDate).toLocaleDateString('en-GB', {day: 'numeric', month: 'numeric', year:"numeric"});
            cards.push(
                <Card className="cardApp" key={user.UserID}  onClick={() => {
                    this.setState({patientUserId: user.UserID, user: user});
                    this.togglePopup();
                }}>
                    <Card.Body className="cardBody">מזהה מטופל: {this.state.pName.trim()} </Card.Body>
                    {/*<Card.Body className="cardBody">שם מלא: {this.state.pName.trim()} </Card.Body>*/}
                    {/*<Card.Body className="cardBody">תאריך לידה: {dateC}</Card.Body>*/}
                </Card>
            );
        }
        this.setState({
            text: cards
        });
        this.togglePopup();
    }

    isDoctor() {
        return sessionStorage.getItem('doctor');
    }

    searchPatient() {
        require("./search.css");
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    {/*<datalist id="first-list">{this.state.optionsPName}</datalist>*/}
                    <div className="search">
                        <label className="lSearch">
                            חפש מטופל:
                        </label>
                        <input className="iSearch"
                               id="pname"
                               type="text"
                               name="pName"
                               value={this.state.pName}
                               placeholder="מספר מטופל"
                               onChange={this.handlePName}
                               list="first-list"
                               required
                        />
                        <button type="submit" className="bSearch">
                            חפש
                        </button>
                    </div>
                </form>
                <br />
                {this.state.showPopup ?
                    <Popup
                        text={this.state.text}
                        closePopup={this.togglePopup.bind(this)}
                    /> : null
                }
            </div>
        )
    }


    getActiveComponent() {
        if(this.props.component === 'search') {
            return <PatientSearchNew patientUserId={this.state.patientUserId}/>;
        } else if(this.props.component === 'messages') {
            return <MessagesPage patientUserId={this.state.patientUserId}/>
        } else if(this.props.component === 'questionnaires'){
            return <QuestionnairesManger user = {this.state.user}/>
        } else if(this.props.component === 'survey'){
            return <SurveyComponent {...this.props}/>
        } else if(this.props.component === 'instructions'){
            return <InstructionsSurgery {...this.props}/>
        } else if(this.props.component === 'exercises'){
            return <ExercisesPage {...this.props}/>
        }
        return null;
    }

    checkIfNotSearchNeeded(){
        if(this.props.component === 'instructions' || this.props.component === 'exercises'){
            return false;
        }
        return true
    }

    render() {
        require("./App.css");
        return (
            <div>
                <NavBar />
                <div className="App">
                    <header className="App-header">
                        <Logo />
                        {this.isDoctor() && this.checkIfNotSearchNeeded() && this.searchPatient()}
                        {this.getActiveComponent()}
                        <br />
                    </header>
                </div>
            </div>
        )
    }
}


export default App;

class Popup extends React.Component {
    render() {
        return (
            <div className='popupApp'>
                <div className='popup_inner_App' >
                    <button onClick={this.props.closePopup} id="x">x</button>
                    <h4>אנא בחר מבין הרשומות הבאות:</h4>
                    {this.props.text}
                </div>
            </div>
        );
    }
}