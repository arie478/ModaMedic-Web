import React, {Component} from "react"
import axios from 'axios';
    import "../Table.css";
    import { BrowserRouter, Route, Link } from "react-router-dom";
    import SurveyComponent from './SurveyComponent';
    import Table from 'react-bootstrap/Table';
 //   import 'bootstrap/dist/css/bootstrap.css';
class QuestionnaireManger extends Component {
    constructor() {
        super()
        this.state={
        questionnairesArr: []
        } 
       
    this.presentQuestionnaire = this.presentQuestionnaire.bind(this);
    this.presentQuestionnaire();
    }

    async presentQuestionnaire(){
  
        let url = 'http://localhost:8180/auth/usersAll/getUserQuestionnaire';
         let response =await axios.get(
          url,
            { 
                headers: { 
                    'Content-Type': 'application/json',
                   // 'x-auth-token': sessionStorage.getItem("token")
                   'x-auth-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySUQiOiJ0cmo4M00zQjBPTHVTZnBVSHBuSzR6aXVqcEV1Y0N3VHZ5LzNjYjQ3MHNzPSIsIlR5cGUiOlsicGF0aWVudCJdLCJpYXQiOjE2MDg2NDgzMDUsImV4cCI6MTY0MDE4NDMwNX0.HysQVw90QVt3saFRM2ujpRXpzDoTkqEGhEl2Xr99-Uw'
                } 
            });
        
            if(response.data.data){
                //console.log (response.data.data);
                let questionnairesArrTemp= [];
                //run over questionareest
                for (var i=0;i<response.data.data.length;i++){
                 questionnairesArrTemp.push([response.data.data[i].QuestionnaireID,response.data.data[i].QuestionnaireText]);
                }
   
                this.setState({
                    questionnairesArr: questionnairesArrTemp
                  });
        }
    }

   
render(){  
return(
        <div>
        <Table >
            <thead>
                 שם שאלון         
            </thead>
            <tbody>
                {this.state.questionnairesArr.map(id => (
              <td style={{width: "100%"}} >
        <Link to={`/userQuestionnaire/${id[0]}`} > {id[1]}
    
        </Link>  
          </td>
          ))}

          </tbody>
      
        </Table>

    </div>
    
);
    
}

}

export default QuestionnaireManger;