import React from 'react'
import "./NavBar.css"
import { Navbar,Nav } from 'react-bootstrap'
import {Redirect} from "react-router-dom";
import axios from "axios";
import NavDropdown from "react-bootstrap/NavDropdown";
import { FaUser,FaUserMd } from 'react-icons/fa'
import 'bootstrap/dist/css/bootstrap.css'



class NavBar extends React.Component {
    constructor(){
        super();
        this.state = {
            showPopup: false,
            pass: "",
            pass2: "",
            diff: false,
            isLogOut: false,
            isMessage: false,
            isPatientInfo: false,
            isQuestionnaires: false
        };
        this.logout = this.logout.bind(this);
        this.change = this.change.bind(this);
        this.togglePopup = this.togglePopup.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    goToMessages() {
        this.setState({
            isPatientInfo: false,
            isMessage: true,
            isQuestionnaires: false

        })
    }

    goToSearch() {
        this.setState({
            isPatientInfo: true,
            isMessage:false,
            isQuestionnaires: false
        })
    }

    goToQuestionnaires() {
        this.setState({
            isPatientInfo: false,
            isMessage:false,
            isQuestionnaires: true
        })
    }

    togglePopup() {
        this.setState({
            showPopup: !this.state.showPopup
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
                    <NavDropdown.Item as="button">פרטים אישיים</NavDropdown.Item>
                </NavDropdown>

                    {iconType}
                    <div id="buttons">
                        <button id="change" class="btn btn-dark" type="button" onClick={() => this.goToSearch()}>מדדים אישיים</button>
                        <button id="change" class="btn btn-dark" type="button" onClick={() => this.goToQuestionnaires()}>שאלונים</button>
                        <button id="change" class="btn btn-dark" type="button"  onClick={() => this.goToMessages()}>לוח הודעות</button>
                        <button id="change" class="btn btn-dark" type="button" >תרגולים רפואיים</button>
                        <button id="change" class="btn btn-dark"type="button">הדרכות ניתוח</button>
                        {this.state.isMessage ? <Redirect to="/messages" /> : null}
                        {this.state.isPatientInfo ? <Redirect to="/search" /> : null}
                        {this.state.isQuestionnaires ? <Redirect to="/questionnaires" /> : null}
                        {this.state.isLogOut ? <Redirect to="/" /> : null}
                        {this.state.showPopup ?
                            <Popup
                                change={this.handleChange.bind(this)}
                                closePopup={this.togglePopup.bind(this)}
                                handleSubmit={this.handleSubmit.bind(this)}
                                diff={this.state.diff}
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
    };
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