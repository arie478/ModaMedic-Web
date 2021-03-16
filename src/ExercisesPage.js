import React, {Component} from "react"
import Table from "react-bootstrap/Table";
import 'bootstrap/dist/css/bootstrap.css'
import axios from "axios";
import YouTube from "react-youtube";
//
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from "@material-ui/core/GridListTileBar";
// import makeStyles from "@material-ui/core/styles/makeStyles";
import { makeStyles } from '@material-ui/core/styles';

class ExercisesPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            exercises: undefined,
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

        }

    }



    render() {
        // require("./ExercisesPage.css");
        let group = undefined;
        if (this.state.exercises) {
            group = this.state.exercises.reduce((r, a) => {
                r[a.Category] = [...r[a.Category] || [], a];
                return r;
            }, {});
        }
        const opts = {
            height: '300',
            width: '300',
            playerVars: {
                // https://developers.google.com/youtube/player_parameters
                autoplay: 0,
            },
        };
        return (
            <div>
                {group && Object.keys(group).map((keyName, keyIndex) => (
                        <div className="container">
                            <br/>
                            <br/>
                            <h2><b>תרגילי {keyName}</b></h2>
                            <div className="root">
                                {group[keyName].map(exercise =>
                                    <div style={{borderStyle: "double" , borderColoer: "black", float: "left"}}>
                                        {/*<GridList getColumnCount={2} spacing={1} className="gridList">*/}
                                            {/*<GridListTile cols={2}  rows={1}>*/}
                                            <YouTube className="video" videoId={exercise.Video} opts={opts} onReady={this._onReady}/>
                                            {/*</GridListTile>*/}
                                        {/*</GridList>*/}
                                    </div>
                                )}
                            </div>
                        </div>))}
            </div>
        )
    }
}

export default ExercisesPage;


