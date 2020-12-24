import React from 'react'
import "./NavBar.css"
import { Navbar,Nav } from 'react-bootstrap'
import PatientSearch from './PatientSearch';
import NavItem from "react-bootstrap/NavItem";
import Button from "react-bootstrap/Button";
import {Redirect} from "react-router-dom";
import axios from "axios";
import NavDropdown from "react-bootstrap/NavDropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
// import { MDBIcon } from "mdbreact";


class NavBar extends React.Component {
    constructor(){
        super();
        this.state = {
            showPopup: false,
            pass: "",
            pass2: "",
            diff: false,
            isLogOut: false
        };
        this.logout = this.logout.bind(this);
        this.change = this.change.bind(this);
        this.togglePopup = this.togglePopup.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this)
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
        localStorage.removeItem("token");
        localStorage.removeItem("type");
        localStorage.removeItem("name");
        localStorage.removeItem("doctor");
        this.setState({
            isLogOut: true
        })
    }

    change(){
        this.togglePopup();
    }


render() {
    return (
        <Navbar class="navbar navbar-fixed-top" bg="dark" variant="dark" fixed="top">
            <Navbar.Brand>
                <img
                    alt=""
                    src={require("./first_logo.png")}
                    width="60"
                    height="30"
                    className="d-inline-block align-top"
                />{' '}
            </Navbar.Brand>
            {/*<MDBIcon icon="user" className="mr-2" />*/}
            <NavDropdown  id="dropdown-item-button" style={{color : 'white'}} title = {sessionStorage.getItem("name")}>
                <NavDropdown.ItemText ></NavDropdown.ItemText>
                <NavDropdown.Item as="button" onClick={() => this.change()}>שנה סיסמא</NavDropdown.Item>
                <NavDropdown.Item as="button" onClick={() => this.logout()}>התנתק</NavDropdown.Item>
                <NavDropdown.Item as="button">פרטים אישיים</NavDropdown.Item>
            </NavDropdown>
            {/*<NavDropdown style={{color : 'white'}} title = {sessionStorage.getItem("name")} id="basic-nav-dropdown">*/}
            {/*    <NavDropdown.Item onClick={() => this.change()}>שנה סיסמא</NavDropdown.Item>*/}
            {/*    <NavDropdown.Item onClick={() => this.logout()}>התנתק</NavDropdown.Item>*/}
            {/*    /!*<NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>*!/*/}
            {/*</NavDropdown>*/}
            {/*<NavItem style={{color : 'white'}}> {sessionStorage.getItem("name")} </NavItem>*/}
            {/*<Button id="sep" onClick={() => this.change()}> |</Button>*/}
            {/*<Button class="text" id="change" onClick={() => this.change()}>שנה סיסמא</Button>*/}
            {/*<Button id="change" onClick={() => this.logout()}>התנתק</Button>*/}
            <Button id="change">מדדים אישיים</Button>
            <Button id="change">שאלונים</Button>
            <Button id="change">לוח הודעות</Button>
            <Button id="change">תרגולים רפואיים</Button>
            <Button id="change">הדרכות ניתוח</Button>
            {this.state.isLogOut ? <Redirect to="/" /> : null}
            {this.state.showPopup ?
                <Popup
                    change={this.handleChange.bind(this)}
                    closePopup={this.togglePopup.bind(this)}
                    handleSubmit={this.handleSubmit.bind(this)}
                    diff={this.state.diff}
                /> : null
            }
        </Navbar>
        )
    };
}

export default NavBar;

class Popup extends React.Component {

    render() {
        require("./App.css");
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