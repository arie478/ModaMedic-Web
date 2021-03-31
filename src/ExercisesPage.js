import React, {Component} from "react"
import 'bootstrap/dist/css/bootstrap.css'
import axios from "axios";
import YouTube from "react-youtube";
//
// import makeStyles from "@material-ui/core/styles/makeStyles";
import Grid from "@material-ui/core/Grid";
import {AiFillDelete} from "react-icons/ai";

class ExercisesPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            exercises: undefined,
            exercisesGrid: undefined,
            newExerciseUrl: '',
            newExerciseCategory: 'ברך',
            categories: ['ברך','גב','כתף','קרסול','ירך','מרפק','גב']};
        this.getExercises = this.getExercises.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onSelectCategoryChosen = this.onSelectCategoryChosen.bind(this);
    }

    componentDidMount() {
        this.getExercises();
    }

    async getExercises(){
        let respone = await axios.get(' https://moda-medic.herokuapp.com/auth/usersAll/exercises',
            {
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': sessionStorage.getItem("token")
                },
            });
        this.setState({exercises: respone.data.data})

        let exercisesForGrid = [];
        for (var i = 0; i < this.state.exercises.length; i = i + 2) {
            if (this.state.exercises[i + 1]) {
                exercisesForGrid.push({"obj1": this.state.exercises[i], "obj2": this.state.exercises[i + 1]});
            } else {
                exercisesForGrid.push({"obj1": this.state.exercises[i], "obj2": {}});
            }
            // }
            this.setState({exercisesGrid: exercisesForGrid})
        }
    }

    handleSubmit(e){
        e.preventDefault();
        this.addExercise();
        this.setState({newExerciseUrl : ''})
        this.getExercises()
        // if(response.data.data === null){
        //     window.alert('אנא מלא את הטופס כראוי')
        // }
    }

     addExercise(){
        const urlExe = new URL(this.state.newExerciseUrl);
        var urlId = urlExe.searchParams.get('v');
        for(var i=0; i<this.state.exercises.length; i++){
            if (this.state.exercises[i].Video === urlId){
                window.alert('הסרטון כבר קיים במאגר');
                this.setState({newExerciseUrl : ''})
                return;
            }
        }
        let url = ` https://moda-medic.herokuapp.com/auth/doctors/exercises`;
        axios.post(url,
            {
                category: this.state.newExerciseCategory,
                url : urlId
            },{
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': sessionStorage.getItem("token")
                }});
        window.alert("הסרטון נוסף בהצלחה!")
         this.getExercises()
     }
    handleChange(e) {
        if (e.target.name === "newExerciseUrl") {
            this.setState({[e.target.name]: e.target.value})}
    }

    onSelectCategoryChosen(event) {
        this.setState({
            newExerciseCategory  : this.state.categories[event.target.options.selectedIndex]
        });
    }

    async removeExercise(eId){
        if(sessionStorage.getItem('doctor')) {
            const r = window.confirm("האם אתה בטוח שאתה רוצה למחוק את הסרטון?");
            if (r == true) {
                await axios.delete(` https://moda-medic.herokuapp.com/auth/doctors/exercises/removeExercise/${eId}`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'x-auth-token': sessionStorage.getItem("token")
                        }
                    });
                this.getExercises()
            }
        }
    }

    render(){
        require("./ExercisesPage.css");
        let group = undefined;
        var forPatient = "מטופל/ת יקר/ה!\nלפניך מאגר תרגולי פיזיותרפיה המחולקים לקטגוריות.\nשים לב! יש להתייעץ עם הרופא המטפל לפני ביצוע התרגולים הביתיים.\n החלמה מהירה ובריאות שלמה!"
        if (this.state.exercises) {
            group = this.state.exercises.reduce((r, a) => {
                r[a.Category] = [...r[a.Category] || [], a];
                return r;
            }, {});
        }
        const opts = {
            height: '350',
            width: '400',
            playerVars: {
                // https://developers.google.com/youtube/player_parameters
                autoplay: 0,
            },
        };
        let optionItems = this.state.categories.map((category) =>
            <option key={category} >{category}</option>
        );
        return (
            <div>
                {sessionStorage.getItem('doctor') && <div>
                    <form onSubmit={this.handleSubmit}>
                        <div className="divs_in_add">
                            <h5>מטפל/ת יקר/ה,</h5>
                            <h5>על מנת להוסיף סרטון למאגר, אנא העתק את קישור ה-Youtube לחלון הנכון ובחר את האיבר השייך לטיפול בסרטון זה.</h5>
                            <h5>על מנת למחוק סרטון, יש ללחוץ על כפתור המחיקה תחת הסרטון הרלוונטי.</h5>
                            <label className="labels_in_add_user">כתובת הסרטון:</label>
                            <input className="inputs_in_add_user" name="newExerciseUrl" type="url"
                                   value={this.state.newExerciseUrl} onChange={e => this.handleChange(e)} required/>
                        </div>
                        <div className="divs_in_add">
                            <label className="labels_in_add_user">קטגוריית הסרטון: </label>
                            <select className="select_in_add_user" onChange={this.onSelectCategoryChosen}>
                                {optionItems}
                            </select>
                        </div>
                        <div className="divs_in_add">
                            <input type="submit" value="הוסף" className="submit_and_reset_buttons"/>
                        </div>
                    </form>
                </div>}
                {sessionStorage.getItem('patient') && <div>
                    <a><b>מטופל/ת יקר/ה!</b></a><br/>
                    <a><b>לפניך מאגר תרגולי פיזיותרפיה המחולקים לקטגוריות.</b></a><br/>
                    <a><b>שים לב! יש להתייעץ עם הרופא המטפל לפני ביצוע התרגולים הביתיים.</b></a><br/>
                    <a><b>החלמה מהירה ובריאות שלמה!</b></a>
                </div>}

                <hr style={{color: "darkgrey", backgroundColor: "darkgrey", height: 3}}/>
                {group && Object.keys(group).map((keyName, keyIndex) => (
                    <div>
                        <div>
                            <Grid item xs={7} >
                                <div>
                                    <h2 className="exh2"><b>תרגילי {keyName}</b></h2>
                                </div>
                            </Grid>
                            <Grid container spacing={3} style={{width: '100%', height:'100%'}} >
                                {group[keyName].map(exercise => <Grid item xs={6} style={{width: '100%', height:'100%'}}>
                                        <YouTube  videoId={exercise.Video} opts={opts} onReady={this._onReady}/>
                                        {sessionStorage.getItem('doctor') &&
                                        <AiFillDelete type="button" class="trushIcon" style={{color: 'black'}} size={20}
                                                      onClick={() => this.removeExercise(exercise.ExerciseId)}/>
                                        }
                                    </Grid>
                                )}
                            </Grid>
                            <hr style={{color: "darkgrey", backgroundColor: "darkgrey", height: 3}}/>
                        </div>
                    </div>))}

            </div>
        )
    }
}

export default ExercisesPage;


