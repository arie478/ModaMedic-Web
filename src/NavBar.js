import React from 'react'
import "./NavBar.css"
import { Navbar,Nav } from 'react-bootstrap'
import {Redirect} from "react-router-dom";
import axios from "axios";
import NavDropdown from "react-bootstrap/NavDropdown";
import { FaUser,FaUserMd } from 'react-icons/fa'
import 'bootstrap/dist/css/bootstrap.css'
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import PatientData from "./PatientData";



class NavBar extends React.Component {
    constructor(){
        super();
        this.state = {
            showPopup: false,
            userInfo: false,
            pass: "",
            pass2: "",
            diff: false,
            isLogOut: false,
            isMessage: false,
            isPatientInfo: false,
            isInstructions: false,
        };
        this.logout = this.logout.bind(this);
        this.change = this.change.bind(this);
        this.privateInfoShow = this.privateInfoShow.bind(this);
        this.togglePopup = this.togglePopup.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    goToMessages() {
        this.setState({
            isPatientInfo: false,
            isInstructions: false,
            isMessage: true,
            isQuestionnaires: false

        })
    }

    goToSearch() {
        this.setState({
            isPatientInfo: true,
            isMessage:false,
            isQuestionnaires: false,
            isInstructions: false
        })
    }

    goToQuestionnaires() {
        this.setState({
            isPatientInfo: false,
            isMessage: false,
            isInstructions: false,
            isQuestionnaires: true
        })
    }

    goToInstructions() {
        this.setState({
            isPatientInfo: false,
            isMessage: false,
            isInstructions: true,
            isQuestionnaires: false
        })
    }

    togglePopup() {
        this.setState({
            showPopup: !this.state.showPopup
        });
    }

    toggleUserInfo() {
        this.setState({
            userInfo: !this.state.userInfo
        });
    }

    async handleSubmit(event){
        event.preventDefault();
        if(this.state.pass !== this.state.pass2){
            this.setState({
                diff: true
            });
        }
        else{
            let url = 'http://localhost:8180/auth/usersAll/askChangePassword';
            var token;
            const response = await axios.post(
                url,
                {},
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-auth-token': sessionStorage.getItem("token")
                    }
                }
            );
            token = response.data.data;
            url = 'http://localhost:8180/users/passwordChangeCheck/changePassword';
            const responsec = await axios.post(
                url,
                {
                    "NewPassword":this.state.pass
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-auth-token': token
                    }
                }
            );
            if(responsec.data.message){
                window.alert("הסיסמא שונתה בהצלחה");
                this.togglePopup();
            }
        }
    }

    componentDidMount() {
        this.getInfo()
    }

    async getInfo(){
        let url = 'http://localhost:8180/auth/usersAll/userInfo';
        var token;
        const response = await axios.get(
            url,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': sessionStorage.getItem("token")
                }
            }
        );
        this.setState({currUser: response.data.data})
    }


    handleChange(event) {
        const {name, value, type, checked} = event.target
        type === "checkbox" ? this.setState({ [name]: checked }) : this.setState({ [name]: value })
    }

    logout() {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("type");
        sessionStorage.removeItem("name");
        sessionStorage.removeItem("doctor");
        sessionStorage.removeItem("patient");
        sessionStorage.removeItem("patientUserId");
        localStorage.removeItem("token");
        localStorage.removeItem("type");
        localStorage.removeItem("name");
        localStorage.removeItem("doctor");
        localStorage.removeItem("patient");
        this.setState({
            isLogOut: true
        })
    }

    change(){
        this.togglePopup();
    }

    privateInfoShow(){
        this.toggleUserInfo()
    }

    isDoctor(){
        return sessionStorage.getItem('doctor')
    }

    render() {
        var path = window.location.pathname;
        require("./NavBar.css");
        var iconType;
        if (this.isDoctor()) {
            iconType = <FaUserMd class="userIcon" style={{color: 'white'}} size={25}/>

        }else{
            iconType =  <FaUser class="userIcon" style={{color: 'white'}} size={25}/>
        }
        return (
            <div>
                <Navbar class="navbar navbar-fixed-top" bg="dark" variant="dark" fixed="top">
                    <NavDropdown  id="dropdown-item-button" style={{color : 'white'}} title = {sessionStorage.getItem("name")}>
                        <NavDropdown.Item as="button" onClick={() => this.change()}>שנה סיסמא</NavDropdown.Item>
                        <NavDropdown.Item as="button" onClick={() => this.logout()}>התנתק</NavDropdown.Item>
                        <NavDropdown.Item as="button" onClick={() => this.privateInfoShow()}>פרטים אישיים</NavDropdown.Item>
                    </NavDropdown>
                    {iconType}
                    <div id="buttons">
                        <button id="change" class="btn btn-dark" type="button" onClick={() => this.goToSearch()}>מדדים אישיים</button>
                        <span>{'    '}            </span>
                        <button id="change" class="btn btn-dark" type="button" onClick={() => this.goToQuestionnaires()}>שאלונים</button>
                        <span>{'              '}</span>
                        <button id="change" class="btn btn-dark" type="button"  onClick={() => this.goToMessages()}>לוח הודעות</button>
                        <button id="change" class="btn btn-dark" type="button" >תרגולים רפואיים</button>
                        <button id="change" class="btn btn-dark" type="button" onClick={()=> this.goToInstructions()}>הדרכות ניתוח</button>
                        {this.state.isMessage ? <Redirect to="/messages" /> : null}
                        {this.state.isPatientInfo ? <Redirect to="/search" /> : null}
                        {this.state.isQuestionnaires ? <Redirect to="/questionnaires" /> : null}
                        {this.state.isInstructions ? <Redirect to="/instructions" /> : null}
                        {this.state.isLogOut ? <Redirect to="/" /> : null}
                        {this.state.showPopup ?
                            <Popup
                                change={this.handleChange.bind(this)}
                                closePopup={this.togglePopup.bind(this)}
                                handleSubmit={this.handleSubmit.bind(this)}
                                diff={this.state.diff}
                            /> : null
                        }
                        {this.state.userInfo ?
                            <UserInfo
                                user = {this.state.currUser}
                                closePopup={this.toggleUserInfo.bind(this)}
                            /> : null
                        }
                    </div>

                    <Navbar.Brand>
                        <img
                            alt=""
                            src={require("./first_logo.png")}
                            width="70"
                            height="30"
                            className="d-inline-block align-top"
                        />{' '}
                    </Navbar.Brand>
                </Navbar>
                <br/>
                <br/>
            </div>
        )
    }
}

