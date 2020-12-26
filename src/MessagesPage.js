import React, {Component} from "react"
import {Form} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import 'bootstrap/dist/css/bootstrap.css'

class MessagesPage extends Component {

    constructor() {
        super();
        var date = new Date();
        this.state = {
            sendFrom: '',
            sendTo: '',
            messageInfo:'',
            timeSumbit: date.toISOString().split("T")[0]
    }

    }

    render() {
        require("./MessagesPage.css");
        return (
            <div>
                <Form>
                    <Form.Group controlId="exampleForm.ControlTextarea1">
                        <Form.Label>כתוב הודעה בתיבת ההודעות:</Form.Label>
                        <Form.Control as="textarea" rows={4} />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Form>
<br/>
<div class="tableMessages">
                <Table id="mdd" striped bordered hover>
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>תאריך</th>
                        <th>מוען</th>
                        <th>תוכן ההודעה</th>

                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>1</td>
                        <td>Mark</td>
                        <td>Otto</td>
                        <td>eltrejkto</td>
                    </tr>
                    <tr>
                        <td>1</td>
                        <td>Mark</td>
                        <td>Otto</td>
                        <td>@mdo</td>
                    </tr>
                    </tbody>
                </Table>
            </div>
            </div>
        )
    }
}

export default MessagesPage;


