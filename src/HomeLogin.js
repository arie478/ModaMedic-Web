import React, {Component} from 'react';
import "./HomeLogin.css"
import Login from "./Login"
import Logo from "./Logo"
import {
    Redirect
} from "react-router-dom";
import Navbar from "react-bootstrap/cjs/Navbar";
import Button from "react-bootstrap/Button";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import NavDropdown from "react-bootstrap/NavDropdown";
import NavBar from "./NavBar";


class HomeLogin extends Component{

    render(){
        var path = window.location.pathname;
        if(path.includes("search")){
            window.location.pathname = path.replace("search", "");
        }
        return(
            <div>

                <div className="Home">
                    {sessionStorage.getItem("token") ?  <Redirect from={path} to="/search" /> : null  }
                    <br />
                    <header className="Home-header">
                        <Logo />
                        <Login />
                    </header>
                </div>
              </div>
        )
    }
}

export default HomeLogin;