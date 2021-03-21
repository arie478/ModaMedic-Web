import React, {Component} from "react"
import axios from 'axios';
import "../TableQuestionnaire.css";
import { BrowserRouter, Route, Link } from "react-router-dom";
import SurveyComponent from './SurveyComponent';
import Table from 'react-bootstrap/Table';
import {borderColor} from "@material-ui/system";
//   import 'bootstrap/dist/css/bootstrap.css';


class QuestionnaireManger extends Component {
    constructor(props) {
        super()
        if(props.user && sessionStorage.getItem('doctor')) {
            var q2 = false, q3 = false, q4 = false, q5 = false;
            for (var i = 0; i < props.user["Questionnaires"].length; i++) {
                if (props.user["Questionnaires"][i]["QuestionnaireID"] === 1) {
                    q2 = true;
                } else if (props.user["Questionnaires"][i]["QuestionnaireID"] === 2) {
                    q3 = true;
                } else if (props.user["Questionnaires"][i]["QuestionnaireID"] === 3) {
                    q4 = true;
                } else if (props.user["Questionnaires"][i]["QuestionnaireID"] === 5) {
                    q5 = true;
                }
            }
        }
        this.state = {
            user: props.user,
            showPopup: false,
            showPopupQ: false,
            new_date: "",
            Questionnaires: [],
            quest1: false,
            quest2: q2,
            quest3: q3,
            quest4: q4,
            quest5: q5,
            quest6: false,
            questionnairesArr: [],
            questionnairesArrDoctor: [],
            type: sessionStorage.getItem('type'),
            firstTime: true
        };


        this.presentQuestionnaire = this.presentQuestionnaire.bind(this);
        this.presentQuestionnaire();
        this.changeDate = this.changeDate.bind(this);
        this.togglePopup = this.togglePopup.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.togglePopupQ = this.togglePopupQ.bind(this);
        this.handleSubmitQ = this.handleSubmitQ.bind(this)
    }

    async presentQuestionnaire(){
        if(sessionStorage.getItem('patient')) {
            let url = 'http://localhost:8180/auth/usersAll/getUserQuestionnaire';
            let response = await axios.get(
                url,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-auth-token': sessionStorage.getItem("token")
                    }
                });

