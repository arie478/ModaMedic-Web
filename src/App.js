
import React, {Component} from 'react';
import axios from 'axios';
import {Redirect} from "react-router-dom";
import "./Logo";
import "./Search";
import "./PatientSearch";


import Logo from './Logo';
import PatientSearch from "./PatientSearch";
import NavBar from "./NavBar";
import MessagesPage from "./MessagesPage";


class App extends Component {
    constructor() {
      super();
      // this.state = {
      //   showPopup: false,
      //   pass: "",
      //   pass2: "",
      //   diff: false,
      //   isLogOut: false
      // };
    }
  //     this.logout = this.logout.bind(this);
  //     this.change = this.change.bind(this);
  //     this.togglePopup = this.togglePopup.bind(this);
  //     this.handleChange = this.handleChange.bind(this);
  //     this.handleSubmit = this.handleSubmit.bind(this)
  // }
  //
  // togglePopup() {
  //   this.setState({
  //     showPopup: !this.state.showPopup
  //   });
  // }
  //
  // async handleSubmit(event){
  //   event.preventDefault();
  //   if(this.state.pass !== this.state.pass2){
  //     this.setState({
  //       diff: true
  //     });
  //   }
  //   else{
  //     let url = 'http://localhost:8180/auth/usersAll/askChangePassword';
  //     var token;
  //     const response = await axios.post(
  //       url,
  //       {},
  //       {
  //           headers: {
  //               'Content-Type': 'application/json',
  //               'x-auth-token': sessionStorage.getItem("token")
  //           }
  //       }
  //     );
  //     token = response.data.data;
  //     url = 'http://localhost:8180/users/passwordChangeCheck/changePassword';
  //     const responsec = await axios.post(
  //       url,
  //       {
  //         "NewPassword":this.state.pass
  //       },
  //       {
  //           headers: {
  //               'Content-Type': 'application/json',
  //               'x-auth-token': token
  //           }
  //       }
  //     );
  //     if(responsec.data.message){
  //       window.alert("הסיסמא שונתה בהצלחה");
  //       this.togglePopup();
  //     }
  //   }
  //
  // }
  //
  // handleChange(event) {
  //   const {name, value, type, checked} = event.target
  //   type === "checkbox" ? this.setState({ [name]: checked }) : this.setState({ [name]: value })
  // }
  //
  // logout() {
  //   sessionStorage.removeItem("token");
  //   sessionStorage.removeItem("type");
  //   sessionStorage.removeItem("name");
  //   sessionStorage.removeItem("doctor");
  //   localStorage.removeItem("token");
  //   localStorage.removeItem("type");
  //   localStorage.removeItem("name");
  //   localStorage.removeItem("doctor");
  //   this.setState({
  //       isLogOut: true
  //   })
  // }
  //
  // change(){
  //   this.togglePopup();
  // }

  render(){
    require("./App.css");
    return (
      <div>
        <NavBar />
        <div className="App">
          <header className="App-header">
            <Logo />
              {this.props.component}
            {/*<PatientSearch />*/}
            {/*{this.state.isLogOut ? <Redirect to="/" /> : null}*/}
            <br />
          </header>
        </div>
        {/*{this.state.showPopup ? */}
        {/*  <Popup*/}
        {/*      change={this.handleChange.bind(this)}*/}
        {/*      closePopup={this.togglePopup.bind(this)}*/}
        {/*      handleSubmit={this.handleSubmit.bind(this)}*/}
        {/*      diff={this.state.diff}*/}
        {/*  /> : null*/}
        {/*}*/}
      </div>
    )
  }
}

export default App;


// class Popup extends React.Component {
//
//   render() {
//     require("./App.css");
//     return (
//       <div className='popup'>
//           <div className='popup_inner' >
//               <button onClick={this.props.closePopup} id="x">x</button>
//               <h3 id="h3">החלפת סיסמא</h3>
//               <form onSubmit={this.props.handleSubmit}>
//                 <div className="lineC">
//                   <label>
//                       סיסמא חדשה:
//                   </label>
//                 </div>
//                 <div className="lineC">
//                   <input type="password" name="pass" id="pass" onChange={this.props.change} required/>
//                 </div>
//                 <div className="lineC">
//                   <label>
//                       הקלד את הסיסמא מחדש:
//                   </label>
//                 </div>
//                 <div className="lineC">
//                   <input type="password" name="pass2" id="pass2" onChange={this.props.change} required/>
//                 </div>
//                 <div className="lineC">
//                   {this.props.diff ? <label id="diffPass">הסיסמאות שונות</label> : null}
//                 </div>
//                 <div className="lineC">
//                   <input type="submit" value="שלח" />
//                 </div>
//               </form>
//           </div>
//       </div>
//     );
//   }
// }
