import React, {Component} from "react"
import Table from "react-bootstrap/Table";
import 'bootstrap/dist/css/bootstrap.css'
import axios from "axios";
import {Card} from "react-bootstrap";
import Accordion from "react-bootstrap/Accordion";
import ListGroup from "react-bootstrap/ListGroup";
import ReactPlayer from 'react-player'
import YouTube from "react-youtube";
// ES5 require
import ImageMapper from "react-image-mapper";
import {AiOutlinePlusCircle} from "react-icons/all";

class InstructionsSurgery extends Component {

    constructor(props) {
        super(props);
        this.state = {
            instructions: undefined,
        };

        this.getInstructions = this.getInstructions.bind(this);

    }

    componentDidMount() {
        this.getInstructions();
    }

    async getInstructions(){
        if (sessionStorage.getItem('patient')) {
            let respone = await axios.get('http://localhost:8180/auth/patients/instructions/preoperative_clinic_orthopedic_before',
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-auth-token': sessionStorage.getItem("token")
                    }
                });
            this.setState({instructions: respone.data.data})
        }
    }
    enterArea(area) {
        this.setState({ hoveredArea: area });
    }

    leaveArea(area) {
        this.setState({ hoveredArea: null });
    }

    getTipPosition(area) {
        return { top: `${area.center[1]}px`, left: `${area.center[0]}px` };
    }



    render() {
        require("./MessagesPage.css");
        URL = "https://modernorthonj.com/wp-content/uploads/2020/03/body-schematic-transparent-2048x1257.jpg"
        let MAP;
        MAP = {
            name: "my-map",
            areas: [
                { name: "1", shape: "circle", coords:[25,33,27,300,128,240,128,94]  },
                { name: "2", shape: "poly", coords: [219,118,220,210,283,210,284,119], preFillColor: "pink"  },
                { name: "3", shape: "poly", coords: [381,241,383,94,462,53,457,282], fillColor: "yellow"  },
                { name: "4", shape: "poly", coords: [245,285,290,285,274,239,249,238], preFillColor: "red"  },
                { name: "5", shape: "circle", coords: [170, 100, 25 ] },
            ]
        }
        return (

        //     <div>
        //     <div className="container">
        //         <ImageMapper src={URL} map={MAP} width={500}
        //                      // onLoad={() => this.load()}
        //                      onClick={area => this.clicked(area)}
        //                      onMouseEnter={area => this.enterArea(area)}
        //                      onMouseLeave={area => this.leaveArea(area)}
        //                      onMouseMove={(area, _, evt) => this.moveOnArea(area, evt)}
        //                      onImageClick={evt => this.clickedOutside(evt)}
        //                      onImageMouseMove={evt => this.moveOnImage(evt)}
        //         />
        //         {
        //             this.state.hoveredArea &&
        //             <span className="tooltip"
        //                   style={{ ...this.getTipPosition(this.state.hoveredArea)}}>
    	// 	{ this.state.hoveredArea && this.state.hoveredArea.name}
    	// </span>
        //         }
        //     </div>
            <div>{this.state.instructions &&
            <Accordion style={{width: 500, merginRight:100}} defaultActiveKey="1">
                <Card>
                    <Card.Header>
                        <Accordion.Toggle type="button" variant="link" eventKey="0">
                            <b> מרפאת טרום ניתוח - אורתופדיה - דף הסבר</b>
                        </Accordion.Toggle>
                    </Card.Header>
                    <Accordion.Collapse eventKey="0">
                        <Card.Body>
                            <ListGroup variant="flush">
                                <ListGroup.Item><b>:מטרת הבדיקה</b></ListGroup.Item>
                                <ListGroup.Item>{this.state.instructions.Target}</ListGroup.Item>
                                <ListGroup.Item><b> :יש להביא לביקור את תוצאות הבדיקות הבאות</b> </ListGroup.Item>
                                {this.state.instructions.TestsResults.map((test) => (
                                    <ListGroup.Item> {test} </ListGroup.Item>
                                ))}
                                <ListGroup.Item><b> :תהליך הבדיקה</b> </ListGroup.Item>
                                {this.state.instructions.TestProcess.map((process) => (
                                    <ListGroup.Item> {process} </ListGroup.Item>
                                ))}
                            </ListGroup>
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>
            </Accordion>
            } </div>
        )
    }
}

export default InstructionsSurgery;


