import React, {Component} from "react"
import Table from "react-bootstrap/Table";
import 'bootstrap/dist/css/bootstrap.css'
import axios from "axios";
import { AiFillDelete, AiFillEdit } from 'react-icons/ai'



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
        if(this.props.patientUserId && this.props.patientUserId !== prevProps.patientUserId) {
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

    async removeMessage(mId){
        if (sessionStorage.getItem('patient')) {
            console.log("patient")
            axios.post('http://localhost:8180/auth/patients/messages/removeMessage',
                {
                    MessageId: mId,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-auth-token': sessionStorage.getItem("token")
                    }
                }).then(res => {
                this.fetchMessagesPatient();
                this.fetchMessagesDoctor();
            });
        }
        else if(sessionStorage.getItem('doctor')) {
            axios.delete(`http://localhost:8180/auth/doctors/messages/removeMessage/${mId}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-auth-token': sessionStorage.getItem("token")
                    }
                }).then(res => {
                // this.fetchMessagesPatient();
                this.fetchMessagesDoctor();
            });
        }
    }

    // async updateMessage(mId){
    //     console.log(mId)
    //     if (sessionStorage.getItem('patient')) {
    //         axios.put('http://localhost:8180/auth/patients/messages/updateMessage',
    //             {
    //                 MessageId: mId,
    //                 Content: this.state.content
    //             },
    //             {
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                     'x-auth-token': sessionStorage.getItem("token")
    //                 }
    //             }).then(res => {
    //             this.fetchMessagesPatient();
    //         });
    //     }
    // }




    handleChange(event) {
        // let content = event.target.value
        // if(content.length() > 150){
        //     window.alert("אורך ההודעה עד 150 תוים")
        // } else {
            this.setState({content: event.target.value});
        // }
    }

    handleSubmit(event) {
        event.preventDefault();
        if(sessionStorage.getItem('docotor') && this.props.patientUserId == undefined){
            window.alert("אנא בחר מטופל לצורך שליחת הודעה")
        }else {
            if (this.state.content.length > 150) {
                window.alert("אורך הודעה עד 150 תוים!")
            } else {
                var count = 0;
                var dt2 = new Date();
                this.state.messages.forEach(message => {
                    let dt1 = new Date(message.Date);
                    if (Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate())) / (1000 * 60 * 60 * 24)) <= 1) {
                        count = count + 1;
                    }
                });
            }
            if (count > 2 && sessionStorage.getItem('patient')) {
                window.alert("כמות ההודעות מוגבלת ל3 הודעות ביום")
            } else {
                this.addMessage();
            }
        }
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
                            <th style={{width: 230}}>תאריך</th>
                            <th style={{width: 180}}>מוען</th>
                            <th style={{width: 620}}>תוכן ההודעה</th>
                            <th style={{width: 100}}></th>
                        </tr>
                        </thead>
                        <tbody>
                            {this.state.messages.map((message) => (
                                <tr>
                                    <td style={{width: 230}}>{new Date(message.Date).toLocaleString()}</td>
                                    <td style={{width: 180}}>{` ${message.FromFirstName} ${message.FromLastName}`}</td>
                                    <td style={{width: 620, textAlign: "right"}}>{message.Content}</td>
                                    <td  style={{width: 100}}><AiFillDelete type="button" class="trushIcon" style={{color: 'black'}} size={20} onClick={()=>this.removeMessage(message.MessageId)}/></td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    <br/>

                </div>}
                {this.state.messages.length === 0 &&
                <p> אין הודעות </p>
                }
                <img class="imageBox" src="https://image.freepik.com/free-photo/top-view-doctor-working-with-laptop_1232-386.jpg" style={{width: 450, borderColor: "black"}}></img>
            </div>
        )
    }
}

export default MessagesPage;


