import React, { Component } from "react";
import axios from 'axios';
import {Redirect} from "react-router-dom";
import Button from "react-bootstrap/Button";
import Select from 'react-select';
import DropdownMultiselect from "react-multiselect-dropdown-bootstrap";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";




class PrivateInformation extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userName: "",
            fName: "",
            lName: "",
            password: "",
            bday: new Date(),
            phone: "",
            questionsID: [],
            questionsText: [],
            questions :[],
            answerUserQuestion: "",
            code: "",
            questionnaires: [],
            questionnairesID:[],
            questionnairesText:[],
            questionnairesChosen:0,
            quesionChosen: 0,
            gender: "",
            smoke: "",
            dateOfSurgery:"",
            surgeryType: "",
            education: "",
            height: "",
            weight: "",
            bmi:"",
        };

        this.handleChange = this.handleChange.bind(this);
    }



    componentDidMount() {
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }


    isDoctor(){
        this.setState({type: 'doctor'})
    }
    isPatient(){
        this.setState({type: 'patient'})
    }
    render() {
        require("./AddUser.css");
        return (
            <div>
                <Card style={{ width: '18rem' }}>
                    <Card.Header>Featured</Card.Header>
                    <ListGroup variant="flush">
                        <ListGroup.Item>{this.state.pName}</ListGroup.Item>
                        <ListGroup.Item>Dapibus ac facilisis in</ListGroup.Item>
                        <ListGroup.Item>Vestibulum at eros</ListGroup.Item>
                    </ListGroup></Card>
            </div>
        );
    }
}

export default PrivateInformation;