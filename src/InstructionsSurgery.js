import React, {Component} from "react"
import 'bootstrap/dist/css/bootstrap.css'
import axios from "axios";
import {Card} from "react-bootstrap";
// ES5 require
import ImageMapper from "react-image-mapper";
import CardMedia from "@material-ui/core/CardMedia";
import Grid from '@material-ui/core/Grid';
import {BsDownload} from "react-icons/bs";
import {AiFillDelete} from "react-icons/ai";
import Tooltip from "@material-ui/core/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Button from "react-bootstrap/Button";

var MAP = {
    name: "my-map",
    areas: [
        {
            name: "knee",
            shape: "circle",
            coords: [330, 300, 5],
            preFillColor: "#ff1313",
            fillColor: "white",
            lineWidth: 1
        },
        {
            name: "neck",
            shape: "circle",
            coords: [350, 80, 5],
            preFillColor: "#ff1313",
            fillColor: "white",
            lineWidth: 1
        },
        {
            name: "back",
            shape: "circle",
            coords: [350, 170, 5],
            preFillColor: "#ff1313",
            fillColor: "white",
            lineWidth: 1
        },   {
            name: "shoulder",
            shape: "circle",
            coords: [310, 95, 5],
            preFillColor: "#ff1313",
            fillColor: "white",
            lineWidth: 1
        }, {
            name: "elbow",
            shape: "circle",
            coords: [255, 105, 5],
            preFillColor: "#ff1313",
            fillColor: "white",
            lineWidth: 1
        },{
            name: "ankle",
            shape: "circle",
            coords: [333, 382, 5],
            preFillColor: "#ff1313",
            fillColor: "white",
            lineWidth: 1
        },{
            name: "hip",
            shape: "circle",
            coords: [325, 200, 5],
            preFillColor: "#ff1313",
            fillColor: "white",
            lineWidth: 1
        }
    ]
};

// var URL = "https://cdn1.bbcode0.com/uploads/2021/3/12/44020e8f94bb6f1e1f5daefa99e5dbbd-full.jpg?__cf_chl_jschl_tk__=44f056c180321e3187e8e785fe9ebc8efea1a510-1615559897-0-AYcqoygPVQpfg88iWu4Xkb0s-sdo06kYRqVG_irUgjBbap22wgX3WGpiolYjKZ3M4cms0fNzEtJkKjy8vSgtWGXTBQYx1CVPQ2HdxLMw9kux4rfv_r3r6T7CHIQoP_1_g4WcuKAshfV-kpDefRb0Wq5IJzkr4_kg8jrupQA9PqkYDX7dGPNljLT11XxebURRt3Kkohj-Np1vmDnT8mg6laQlgLDEMHr-pWkZTODWrUDrvgjg0bOGM0XMBW21Rj4Jw7jaLYMEiCltPIKFGBj4fCjzi8ebMV6rnbLSE-uEa4OA7AzwnoZrbXOyWDOWPVYor3OFFCKQ9KS59WnIaaJ2gAAzKKPiux-8kKJIJAmXRvVze9NcyC7hFUtki1qJCiACjeh0OQBH-tR_yzk4yO3QlKk";
var URL = "https://modernorthonj.com/wp-content/uploads/2020/03/body-schematic-transparent-2048x1257.jpg"