export default NavBar;

class Popup extends React.Component {
    render() {
        // require("./App.css");
        return (
            <div className='popup'>
                <div className='popup_inner'>
                    <button onClick={this.props.closePopup} id="x">x</button>
                    <h3 id="h3">החלפת סיסמא</h3>
                    <form onSubmit={this.props.handleSubmit}>
                        <div className="lineC">
                            <label>
                                סיסמא חדשה:
                            </label>
                        </div>
                        <div className="lineC">
                            <input type="password" name="pass" id="pass" onChange={this.props.change} required/>
                        </div>
                        <div className="lineC">
                            <label>
                                הקלד את הסיסמא מחדש:
                            </label>
                        </div>
                        <div className="lineC">
                            <input type="password" name="pass2" id="pass2" onChange={this.props.change} required/>
                        </div>
                        <div className="lineC">
                            {this.props.diff ? <label id="diffPass">הסיסמאות שונות</label> : null}
                        </div>
                        <div className="lineC">
                            <input type="submit" value="שלח"/>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

class UserInfo extends React.Component {
    render() {
        require("./NavBar.css");
        let bDate = new Date(this.props.user.BirthDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        let sDate;
        var today = new Date();
        var birthday = new Date(this.props.user["BirthDate"]);
        var age = Math.floor((today.getTime() - birthday.getTime())/ 31536000000)
        if(this.props.user.DateOfSurgery){
            sDate = (new Date(this.props.user["DateOfSurgery"])).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        }
        else{
            sDate = "לא נקבע יום ניתוח";
        }
     let bmi = parseFloat(this.props.user["BMI"]).toFixed(1);
        let patientListItems;
        if(sessionStorage.getItem("patient")){
                patientListItems =  <div><ListGroup.Item> גובה: {this.props.user.Height}</ListGroup.Item> <ListGroup.Item> משקל: {this.props.user.Weight}</ListGroup.Item>
            <ListGroup.Item> BMI:{bmi}</ListGroup.Item>
            <ListGroup.Item> תאריך ניתוח: {sDate} </ListGroup.Item>
            <ListGroup.Item> סוג ניתוח: {this.props.user.SurgeryType} </ListGroup.Item>
            <ListGroup.Item> השכלה: {this.props.user.Education} </ListGroup.Item>
                </div>
        }
        return (
            <div className='popup'>
                <div className='popup_inner_info'>
                    <button onClick={this.props.closePopup} id="x">x</button>
                    <Card style={{ align:'center',width: '30rem', marginLeft: '15%', marginTop:'0%' }}>
                        <Card.Header><b>{this.props.user.First_Name}{' '}{this.props.user.Last_Name}</b></Card.Header>
                        <ListGroup variant="flush">
                            <ListGroup.Item > תאריך לידה: {bDate} </ListGroup.Item>
                            <ListGroup.Item > גיל: {age}</ListGroup.Item>
                            <ListGroup.Item> מין: {this.props.user.Gender} </ListGroup.Item>
                            <ListGroup.Item> טלפון: {this.props.user.Phone_Number} </ListGroup.Item>
                            {patientListItems}
                        </ListGroup>
                    </Card>
                </div>
            </div>
        );
    }
}