            if (response.data.data) {
                //console.log (response.data.data);
                let questionnairesArrTemp = [];
                //run over questionareest
                for (var i = 0; i < response.data.data.length; i++) {
                    questionnairesArrTemp.push([response.data.data[i].QuestionnaireID, response.data.data[i].QuestionnaireText]);
                }

                this.setState({
                    questionnairesArr: questionnairesArrTemp
                });
            }
        }
    }
    handleSubmit(e){
        e.preventDefault();
        //     let date = (new Date(this.state.new_date)).getTime();
        //     let id = this.props.user["UserID"];
        //     axios.post('http://localhost:8180/auth/usersAll/changeDateOfSurgery',
        //         {
        //             UserID: id,
        //             DateOfSurgery: date
        //         },
        //         {
        //             headers: {
        //                 'Content-Type': 'application/json',
        //                 'x-auth-token': sessionStorage.getItem("token")
        //             }
        //         }).then(res => {
        //         window.alert("התאריך שונה בהצלחה")
        //         this.togglePopup();
        //     });
    }

    handleChange(event) {
        const {name, value, type, checked} = event.target
        type === "checkbox" ? this.setState({ [name]: checked }) : this.setState({ [name]: value });
    }

    handleSubmitQ(e){
        e.preventDefault();
        if(sessionStorage.getItem('doctor')) {
            var Questionnaires = [];
            if (this.state.quest2) {
                Questionnaires.push({
                    "QuestionnaireID": 1,
                    "QuestionnaireText": "תפקוד גב תחתון"
                })
            }
            if (this.state.quest3) {
                Questionnaires.push({
                    "QuestionnaireID": 2,
                    "QuestionnaireText": "תפקוד צוואר"
                })
            }
            if (this.state.quest4) {
                Questionnaires.push({
                    "QuestionnaireID": 3,
                    "QuestionnaireText": "תפקוד גף תחתון"
                })
            }
            if (this.state.quest5) {
                Questionnaires.push({
                    "QuestionnaireID": 5,
                    "QuestionnaireText": "איכות חיים"
                });
            }
            let id = this.props.user["UserID"];
            axios.post('http://localhost:8180/auth/usersAll/changeUserQuestionnaire',
                {
                    UserID: id,
                    Questionnaires: Questionnaires
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-auth-token': sessionStorage.getItem("token")
                    }
                }).then(res => {
                window.alert("השאלונים שונו בהצלחה");
                this.setState({
                    questionnairesArrDoctor: Questionnaires.map(q => q.QuestionnaireText),
                    showPopupQ: !this.state.showPopupQ
                });
            });
        }
    }

    changeQuest(){
        this.togglePopupQ();
    }

    changeDate(){
        this.togglePopup();
    }

    togglePopupQ() {
        this.setState({
            showPopupQ: !this.state.showPopupQ
        });

    }

    togglePopup() {
        this.setState({
            showPopup: !this.state.showPopup
        });
    }

    PopupQ() {
        require("../PatientData.css");
        return (
            <div className='popup'>
                <div className='popup_innerCQ' >
                    <div className="line_x">
                        <button onClick={this.togglePopupQ} id="x">x</button>
                    </div>
                    <h4 id="h4C">שינוי שאלונים</h4>
                    <form id="formQ" onSubmit={this.handleSubmitQ}>
                        <div className="line">
                            <input type="checkbox"
                                   className="cInput"
                                   name="quest2"
                                   checked={this.state.quest2}
                                   onChange={this.handleChange}
                            />
                            <label className="mLabel">
                                תפקוד גב תחתון
                            </label>
                        </div>
                        <div className="line">
                            <input type="checkbox"
                                   className="cInput"
                                   name="quest3"
                                   checked={this.state.quest3}
                                   onChange={this.handleChange}
                            />
                            <label className="mLabel">
                                תפקוד צוואר
                            </label>
                        </div>
                        <div className="line">
                            <input type="checkbox"
                                   className="cInput"
                                   name="quest4"
                                   checked={this.state.quest4}
                                   onChange={this.handleChange}
                            />
                            <label className="mLabel">
                                תפקוד גף תחתון
                            </label>
                        </div>
                        <div className="line">
                            <input type="checkbox"
                                   className="cInput"
                                   name="quest5"
                                   checked={this.state.quest5}
                                   onChange={this.handleChange}
                            />
                            <label className="mLabel">
                                איכות חיים
                            </label>
                        </div>
                        <button  id="changeQ" type="sumbit" >שינוי</button>
                    </form>
                </div>
            </div>
        );
    }


    render(){
        require("../Table.css");
        var first = true;
        if(this.props.user && this.state.firstTime) {
            for (var i = 0; i < this.props.user["Questionnaires"].length; i++) {
                if (this.props.user["Questionnaires"][i]["QuestionnaireID"] !== 0 && this.props.user["Questionnaires"][i]["QuestionnaireID"] !== 6) {
                    // if (!first) {
                    //     Questionnaires += ", "
                    // } else {
                    //     first = false;
                    // }
                    this.state.questionnairesArrDoctor.push(this.props.user["Questionnaires"][i]["QuestionnaireText"]);
                }
            }
            this.state.firstTime = false;
        }
        // if (Questionnaires.charAt(Questionnaires.length - 1) === " ") {
        //     Questionnaires = Questionnaires.substring(0, Questionnaires.length - 2);
        // }

        return(
            <div>
                {this.state.type === 'patient' ?
                    <div style={{alignRight: "auto", alignLeft: "auto", textWeight: "large"}}>
                        {/*<p style={{alignRight: "auto", alignLeft: "auto", textWeight: "large"}}>מטופל יקר, לפניך השאלונים המשוייכים אליך כחלק מטיפולך, אנא לחץ על השאלון המבוקש לצורך מענה.</p>*/}
                        <table id='customers' style={{alignRight: "auto", alignLeft: "auto", textWeight: "large"}}>
                            <thead style={{alignRight: "auto", alignLeft: "auto", textWeight: "large"}}>
                            <h6><b>מטופל יקר,</b></h6>
                            <h6><b>לפניך השאלונים המוגדרים כחלק מטיפולך. אנא לחץ על השאלון המבוקש לצורך מענה</b></h6>
                            <h6><b>תודה על שיתוף הפעולה!</b></h6>
                            </thead>
                            <tr style={{width: "50%" , textWeight: "large"}}>
                                {this.state.questionnairesArr.map(id => (
                                    <th  id = "mdd" scope="row" style={{width: "100%", textWeight: "large"  }} >
                                        <u>
                                            <Link to={`/userQuestionnaire/${id[0]}`} > {id[1]}
                                            </Link></u>
                                    </th>
                                ))}
                            </tr>
                        </table>
                        <br/>
                        <div >
                        </div>
                    </div> : this.state.type === 'doctor' && this.props.user ?
                        <div style={{alignRight: "auto", alignLeft: "auto", textWeight: "large"}}>
                            <thead style={{alignRight: "auto", alignLeft: "auto", textWeight: "large"}}>
                            <h4><b>לפניך השאלונים המותאמים למטופל הנ"ל:</b></h4>
                            </thead>
                            <table id='customers' style={{alignRight: "auto", alignLeft: "auto", textWeight: "large"}}>
                                <thead style={{alignRight: "auto", alignLeft: "auto", textWeight: "large"}}>
                                </thead>
                                <tr style={{width: "50%" , textWeight: "large"}}>
                                    {this.state.questionnairesArrDoctor.map(id => (
                                        <th  id = "mdd" scope="row" style={{width: "100%", textWeight: "large" }} >
                                           <a> {id}</a>
                                        </th>
                                    ))}
                                </tr>
                            </table>
                            {/*<label className="labelData" >{Questionnaires} </label>*/}
                            <button className="changeDate" onClick={() => this.changeQuest()}>
                                שינוי השאלונים
                            </button>

                        </div>: null}
                <div>
                    <img className={'imageBox'}
                         src={"https://image.freepik.com/free-photo/doctor-filling-up-life-insurance-form_53876-20493.jpg"}
                         style={{width: 450, borderColor: "black"}}></img>

                </div>
                {this.state.showPopupQ ?
                    this.PopupQ() : null
                }
            </div>
        );

    }

}

export default QuestionnaireManger;