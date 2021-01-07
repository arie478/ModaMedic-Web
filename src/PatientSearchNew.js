import React, {Component} from "react"
import axios from 'axios';
import DisplayButton from './DisplayButton';

class PatientSearchNew extends Component {


    constructor() {
        super();
        var date = new Date();
        var x = date.toISOString().split("T")[0];
        this.state = {
            end_date: x,
            start_date: "2020-01-01",
            steps: true,
            distance : true,
            weather: true,
            calories: true,
            sleeping_hours: true,
            dataArr: [],
            periodicAnswers: [],
            dailyA: [],
            dailyQ: true,
            perQ: true,
            date: 0,
            showDaily: true,
            weekly: false,
            monthly: false,
            user: {},
            ready: false,
            todayDate: x,
            className: "normal",
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.getRequest = this.getRequest.bind(this);
        this.selectUser = this.selectUser.bind(this);
    }

    handleChange(event) {
        const {name, value, type, checked} = event.target
        type === "checkbox" ? this.setState({ [name]: checked }) : this.setState({ [name]: value })
        if(name === "showDaily"){
            this.setState({
                showDaily: true,
                weekly: false,
                monthly: false
            })
        }
        else if(name === "weekly"){
            this.setState({
                showDaily: false,
                weekly: true,
                monthly: false
            })
        }
        else if(name === "monthly"){
            this.setState({
                showDaily: false,
                weekly: false,
                monthly: true
            })
        }
    }

    async getRequest(name,url){
        if(sessionStorage.getItem('doctor')){
            return this.getDoctorRequest(name, url);
        }
        if(sessionStorage.getItem('patient')){
            return this.getPatientRequest(name, url);
        }
        return null;
    }

    async getDoctorRequest(name, url) {
        if (this.props.patientUserId) {
            let getUrl = 'http://localhost:8180/auth/doctors/' + url + '?UserID=' + this.props.patientUserId;
            if (this.state.start_date !== "") {
                var date = new Date(this.state.start_date)
                let start_time = date.getTime();
                getUrl += ("&start_time=" + start_time);
            }
            if (this.state.end_date !== "") {
                date = new Date(this.state.end_date)
                date = new Date(date.getTime() + 86400000);
                let end_time = date.getTime();
                getUrl += ("&end_time=" + end_time);
            }
            const response = await axios.get(
                getUrl,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-auth-token': sessionStorage.getItem("token")
                    }
                }
            );
            if (response.data.message === "Not Found") {
                return null;
            }
            return ({
                values: response.data.data,
                name: name,
                numOfUsers: response.data.data.length
            });
        }
    }

    async getPatientRequest(name, url){
        let getUrl = `http://localhost:8180/auth/patients/${url}`;
        let start_time;
        if(this.state.start_date !== ""){
            var date = new Date(this.state.start_date);
            start_time = date.getTime();
            // getUrl += ("&start_time=" + start_time);
        }
        let end_time;
        if(this.state.end_date !== ""){
            date = new Date(this.state.end_date)
            date = new Date(date.getTime() + 86400000);
            end_time = date.getTime();
        }
        console.log(getUrl)
        const response = await axios.get(
            getUrl,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': sessionStorage.getItem("token")
                },
                params: {
                    start_time: start_time,
                    end_time: end_time
                }
            }
        );
        return({
            values: response.data.data,
            name : name,
            numOfUsers: response.data.data.length
        });
    }


    async selectUser(key) {
        let arr = this.state.dataArr;
        let d = this.state.dailyA;
        var da = [];
        var user;
        var sDate;
        for(var i = 0; i < this.state.numOfUsers; i++){
            if(d[i] && d[i].UserID["BirthDate"] === key){
                da = d[i].docs;
                sDate = d[i].UserID["DateOfSurgery"];
                user = d[i].UserID;
            }
        }
        for(i = 0; i < this.state.questionnaire.values.length; i++){
            if(this.state.questionnaire.values[i].UserID["BirthDate"] === key){
                this.state.periodicAnswers.push(this.state.questionnaire.values[i]["docs"]);
                sDate = this.state.questionnaire.values[i].UserID["DateOfSurgery"];
                user = this.state.questionnaire.values[i].UserID;
            }
        }
        for(i = 0; i < arr.length; i++){
            let values = [];
            if(arr[i]){
                for(var j = 0; j < arr[i].values.length; j++){
                    if(arr[i].values[j].UserID["BirthDate"] === key){
                        values = arr[i].values[j].docs;
                        sDate = arr[i].values[j].UserID["DateOfSurgery"];
                        user = arr[i].values[j].UserID;
                    }
                }
                arr[i].values = values;
            }
        }
        this.setState({
            dataArr: arr,
            dailyA: da,
            date: sDate,
            user: user,
            ready: true,
            className: "normal"
        });
    }

    async handleSubmit(event) {
        if(event){
            event.preventDefault()
        }

        this.setState({
            ready: false,
            className: "waiting",
            periodicAnswers: []
        });

        var numOfUsers = 0;
        var arr = [];
        let response = await this.getRequest("צעדים", "metrics/getSteps");
        if(!response){
            window.alert("לא קיים מטופל");
            return;
        }
        if(response.values[0]["docs"].length > 0){
            arr.push(response);
        }
        if(response.numOfUsers > numOfUsers){
            numOfUsers = response.numOfUsers;
        }
        response = await this.getRequest("מרחק", "metrics/getDistance");
        if(response.values[0]["docs"].length > 0){
            arr.push(response);
        }
        if(response.numOfUsers > numOfUsers){
            numOfUsers = response.numOfUsers;
        }
        response = await this.getRequest("קלוריות", "metrics/getCalories");
        if(response.values[0]["docs"].length > 0){
            arr.push(response);
        }
        if(response.numOfUsers > numOfUsers){
            numOfUsers = response.numOfUsers;
        }
        response = await this.getRequest("מזג האוויר", "metrics/getWeather");
        if(response.values[0]["docs"].length > 0){
            arr.push(response);
        }
        if(response.numOfUsers > numOfUsers){
            numOfUsers = response.numOfUsers;
        }
        response = await this.getRequest("שעות שינה", "metrics/getSleep");
        if(response.values[0]["docs"].length > 0){
            arr.push(response);
        }
        if(response.numOfUsers > numOfUsers){
            numOfUsers = response.numOfUsers;
        }
        response = await this.getRequest("תשובות יומיות", "answers/getDailyAnswers");
        if(response.numOfUsers > numOfUsers){
            numOfUsers = response.numOfUsers;
        }
        let responseQ = await this.getRequest("שאלון תקופתי", "answers/getPeriodicAnswers");

        this.setState({
            dataArr : arr,
            dailyA: response.values,
            numOfUsers: numOfUsers,
            questionnaire: responseQ
        });

        if(numOfUsers === 1) {
            let x = this.state.dailyA[0].UserID["BirthDate"];
            if(!x)
                x = this.state.periodicAnswers[0].UserID["BirthDate"];
            if(!x)
                x = this.state.dataArr[0][0].UserID["BirthDate"];
            this.selectUser(x)
        } else {
            alert("More than 1 user found!!!!!")
        }
    }

    render() {
        require("./search.css");
        var today = (new Date()).toISOString().split("T")[0];
        return (
            <div>
                <div className="dates">
                    <label className="cSearch">
                        בחר תאריכים: מ
                    </label>
                    <input className="dSearch"
                           type="date"
                           name="start_date"
                           value={this.state.start_date}
                           onChange={this.handleChange}
                           max={this.state.end_date}
                    />
                    <label className="aSearch">
                        עד
                    </label>
                    <input className="dSearch"
                           type="date"
                           name="end_date"
                           value={this.state.end_date}
                           onChange={this.handleChange}
                           max={today}
                    />
                </div>
                <div className="mdd">
                    <label className="mLabel">
                        בחר מדדים:
                    </label>
                    <input className="cInput"
                           type="checkbox"
                           name="steps"
                           checked={this.state.steps}
                           onChange={this.handleChange}
                    /> <p class="space"></p>
                    <label className="mLabel">
                        צעדים
                    </label>
                    <input className="cInput"
                           type="checkbox"
                           name="distance"
                           checked={this.state.distance}
                           onChange={this.handleChange}
                    />
                    <p className="space"></p>
                    <label className="mLabel">
                        מרחק
                    </label>
                    <input className="cInput"
                           type="checkbox"
                           name="weather"
                           checked={this.state.weather}
                           onChange={this.handleChange}
                    />
                    <p className="space"></p>
                    <label className="mLabel">
                        מזג האוויר
                    </label>
                    <input className="cInput"
                           type="checkbox"
                           name="calories"
                           checked={this.state.calories}
                           onChange={this.handleChange}
                    />
                    <p className="space"></p>
                    <label className="mLabel">
                        קלוריות
                    </label>
                    <input className="cInput"
                           type="checkbox"
                           name="sleeping_hours"
                           checked={this.state.sleeping_hours}
                           onChange={this.handleChange}
                    />
                    <p className="space"></p>
                    <label className="mLabel">
                        שעות שינה
                    </label>
                    <input className="cInput"
                           type="checkbox"
                           name="dailyQ"
                           checked={this.state.dailyQ}
                           onChange={this.handleChange}
                    />
                    <p className="space"></p>
                    <label className="mLabel">
                        שאלון יומי
                    </label>
                    <input className="cInput"
                           type="checkbox"
                           name="perQ"
                           checked={this.state.perQ}
                           onChange={this.handleChange}
                    />
                    <p className="space"></p>
                    <label className="mLabel">
                        שאלונים תקופתיים
                    </label>
                </div>
                <div className="mddShow">
                    <label className="mLabel">
                        בחר אופן הצגה:
                    </label>
                    <input className="cInput"
                           type="checkbox"
                           name="showDaily"
                           checked={this.state.showDaily}
                           onChange={this.handleChange}
                    />
                    <p className="space"></p>
                    <label className="mLabel">
                        יומי
                    </label>
                    <input className="cInput"
                           type="checkbox"
                           name="weekly"
                           checked={this.state.weekly}
                           onChange={this.handleChange}
                    />
                    <p className="space"></p>
                    <label className="mLabel">
                        שבועי
                    </label>
                    <input className="cInput"
                           type="checkbox"
                           name="monthly"
                           checked={this.state.monthly}
                           onChange={this.handleChange}
                    />
                    <p className="space"></p>
                    <label className="mLabel">
                        חודשי
                    </label>
                </div>
                <form onSubmit={this.handleSubmit}>
                    <button>הצג תוצאות</button>
                </form>
                <br />
                <DisplayButton
                    dataArr={this.state.dataArr}
                    steps={this.state.steps}
                    distance={this.state.distance}
                    calories={this.state.calories}
                    weather={this.state.weather}
                    sleep={this.state.sleeping_hours}
                    dailyA={this.state.dailyA}
                    periodicAnswers={this.state.periodicAnswers}
                    dailyQ={this.state.dailyQ}
                    perQ={this.state.perQ}
                    date={this.state.date}
                    showDaily={this.state.showDaily}
                    weekly={this.state.weekly}
                    monthly={this.state.monthly}
                    user={this.state.user}
                    ready={this.state.ready}
                />

            </div>
        )
    }
}

export default PatientSearchNew
