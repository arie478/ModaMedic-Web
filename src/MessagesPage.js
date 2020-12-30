import React, {Component} from "react"
import Table from "react-bootstrap/Table";
import 'bootstrap/dist/css/bootstrap.css'
import axios from "axios";


class MessagesPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            messages:[],
            content:'כתוב את הודעתך כאן',
            patientUserId: sessionStorage.getItem("patientUserId")
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        if (sessionStorage.getItem('patient')) {
            this.fetchMessagesPatient();
        }
        if (sessionStorage.getItem('doctor') && sessionStorage.getItem("patientUserId")) {
            this.fetchMessagesDoctor();
        }
    }

    async fetchMessagesPatient(){
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

    async fetchMessagesDoctor(){
        let patientId = encodeURIComponent(sessionStorage.getItem("patientUserId"));
        var response = await axios.get(
            `http://localhost:8180/auth/doctors/messages/${patientId}`,
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
            this.fetchMessagesPatient();
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
                <form style={{align:"center"}} onSubmit={this.handleSubmit}>
                    <lable>
                    <textarea class="textarea" value={this.state.content} onChange={this.handleChange} />
                    <br/>
                    <input style={{marginRight: "auto", marginLeft: "auto"}} type="submit" value="Submit" />
                    </lable>
                </form>
                <br/>
                {this.state.messages.length > 0 &&
                <div class="tableMessages">
                    <Table id="mdd" striped bordered hover>
                        <thead>
                        <tr>
                            <th style={{width: 250}} >תאריך</th>
                            <th style={{width: 250}} >מוען</th>
                            <th style={{width: 500}}>תוכן ההודעה</th>
                        </tr>
                        </thead>
                        <tbody>
                            {this.state.messages.map((message) => (
                                <tr>
                                    <td style={{width: 250}}>{new Date(message.Date).toLocaleString()}</td>
                                    <td style={{width: 250}}>{`${message.FromFirstName} ${message.FromLastName}`}</td>
                                    <td style={{width: 500, textAlign: "right"}}>{message.Content}</td>
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