class InstructionsSurgery extends Component {
    constructor(props) {
        super(props);
        // pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
        this.state = {
            instructions: undefined,
            instructionsForGrid: [],
            // numPages: null,
            // pageNumber: 1,

            headerNames: {
                "knee": "פרוטוקולי שיקום - ברך",
                "shoulder": "פרוטוקולי שיקום - כתף",
                "hip" : "פרוטוקולי שיקום - ירך",
                "ankle" : "פרוטוקולי שיקום - קרסול",
                "elbow" : "פרוטוקולי שיקום - מרפק",
                "back" : "פרוטוקולי שיקום - גב",
                "neck" : "פרוטוקולי שיקום - צוואר"
            },
            categoryToImage: {
                "knee": require('./ImagesOrth/ACL.jpg'),
                "shoulder": require('./ImagesOrth/REVERSETSR.jpg'),
                "hip" : require('./ImagesOrth/Hip.png'),
                "ankle" : require('./ImagesOrth/Ankle.jpg'),
                "elbow" : require('./ImagesOrth/Elbow.jpg'),
                "back" : require('./ImagesOrth/Back.jpg'),
                "neck" : require('./ImagesOrth/Neck.jpg'),
            },

            instructionsByCategory: {},
            showInstructions: false,
            showPopup: false,
            selectedFile: null,
            newInstructionCategory: "knee",
            newInstructionTitle: "",
            categories: {
                "ברך": "knee",
                "גב": "back",
                "כתף": "shoulder",
                "ירך": "hip",
                "קרסול":  "ankle",
                "מרפק":"elbow",
                "צוואר": "neck"
            },
            area:undefined
        };

        this.getInstructions = this.getInstructions.bind(this);
        this.changePdfToShow = this.changePdfToShow.bind(this);
        // this.nextPage = this.nextPage.bind(this);
        // this.previousPage = this.previousPage.bind(this);
        this.getInitialState = this.getInitialState.bind(this);
        this.load = this.load.bind(this);
        this.clicked = this.clicked.bind(this);
        this.clickedOutside = this.clickedOutside.bind(this);
        this.moveOnImage = this.moveOnImage.bind(this);
        this.enterArea = this.enterArea.bind(this);
        this.leaveArea = this.leaveArea.bind(this);
        this.moveOnArea = this.moveOnArea.bind(this);
        this.getTipPosition = this.getTipPosition.bind(this);
        this.togglePopup = this.togglePopup.bind(this);
        this.selectFile = this.selectFile.bind(this);
        this.upload = this.upload.bind(this);
        this.uploadFile = this.uploadFile.bind(this);
        this.onSelectCategoryChosen =  this.onSelectCategoryChosen.bind(this)
        this.handleChange =  this.handleChange.bind(this)
        this.handleSubmit =  this.handleSubmit.bind(this)

    }

    getInitialState() {
        return {hoveredArea: null, msg: null, moveMsg: null};
    }

    load() {
        // this.setState({msg: "Interact with image !"});
    }

    clicked(area) {
        if(area.name === this.state.category) {
            this.setState({
                showInstructions: !this.state.showInstructions,
                category: ""
            });
        } else {
            this.setState({
                // msg: `You clicked on ${area.shape} at coords ${JSON.stringify(
                //     area.coords
                // )} !`,
                category: area.name,
                showInstructions: true,
            }, this.focusOnInstructions);
        }
    }

    focusOnInstructions() {
        if(this.state.showInstructions) {
            var elmnt = document.getElementById("inst");
            elmnt.scrollIntoView();
        }
    }

    clickedOutside(evt) {
        const coords = {x: evt.nativeEvent.layerX, y: evt.nativeEvent.layerY};
        this.setState({
            msg: `You clicked on the image at coords ${JSON.stringify(coords)} !`
        });
    }

    moveOnImage(evt) {
        const coords = {x: evt.nativeEvent.layerX, y: evt.nativeEvent.layerY};
        this.setState({
            moveMsg: ` `
        });
    }

    enterArea(area) {
        this.setState({
            hoveredArea: area,
            msg: `You entered ${area.shape} ${area.name} at coords ${JSON.stringify(
                area.coords
            )} !`
        });
    }

    leaveArea(area) {
        this.setState({
            hoveredArea: null,
            // msg: '',
            // moveMsg: ''
        });
    }

    moveOnArea(area, evt) {
        const coords = {x: evt.nativeEvent.layerX, y: evt.nativeEvent.layerY};
        this.setState({
            moveMsg: ' לחץ להצגת ' + this.state.headerNames[`${area.name}`],
            currArea: area,
            hoveredArea: area
        });
    }

    getTipPosition(area) {
        return {top: `${area.center[1]}px`, left: `${area.center[0]}px`};
    }


    componentDidMount() {
        this.getInstructions();
    }


