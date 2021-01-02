import React, {Component} from "react"
import Table from "react-bootstrap/Table";
import 'bootstrap/dist/css/bootstrap.css'
import axios from "axios";


class MessagesPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            messages:[],
            content:'כתוב את הודעתך כאן'
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.fetchMessagesPatient();
        this.fetchMessagesDoctor();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        console.log(`prevProps ${prevProps.patientUserId}`);
        console.log(`props ${this.props.patientUserId}`);
        if(this.props.patientUserId && this.props.patientUserId !== prevProps.patientUserId) {
            console.log(`inside if componentDidUpdate`);
            this.fetchMessagesDoctor();
        }
    }

    async fetchMessagesPatient(){
        if(sessionStorage.getItem('patient')) {
            var response = await axios.get(
                "http://localhost:8180/auth/patients/messages",
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-auth-token': sessionStorage.getItem("token")
                    }
                }
            );
            if (response.data.data) {
                this.setState({messages: response.data.data.reverse()});
            }
        }
    }

    async fetchMessagesDoctor(){
        if(sessionStorage.getItem('doctor') && this.props.patientUserId) {
            let patientId = encodeURIComponent(this.props.patientUserId);
            var response = await axios.get(
                `http://localhost:8180/auth/doctors/messages/${patientId}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-auth-token': sessionStorage.getItem("token")
                    }
                }
            );
            if (response.data.data) {
                this.setState({messages: response.data.data.reverse()});
            }
        }
    }


    async addMessage(){
        if (sessionStorage.getItem('patient')) {
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
                this.fetchMessagesPatient();
                this.setState({content: "כתוב את הודעתך כאן"})
            });
        }
        if (sessionStorage.getItem('doctor')){
            let patientId = encodeURIComponent(this.props.patientUserId);
            axios.post( `http://localhost:8180/auth/doctors/messages/${patientId}`,
                {
                    content: this.state.content,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-auth-token': sessionStorage.getItem("token")
                    }
                }).then(res => {
                this.fetchMessagesDoctor();
                this.setState({content: "כתוב את הודעתך כאן"})
            });
        }
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
                    <textarea class="textarea" value={this.state.content} onChange={this.handleChange} />
                    <br/>
                    <input style={{marginRight: "auto", marginLeft: "auto"}} type="submit" value="Submit" />
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


