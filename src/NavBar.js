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
import Button from 'react-bootstrap/Button';
import EdiText from 'react-editext'




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
            isExercises: false,
        };
        this.logout = this.logout.bind(this);
        this.change = this.change.bind(this);
        this.privateInfoShow = this.privateInfoShow.bind(this);
        this.togglePopup = this.togglePopup.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this)
        this.changeInfoField=this.changeInfoField.bind(this);
    }

    goToMessages() {
        this.setState({
            isPatientInfo: false,
            isInstructions: false,
            isMessage: true,
            isQuestionnaires: false,
            isExercises: false
        })
    }

    goToExercises() {
        this.setState({
            isPatientInfo: false,
            isInstructions: false,
            isMessage: false,
            isExercises: true,
            isQuestionnaires: false
        })
    }

    goToSearch() {
        this.setState({
            isPatientInfo: true,
            isMessage:false,
            isQuestionnaires: false,
            isInstructions: false,
            isExercises: false
        })
    }

    goToQuestionnaires() {
        this.setState({
            isPatientInfo: false,
            isMessage: false,
            isInstructions: false,
            isQuestionnaires: true,
            isExercises: false
        })
    }

    goToInstructions() {
        this.setState({
            isPatientInfo: false,
            isMessage: false,
            isInstructions: true,
            isQuestionnaires: false,
            isExercises: false
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

    async changeInfoField(fieldName,val) {
        let url = 'http://localhost:8180/users/editUser';
        const response = await axios.put(
            url,
            {
               fieldName:val,
                UserID: this.props.user.id
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': sessionStorage.getItem("token")
                }
            }
        );
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

                    <div id="buttons">
                        <button id="change" class="btn btn-dark" type="button" onClick={() => this.goToSearch()}>מדדים אישיים</button>
                        <span>{'    '}            </span>
                        <button id="change" class="btn btn-dark" type="button" onClick={() => this.goToQuestionnaires()}>שאלונים</button>
                        <span>{'              '}</span>
                        <button id="change" class="btn btn-dark" type="button"  onClick={() => this.goToMessages()}>לוח הודעות</button>
                        <button id="change" class="btn btn-dark" type="button" onClick={() => this.goToExercises()}>תרגולים רפואיים</button>
                        <button id="change" class="btn btn-dark" type="button" onClick={()=> this.goToInstructions()}>הדרכות ניתוח</button>
                        {this.state.isMessage ? <Redirect to="/messages" /> : null}
                        {this.state.isPatientInfo ? <Redirect to="/search" /> : null}
                        {this.state.isQuestionnaires ? <Redirect to="/questionnaires" /> : null}
                        {this.state.isQuestionnaires ? this.setState({isQuestionnaires: false}) : null}
                        {this.state.isInstructions ? <Redirect to="/instructions" /> : null}
                        {this.state.isExercises ? <Redirect to="/exercises" /> : null}
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
                    {iconType}
                    <NavDropdown  id="dropdown-item-button" style={{color : 'white'}} title = {sessionStorage.getItem("name")}>
                        <NavDropdown.Item as="button" onClick={() => this.change()}>שנה סיסמא</NavDropdown.Item>
                        <NavDropdown.Item as="button" onClick={() => this.logout()}>התנתק</NavDropdown.Item>
                        <NavDropdown.Item as="button" onClick={() => this.privateInfoShow()}>פרטים אישיים</NavDropdown.Item>
                    </NavDropdown>
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
            <div className='popup_inner_info' align={"right"} >
                <button onClick={this.props.closePopup} id="x">x</button>
                <h3 font={'Sans-serif'}>פרטים אישיים:</h3>
                <div className={"cont"}>
                    <b> שם: </b>
                <EdiText
                    type="textarea"
                    saveButtonContent="Apply"
                    cancelButtonContent={<strong>Cancel</strong>}
                    editButtonContent="Edit"
                    value={this.props.user.First_Name +" "+ this.props.user.Last_Name}
                    onSave={this.onSave}
            />
                <b>תאריך לידה: </b>
                <EdiText
                    type="date"
                    saveButtonContent="Apply"
                    cancelButtonContent={<strong>Cancel</strong>}
                    editButtonContent="Edit"
                    value= {bDate}
                    onSave={this.onSave}
                />

                    <b>גיל: </b>
                    <EdiText
                        type="number"
                        saveButtonContent="Apply"
                        cancelButtonContent={<strong>Cancel</strong>}
                        editButtonContent="Edit"
                        value= {age}
                        onSave={this.onSave}
                        validation={(value)=>{return value>=18 }}
                        validationMessage={"ערכים תקינים: גיל 18 ומעלה"}

                    />


                    <b>מין: </b>
                    <EdiText
                        type="textarea"
                        saveButtonContent="Apply"
                        cancelButtonContent={<strong>Cancel</strong>}
                        editButtonContent="Edit"
                        value= {this.props.user.Gender}
                        onSave={this.onSave}
                        validation={(value)=>{return ((value==="זכר")|| (value ==="נקבה")) }}
                        validationMessage={"ערכים תקינים: זכר, נקבה"}
                    />

                    <b>טלפון: </b>
                    <EdiText
                        type="number"
                        saveButtonContent="Apply"
                        cancelButtonContent={<strong>Cancel</strong>}
                        editButtonContent="Edit"
                        value= {this.props.user.Phone_Number}
                        onSave={this.onSave}
                    />
                    <b>גובה: </b>
                    <EdiText
                        type="number"
                        saveButtonContent="Apply"
                        cancelButtonContent={<strong>Cancel</strong>}
                        editButtonContent="Edit"
                        value= {this.props.user.Height}
                        onSave={this.onSave}
                    />
                    <b> BMI: </b>
                    <EdiText
                        type="number"
                        saveButtonContent="Apply"
                        cancelButtonContent={<strong>Cancel</strong>}
                        editButtonContent="Edit"
                        value= {bmi}
                        onSave={this.onSave}
                    />
                    <b>תאריך ניתוח: </b>
                    <EdiText
                        type="date"
                        saveButtonContent="Apply"
                        cancelButtonContent={<strong>Cancel</strong>}
                        editButtonContent="Edit"
                        value= {sDate}
                        onSave={this.onSave}
                    />
                    <b>סוג ניתוח: </b>
                    <EdiText
                        type="textarea"
                        saveButtonContent="Apply"
                        cancelButtonContent={<strong>Cancel</strong>}
                        editButtonContent="Edit"
                        value= {this.props.user.SurgeryType}
                        onSave={this.onSave}
                        validation={(value)=>{return ((value==="ניתוח דחוף")|| (value ==="ניתוח מתוכנן")|| (value==="ללא ניתוח")) }}
                        validationMessage={"ערכים תקינים: ניתוח דחוף, ניתוח מתוכנן, ללא ניתוח"}
                    />
                    <b>השכלה: </b>
                    <EdiText
                        type="textarea"
                        saveButtonContent="Apply"
                        cancelButtonContent={<strong>Cancel</strong>}
                        editButtonContent="Edit"
                        value= {this.props.user.Education}
                        onSave={this.onSave}
                        validation={(value)=>{return ((value==="השכלה תיכונית")|| (value ==="השכלה אקדמאית") || (value ==="10-12 שנות לימוד") || (value ==="6-9 שנות לימוד")
                            || (value ==="5 שנות לימוד או פחות") || (value ==="לא מעוניין לענות"))}}
                        validationMessage={"ערכים תקינים: השכלה אקדמאית, השכלה תיכונית, 10-12 שנות לימוד, 6-9 שנות לימוד, 5 שנות לימוד או פחות, לא מעוניין לענות"}
                    />
            </div>

            </div>

        );
    }
}