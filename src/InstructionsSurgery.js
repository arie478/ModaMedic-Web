import React, {Component} from "react"
import 'bootstrap/dist/css/bootstrap.css'
import axios from "axios";
import {Card} from "react-bootstrap";
// ES5 require
import ImageMapper from "react-image-mapper";
import CardMedia from "@material-ui/core/CardMedia";
import {Document, Page, pdfjs} from 'react-pdf';
import ACL from "./prtocols/ACL.pdf";
import ASD from "./prtocols/ASD.pdf";
import BANKART from "./prtocols/BANKART.pdf";
import KNEE from "./prtocols/KNEE.pdf";
import REVERSE_TSR from "./prtocols/REVERSE_TSR.pdf";
import ROTATORCUFF from "./prtocols/ROTATORCUFF.pdf";
import FIRST from "./prtocols/FIRST.pdf";
import Grid from '@material-ui/core/Grid';
import {BsDownload} from "react-icons/bs";

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
            name: "shoulder",
            shape: "circle",
            coords: [310, 95, 5],
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
            // pdfNames:{"ACL": ACL,ASD,BANKART,KNEE,REVERSE_TSR,ROTATORCUFF]}
            pdfNames: {
                "ACL": ACL,
                "KNEE": KNEE,
                "ASD": ASD,
                "BANKART": BANKART,
                "REVERSE_TSR": REVERSE_TSR,
                "ROTATORCUFF": ROTATORCUFF,
                "FIRST": FIRST
            },
            headerNames: {
                "knee": "פרוטוקולי שיקום - ברך",
                "shoulder": "פרוטוקולי שיקום - כתף"
            },
            instructionsByCategory: {},
            showInstructions: false,
            showPopup: false
        }
        ;

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
            moveMsg: `You moved on the image at coords ${JSON.stringify(coords)} !`
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
            msg: `You leaved ${area.shape} ${area.name} at coords ${JSON.stringify(
                area.coords
            )} !`
        });
    }

    moveOnArea(area, evt) {
        const coords = {x: evt.nativeEvent.layerX, y: evt.nativeEvent.layerY};
        this.setState({
            moveMsg: `You moved on ${area.shape} ${
                area.name
            } at coords ${JSON.stringify(coords)} !`
        });
    }

    getTipPosition(area) {
        return {top: `${area.center[1]}px`, left: `${area.center[0]}px`};
    }


    componentDidMount() {
        this.getInstructions();
    }


    async getInstructions() {
        if (sessionStorage.getItem('patient')) {
            let respone = await axios.get('http://localhost:8180/auth/patients/instructions/',
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

    render() {
        // const { pageNumber, numPages } = this.state;
        // require("./MessagesPage.css");
        require("./InstructionsSurgery.css");
        return (
            <div className="presenter">
                <Grid container spacing={2} >
                    <Grid item xs={6} >
                        <br/>
                        <img style={{width: 500, marginLeft:"auto"}} src={require('./ImagesOrth/instuctions info.PNG')} />
                    </Grid>
                    <Grid item xs={6} >
                        <div>
                            <div style={{position: "relative"}}>
                                <ImageMapper
                                    src={URL}
                                    map={MAP}
                                    width={700}
                                    // height={700}
                                    onLoad={() => this.load()}
                                    onClick={area => this.clicked(area)}
                                    // onMouseEnter={area => this.enterArea(area)}
                                    // onMouseLeave={area => this.leaveArea(area)}
                                    // onMouseMove={(area, _, evt) => this.moveOnArea(area, evt)}
                                    // onImageClick={evt => this.clickedOutside(evt)}
                                    // onImageMouseMove={evt => this.moveOnImage(evt)}
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
                            <pre className="message">{this.state.msg ? this.state.msg : null}</pre>
                            <pre>{this.state.moveMsg ? this.state.moveMsg : null}</pre>
                        </div>
                    </Grid>
                </Grid>
                {/*{this.state.pdfToShow &&*/}
                {/*<div>*/}
                {/*    <PDF pdfFile={this.state.pdfNames[this.state.pdfToShow]}/>*/}
                {/*</div>*/}
                {/*<Grid item xs={6}>*/}
                {/*    {this.state.pdfToShow &&*/}
                {/*    <div>*/}
                {/*        <PDF pdfFile={this.state.pdfNames[this.state.pdfToShow]}/>*/}
                {/*    </div>}*/}
                {/*</Grid>*/}
                {/*<Grid item xs={6}>*/}

                {/*</Grid>*/}
                <div id="inst">
                    <br/>
                    <br/>
                    <br/>
                    <h2 style={{width: 500, height:50}}>{this.state.headerNames[this.state.category]}</h2>
                </div>
                <div >
                    <Grid container spacing={2} >
                        {this.state.showInstructions && this.state.instructionsByCategory[this.state.category] &&
                        this.state.instructionsByCategory[this.state.category].map((instruction) => {
                            return <Grid item xs={5} style={{marginLeft:50}}>
                                <Card>
                                    <CardMedia
                                        component="img"
                                        alt="Contemplative Reptile"
                                        height="200"
                                        image={instruction.ImagePart}
                                        title="Contemplative Reptile"
                                        // onClick={() =>this.changePdfToShow(instruction.PdfName)}
                                    />
                                    <Card.Header>
                                        <button onClick={() => this.changePdfToShow(instruction.PdfName)}>
                                                <a href={this.state.pdfNames[this.state.pdfToShow]} download={instruction.PdfName}>
                                                    <b>  {instruction.Title}  </b>
                                                    <BsDownload></BsDownload>
                                                </a>
                                        </button>

                                    </Card.Header>
                                </Card>
                            </Grid>
                        })
                        }
                    </Grid>
                </div>
            </div>)

    }
}

export default InstructionsSurgery;

class PDF extends Component {

    constructor(props) {
        super(props);
        pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
        this.state = {
            numPages: null,
            pageNumber: 1,
        };

        this.nextPage = this.nextPage.bind(this);
        this.previousPage = this.previousPage.bind(this);

    }

    onDocumentLoad = ({ numPages }) => {
        this.setState({ numPages });
    };

    previousPage() {
        this.setState({pageNumber: this.state.pageNumber - 1});
    }

    nextPage() {
        this.setState({pageNumber: this.state.pageNumber + 1});
    }

    render() {
        require("./Pdf.css");

        return <div>
            <Document file={this.props.pdfFile} onLoadSuccess={this.onDocumentLoad} options={{ workerSrc: "/pdf.worker.js" }}>
                <Page pageNumber={this.state.pageNumber} />
            </Document>
            <p>Page {this.state.pageNumber} of {this.state.numPages}</p>
            <button class="nextprv" type="button" disabled={this.state.pageNumber <= 1} onClick={this.previousPage}>
                Previous
            </button>
            <button class="nextprv"
                    type="button"
                    disabled={this.state.pageNumber >= this.state.numPages}
                    onClick={this.nextPage}
            >
                Next
            </button>
        </div>
    }
}

