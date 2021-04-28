import React, {Component} from "react"
import axios from 'axios';
import DisplayButton from './DisplayButton';
import QuestionnaireManger from "./Questionnaire/QuestionnaireManger";

function findBMIGroup(bmi) {
    if (bmi>=0 && bmi<18.5) return "BMI 0-18.5";
    else if (bmi>=18.5 && bmi<25) return "BMI 18.5-25";
    else if (bmi>=25 && bmi<29.9) return "BMI 25-29.9";
    else if (bmi>=29.9 && bmi<40) return "BMI 29.9-40";
    else return "BMI 40+";
}

function findGenderGroup(gender) {
    if (gender=="נקבה") return "FemaleOnly";
    else return "MaleOnly";
}

function findSmokeGroup(smoke) {
    if (smoke=="מעשן") return "SmokeOnly";
    else return "NoSmokeOnly";
}


class PatientSearchNew extends Component {


    constructor() {
        super();
        var date = new Date();
        var first_date = new Date();
        first_date.setMonth(first_date.getMonth() - 3)
        var three_month = first_date.toISOString().split("T")[0];
        // var three_month = first_date.toLocaleDateString().replace('.', "-");
        console.log(three_month);
        var x = date.toISOString().split("T")[0];
        this.state = {
            end_date: x,
            start_date: three_month,
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
            comp:""
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.getRequest = this.getRequest.bind(this);
        this.selectUser = this.selectUser.bind(this);
        this.getCompereRequest = this.getCompereRequest.bind(this);
        this.compAfterRequests=this.compAfterRequests.bind(this);
        this.getStartAndEndTimeByInterval=this.getStartAndEndTimeByInterval.bind(this);
        this.findHowManyDaysAfter=this.findHowManyDaysAfter.bind(this);
    }

    handleChange(event) {
        const {name, value, type, checked} = event.target
        type === "checkbox" ? this.setState({ [name]: checked }) : this.setState({ [name]: value })
       if (name === "comp")  this.setState({ comp: value });
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
            let getUrl = 'https://moda-medic.herokuapp.com/auth/doctors/' + url + '?UserID=' + this.props.patientUserId;
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

    async getCompereRequest(name, url,gender,smoke,bmi,beforeOrAfter,interval,surgeryDate) {

            let getUrl = 'https://moda-medic.herokuapp.com/auth/doctors' + url + '?' ;
            let searchStartByInterval;
            let searchEndByInterval;
            let times=[];
        if (beforeOrAfter=="After")  {
            times =this.getStartAndEndTimeByInterval(surgeryDate,interval);
            searchStartByInterval=times[0];
            searchEndByInterval=times[1];
        }
            if (this.state.start_date !== "") {
                var date = new Date(this.state.start_date)
                let start_time = date.getTime();
                let searchStart= beforeOrAfter=="After"?searchStartByInterval :start_time;
                getUrl += ("&start_time=" + searchStart);
            }
            if (this.state.end_date !== "") {
                date = new Date(this.state.end_date)
                date = new Date(date.getTime() + 86400000);
                let end_time = date.getTime();
                let endSearch=beforeOrAfter=="After"? searchEndByInterval:surgeryDate;
                getUrl += ("&end_time=" + endSearch);
            }
            if (this.state.comp == "Gender") {
                getUrl += ("&filter=Gender" );
                let genderGroup=findGenderGroup(gender);
                getUrl += ("&groupId="+genderGroup+interval+beforeOrAfter );

            }
            else if (this.state.comp == "Smoke") {
                getUrl += ("&filter=Smoke" );
                let smokeGroup=findSmokeGroup(gender);
                getUrl += ("&groupId="+smokeGroup+interval+beforeOrAfter);

            }
            else if (this.state.comp == "BMI") {
                getUrl += ("&filter=BMI" );
                let bmiGroup=findBMIGroup(bmi);
                getUrl += ("&groupId="+ bmiGroup+" "+interval+beforeOrAfter);

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

    getStartAndEndTimeByInterval(surgeryDate,interval){
        let times=[];
        let ranges=this.findHowManyDaysAfter(interval);
        times.push(surgeryDate +ranges[0]*60*60*24*1000);
        times.push (surgeryDate+ ranges[1]*60*60*24*1000 );
        return times;
    }

    findHowManyDaysAfter(groupId) {
        let range=  groupId.substring(
            groupId.indexOf("/") + 1,
            groupId.lastIndexOf("/")
        );
        let min=range.substr(0,range.indexOf('-'));
        let max=range.substring(range.indexOf('-')+1);
        return [min,max];
    }

    async getPatientRequest(name, url){
        let getUrl = `https://moda-medic.herokuapp.com/auth/patients/${url}`;
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

    async compAfterRequests(gender,smoke,bmi,arr,interval,surgeryDate){
        let response = await this.getCompereRequest("השוואת קלוריות אחרי", "/comperePatients/getCaloriesCompere", gender, smoke, bmi, "After",interval,surgeryDate);
        if (response.values[0] != undefined && response.values[0]["docs"].length > 0) {
            arr.push(response);
        }

        response = await this.getCompereRequest("השוואת מרחק אחרי", "/comperePatients/getDistanceCompere", gender, smoke, bmi, "After",interval,surgeryDate);
        if (response.values[0] != undefined && response.values[0]["docs"].length > 0) {
            arr.push(response);
        }

        response = await this.getCompereRequest("השוואת צעדים אחרי", "/comperePatients/getStepsCompere", gender, smoke, bmi, "After",interval,surgeryDate);
        if (response.values[0] != undefined && response.values[0]["docs"].length > 0) {
            arr.push(response);
        }
        return arr;
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
            if(arr[i].name.startsWith("השוואת")) continue;
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
        if (event) {
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
        if (!response) {
            window.alert("לא קיים מטופל");
            return;
        }
        if (response.values[0]["docs"].length > 0) {
            arr.push(response);
        }
        if (response.numOfUsers > numOfUsers) {
            numOfUsers = response.numOfUsers;
        }
        response = await this.getRequest("מרחק", "metrics/getDistance");
        if (response.values[0]["docs"].length > 0) {
            arr.push(response);
        }
        if (response.numOfUsers > numOfUsers) {
            numOfUsers = response.numOfUsers;
        }


        if (response.values[0].UserID!=null && this.state.comp!==""){
            let gender = response.values[0].UserID.Gender;
            let bmi = parseFloat(response.values[0].UserID.BMI);
            let smoke = response.values[0].UserID.Smoke;
            let dateOfSurgery= response.values[0].UserID.DateOfSurgery;
           // **** before
        response = await this.getCompereRequest("השוואת קלוריות לפני", "/comperePatients/getCaloriesCompere", gender, smoke, bmi, "Before","",dateOfSurgery);
        if (response.values[0] != undefined && response.values[0]["docs"].length > 0) {
            arr.push(response);
        }

        response = await this.getCompereRequest("השוואת מרחק לפני", "/comperePatients/getDistanceCompere", gender, smoke, bmi, "Before","",dateOfSurgery);
        if (response.values[0] != undefined && response.values[0]["docs"].length > 0) {
            arr.push(response);
        }

        response = await this.getCompereRequest("השוואת צעדים לפני", "/comperePatients/getStepsCompere", gender, smoke, bmi, "Before","",dateOfSurgery);
        if (response.values[0] != undefined && response.values[0]["docs"].length > 0) {
            arr.push(response);
        }

            //****after


            let todayTimestamp = new Date().getTime();
            if (dateOfSurgery!= undefined && dateOfSurgery!=0 && dateOfSurgery< new Date(this.state.end_date).getTime()){
                let numOfDaysAfterSurgery= (todayTimestamp-dateOfSurgery)/(24*60*60*1000);
                let after5Days= true;
                let after5To10Days= numOfDaysAfterSurgery>=5? true:false;
                let after10To35Days= numOfDaysAfterSurgery>=10 ? true:false;
                let after35To90Days= numOfDaysAfterSurgery>=35 ? true:false;
                let after90To1800Days= numOfDaysAfterSurgery>=90 ? true:false;
                let after180Days= numOfDaysAfterSurgery>=180 ? true:false;


                arr=await this.compAfterRequests( gender, smoke, bmi, arr,"/0-5/",dateOfSurgery);
                if (after5To10Days)    arr= await this.compAfterRequests( gender, smoke, bmi, arr,"/5-10/",dateOfSurgery);
                if (after10To35Days)    arr= await this.compAfterRequests( gender, smoke, bmi, arr,"/10-35/",dateOfSurgery);
                if (after35To90Days)    arr= await this.compAfterRequests( gender, smoke, bmi, arr,"/35-90/",dateOfSurgery);
                if (after90To1800Days)   arr=await  this.compAfterRequests( gender, smoke, bmi, arr,"/90-180/",dateOfSurgery);
                if (after180Days)   arr=await this.compAfterRequests( gender, smoke, bmi, arr,"/180/",dateOfSurgery);

            }

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
                <div className="mddShow" style={sessionStorage.getItem('doctor') ? {} : { display: 'none' }} >
                    <label className="mLabel">
                        השוואת מטופלים לפי:
                    </label>
                    <input className="cInput"
                           type="radio"
                           name="comp"
                           value="Gender"
                           id="gender_comp"
                           onChange={this.handleChange}
                    />
                    <label htmlFor="gender_comp">מין</label>
                    <p className="space"></p>
                    <input className="cInput"
                           type="radio"
                           name="comp"
                           value="Smoke"
                           id="smoke_comp"
                           onChange={this.handleChange}
                    />
                    <label htmlFor="smoke_comp">מעשן/ לא מעשן</label>
                    <p className="space"></p>
                    <input className="cInput"
                           type="radio"
                           name="comp"
                           value="BMI"
                           id="BMI_comp"
                           onChange={this.handleChange}
                    />
                    <label htmlFor="BMI_comp">BMI</label>

                    <p className="space"></p>
                    <input className="cInput"
                           type="radio"
                           name="comp"
                           value=""
                           id="No_comp"
                           onChange={this.handleChange}
                        
                    />
                    <label htmlFor="No_comp">ללא השוואה</label>

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
                {/*<QuestionnaireManger user={this.state.user}*/}
                {/*/>*/}

            </div>
        )
    }
}

export default PatientSearchNew
