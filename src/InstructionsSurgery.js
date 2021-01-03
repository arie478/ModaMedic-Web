import React, {Component} from "react"
import Table from "react-bootstrap/Table";
import 'bootstrap/dist/css/bootstrap.css'
import axios from "axios";
import {Card} from "react-bootstrap";
import Accordion from "react-bootstrap/Accordion";
import ListGroup from "react-bootstrap/ListGroup";


class InstructionsSurgery extends Component {

    constructor(props) {
        super(props);
        this.state = {
            instructions: {},
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
            this.setState({instructions: respone.data.data[0]})
        }
    }


    render() {
        return (
            <div>
                <Accordion defaultActiveKey="0">
                    <Card>
                        <Card.Header>
                            <Accordion.Toggle type="button" variant="link" eventKey="0">
                                מרפאת טרום ניתוח - אורתופדיה - דף הסבר
                            </Accordion.Toggle>
                        </Card.Header>
                        <Accordion.Collapse eventKey="0">
                            <Card.Body>
                                <ListGroup variant="flush">
                                    <ListGroup.Item>{this.state.instructions.Target}</ListGroup.Item>
                                    <ListGroup.Item> :יש להביא לביקור את תוצאות הבדיקות הבאות </ListGroup.Item>
                                    {/*{this.state.instructions.TestsResults.map((test) => (*/}
                                    {/*    <ListGroup.Item> {test} </ListGroup.Item>*/}
                                    {/*))}*/}
                                    {/*<ListGroup.Item> תהליך הבדיקה:  </ListGroup.Item>*/}
                                    {/*{this.state.instructions.TestProcess.map((process) => (*/}
                                    {/*    <ListGroup.Item> {process} </ListGroup.Item>*/}
                                    {/*))}*/}
                                </ListGroup>
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                </Accordion>
            </div>
        )
    }
}

export default InstructionsSurgery;


