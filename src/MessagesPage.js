import React, {Component} from "react"
import {Form} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import 'bootstrap/dist/css/bootstrap.css'
import axios from "axios";

class MessagesPage extends Component {

    constructor() {
        super();
        this.state = {
            messages:[],
            content:'כתוב את הודעתך כאן'
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        if (sessionStorage.getItem('patient')) {
            this.fetchMessages();
        }
    }

    async fetchMessages(){
        var response = await axios.get(
            "http://localhost:8180/auth/patients/messages",
            {
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': sessionStorage.getItem("token")
                }
            }
        );
        if(response.data.data) {
            this.setState({messages: response.data.data});
        }
    }

    async addMessage(){
        axios.post('http://localhost:8180/auth/patients/messages',
            {
                content: this.state.content,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': sessionStorage.getItem("token")
                }
            }).then(res => {
            window.alert("ההודעה נוספה בהצלחה!");
            this.fetchMessages();
            this.setState({content:"כתוב את הודעתך כאן"})
        });
    }



    handleChange(event) {
        this.setState({content: event.target.value});
}

    handleSubmit(event) {
        event.preventDefault();
        this.addMessage();
    }

    render() {
        require("./MessagesPage.css");

        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <label>
                        <textarea value={this.state.content} onChange={this.handleChange} />
                    </label>
                    <input type="submit" value="Submit" />
                </form>
                <br/>
                {this.state.messages.length > 0 &&
                <div class="tableMessages">
                    <Table id="mdd" striped bordered hover>
                        <thead>
                        <tr>
                            {/*<th>#</th>*/}
                            <th>תאריך</th>
                            <th>מוען</th>
                            <th>תוכן ההודעה</th>

                        </tr>
                        </thead>
                        <tbody>
                            {this.state.messages.map((message) => (
                                <tr>
                                    <td>{new Date(message.Date).toLocaleString()}</td>
                                    <td>{`${message.FromFirstName} ${message.FromLastName}`}</td>
                                    <td>{message.Content}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>}
                {this.state.messages.length === 0 &&
                <p> אין הודעות </p>
                }
            </div>
        )
    }
}

export default MessagesPage;


