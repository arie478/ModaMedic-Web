import React, {Component} from "react"
import 'bootstrap/dist/css/bootstrap.css'
import axios from "axios";
import YouTube from "react-youtube";
//
// import makeStyles from "@material-ui/core/styles/makeStyles";
import Grid from "@material-ui/core/Grid";
import {GoMute} from "react-icons/all";

class ExercisesPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            exercises: undefined,
            exercisesGrid: undefined
        };
        this.getExercises = this.getExercises.bind(this);

    }

    componentDidMount() {
        this.getExercises();
    }

    async getExercises(){
        if (sessionStorage.getItem('patient')) {
            let respone = await axios.get('http://localhost:8180/auth/patients/exercises',
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
            }
            this.setState({exercisesGrid: exercisesForGrid})

        }

    }



    render() {
        require("./ExercisesPage.css");
        let group = undefined;
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
        return (
            <div>
                {group && Object.keys(group).map((keyName, keyIndex) => (
                    <div>
                        <div>
                            <Grid item xs={7} >
                                <div>
                                    <h2><b>תרגילי {keyName}</b></h2>
                                </div>
                            </Grid>
                            <Grid container spacing={3} style={{width: '100%', height:'100%'}} >
                                {/*<div class="wrapper">*/}
                                    {group[keyName].map(exercise => <Grid item xs={6} style={{width: '100%', height:'100%'}}>
                                            {/*<div style={{borderStyle: "double" , borderColoer: "black", float: "left"}}>*/}
                                            {/*<GridList getColumnCount={2} spacing={1} className="gridList">*/}
                                            {/*<GridListTile cols={2}  rows={1}>*/}
                                            <YouTube  videoId={exercise.Video} opts={opts} onReady={this._onReady}/>
                                        </Grid>
                                    )}
                                {/*</div>*/}
                            </Grid>
                            <hr style={{color: "darkgrey", backgroundColor: "darkgrey", height: 3}}/>
                        </div>
                    </div>))}
            </div>
        )
    }
}

export default ExercisesPage;