    async getInstructions() {
        let respone = await axios.get(' https://icc.ise.bgu.ac.il/njsw18auth/usersAll/instructions',
            {
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': sessionStorage.getItem("token")
                }
            });
        if (respone.data.data) {
            let instructionsArr = [];
            for (var i = 0; i < respone.data.data.length; i++) {
                instructionsArr.push(respone.data.data[i]);
            }
            let instructionsForGrid = [];
            for (var i = 0; i < instructionsArr.length; i = i + 2) {
                if (instructionsArr[i + 1]) {
                    instructionsForGrid.push({"obj1": instructionsArr[i], "obj2": instructionsArr[i + 1]});
                } else {
                    instructionsForGrid.push({"obj1": instructionsArr[i], "obj2": {}});
                }
            }
            this.setState({
                instructions: instructionsArr,
                instructionsForGrid: instructionsForGrid,
                instructionsByCategory: this.groupArrayOfObjects(instructionsArr, "Category")
            });
        }

    }

    groupArrayOfObjects(list, key) {
        return list.reduce(function (rv, x) {
            (rv[x[key]] = rv[x[key]] || []).push(x);
            return rv;
        }, {});
    };

    changePdfToShow(e) {
        console.log(e);
        if (this.state.pdfToShow === e) {
            this.setState({pdfToShow: null})
        } else {
            this.setState({pdfToShow: e, showPopup: true});
        }
    }

    togglePopup() {
        this.setState({
            showPopup: !this.state.showPopup
        });
    }

    onSelectCategoryChosen(event) {
        let value = this.state.categories[event.target.options[event.target.options.selectedIndex].label];
        this.setState({
            newInstructionCategory: value
        });
        // console.log(this.state.categories[event.target.options.selectedIndex])
    }
    // On file select (from the pop up)
    onFileChange = event => {

        // Update the state
        this.setState({ selectedFile: event.target.files[0] });

    };

    downloadFile = (instruction) => {
        axios({
            url: `https://icc.ise.bgu.ac.il/njsw18auth/usersAll/instructions/${instruction.InstructionId}`,
            method: 'GET',
            responseType: 'blob', // important
            headers: {
                'x-auth-token': sessionStorage.getItem("token")
            }
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${instruction.Title}.pdf`); //or any other extension
            document.body.appendChild(link);
            link.click();
        });
    };

    uploadFile(category, title, file, onUploadProgress) {
        let formData = new FormData();
        formData.append("Category", category);
        formData.append("Title", title);
        formData.append("pdf", file);
        return axios.post("https://icc.ise.bgu.ac.il/njsw18auth/doctors/instructions", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                'x-auth-token': sessionStorage.getItem("token")
            },
            onUploadProgress,
        });
    }

    selectFile(event) {
        this.setState({
            selectedFiles: event.target.files,
        });
    }

    upload() {
        let currentFile = this.state.selectedFiles[0];
        this.setState({
            progress: 0,
            currentFile: currentFile,
        });

        this.uploadFile(this.state.newInstructionCategory, this.state.newInstructionTitle, currentFile, (event) => {
            this.setState({
                progress: Math.round((100 * event.loaded) / event.total),
            });
        })
            .then((response) => {
                this.setState({
                        message: response.data.message,
                    }
                );
                window.alert("פרוטוקול הועלה בהצלחה!")
                this.setState({newInstructionTitle : '',  progress: 0, currentFile: undefined, selectedFiles:undefined});
                this.getInstructions();
            })
            .catch(() => {
                this.setState({
                    progress: 0,
                    message: "Could not upload the file!",
                    currentFile: undefined,
                    selectedFiles: undefined
                });
            });

        this.setState({
            selectedFiles: undefined,
        });
    }

    // On file upload (click the upload button)
    onFileUpload = () => {
        // Create an object of formData
        const formData = new FormData();
        // Update the formData object
        formData.append(
            "myFile",
            this.state.selectedFile,
            this.state.selectedFile.name
        );

        // Details of the uploaded file
        console.log(this.state.selectedFile);
        // Request made to the backend api
        // Send formData object
        // axios.post("api/uploadfile", formData);
    };

    // File content to be displayed after
    // file upload is complete
    fileData = () => {
        if (this.state.selectedFile) {
            return (
                <div>
                    <h2>File Details:</h2>
                    <p>File Name: {this.state.selectedFile.name}</p>
                    <p>File Type: {this.state.selectedFile.type}</p>
                </div>
            );
        } else {
            return (
                <div>
                    <br />
                    <h4>Choose before Pressing the Upload button</h4>
                </div>
            );
        }
    };

    async removeInstruction(eId){
        if(sessionStorage.getItem('doctor')) {
            const r = window.confirm("האם אתה בטוח שאתה רוצה למחוק את הפרוטוקול?");
            if (r) {
                await axios.delete(` https://icc.ise.bgu.ac.il/njsw18auth/doctors/instructions/${eId}`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'x-auth-token': sessionStorage.getItem("token")
                        }
                    });
                this.getInstructions()
            }
        }
    }
    handleChange(e) {
        if (e.target.name === "newInstructionTitle") {
            this.setState({[e.target.name]: e.target.value})}
    }

    handleSubmit(event) {
        event.preventDefault();
        this.upload();
    }

    renderUploadFile() {
        const {
            selectedFiles,
            currentFile,
            progress,
            message,
        } = this.state;
        let optionItems = Object.keys(this.state.categories).map((category) =>
            <option key={category} >{category}</option>
        );
        return <div>
            <form onSubmit={this.handleSubmit}>
                <div className="divs_in_add_pdf">
                    <label className="labels_in_add_instructions">כותרת הפרוטוקול: </label>
                    <input className="inputs_in_add_instructions" name="newInstructionTitle" type="text"
                           value={this.state.newInstructionTitle} onChange={e => this.handleChange(e)} required/>
                </div>
                <div className="divs_in_add_pdf">
                    <label className="labels_in_add_instructions">קטגוריית הפרוטוקול:    </label>
                    <select  className="select_in_add_instructions" onChange={this.onSelectCategoryChosen} required>
                        {optionItems}
                    </select>
                </div>
                <br/>
                <br/>
                {currentFile && (
                    <div className="progress">
                        <div
                            className="progress-bar progress-bar-info progress-bar-striped"
                            role="progressbar"
                            aria-valuenow={progress}
                            aria-valuemin="0"
                            aria-valuemax="100"
                            style={{ width: progress + "%" }}
                        >
                            {progress}%
                        </div>
                    </div>
                )}
                <br/>
                <br/>
                <label className="btn btn-default">
                    <input type="file" onChange={this.selectFile} />
                </label>
                <button className="btn btn-primary"
                        disabled={!selectedFiles}
                        type={"submit"}
                >
                    העלאת הפרוטוקל
                </button>
                <div className="alert alert-light" role="alert">
                    {message}
                </div>
            </form>
        </div>
    }

    render() {
        // const { pageNumber, numPages } = this.state;
        // require("./MessagesPage.css");

        require("./InstructionsSurgery.css");
        return (
            <div className="presenter">
                <Grid container spacing={2} >
                    <Grid item xs={6} >
                        <br/>
                        {sessionStorage.getItem('patient') &&
                        <img style={{width: '100%', marginLeft:"auto"}} src={require('./ImagesOrth/INSTRUCTIONS.PNG')} />}
                        {sessionStorage.getItem('doctor') && this.renderUploadFile()}
                    </Grid>
                    <Grid item xs={6} >
                        <div>
                            <pre className="message">{this.state.msg ? this.state.msg : null}</pre>
                            <pre>{this.state.moveMsg ? this.state.moveMsg : null}</pre>
                            <div style={{ width: '100%', position: "relative"}}>
                                <ImageMapper
                                    src={URL}
                                    map={MAP}
                                    width={700}
                                    // height={700}
                                    onLoad={() => this.load()}
                                    onClick={area => this.clicked(area)}
                                    // onMouseEnter={area => this.enterArea(area)}
                                    // onMouseLeave={area => this.leaveArea(area)}
                                    onMouseMove={(area, _, evt) => this.moveOnArea(area, evt)}
                                    // onImageClick={evt => this.clickedOutside(evt)}
                                    onImageMouseMove={evt => this.moveOnImage(evt)}
                                    lineWidth={4}
                                    strokeColor={"white"}
                                />
                                {this.state.hoveredArea && (
                                    <span
                                        className="tooltip"
                                        style={{...this.getTipPosition(this.state.hoveredArea)}}
                                    >
								{this.state.hoveredArea && this.state.hoveredArea.name}
							</span>
                                )}
                            </div>

                        </div>
                    </Grid>
                </Grid>
                <div id="inst">
                    <br/>
                    <br/>
                    <br/>
                    <h2 className="insth2">{this.state.headerNames[this.state.category]}</h2>
                </div>
                <div >
                    {this.state.category && !this.state.instructionsByCategory[this.state.category] && <div><h3>אין פרוטוקולים בתחום זה</h3></div>}
                    <Grid container spacing={2} >
                        {this.state.showInstructions && this.state.instructionsByCategory[this.state.category] &&
                        this.state.instructionsByCategory[this.state.category].map((instruction) => {
                            return <Grid item xs={5} style={{marginLeft:50}}>
                                <Card id="cardInstruction">
                                    <CardMedia
                                        component="img"
                                        alt="Contemplative Reptile"
                                        height="200"
                                        image={this.state.categoryToImage[instruction.Category]}
                                        title="Contemplative Reptile"
                                        style={{borderColor: 'black'}}
                                    />
                                    <Card.Header>
                                        <button onClick={() => this.downloadFile(instruction)}>
                                            <b>{instruction.Title}</b>
                                            <BsDownload style={{float:'left'}}/>
                                        </button>
                                    </Card.Header>
                                </Card>
                                {sessionStorage.getItem('doctor') &&
                                <AiFillDelete type="button" class="trushIcon" style={{color: 'black'}} size={20}
                                              onClick={() => this.removeInstruction(instruction.InstructionId)}/>
                                }
                            </Grid>
                        })
                        }
                    </Grid>
                </div>
            </div>)

    }
}

export default InstructionsSurgery;

