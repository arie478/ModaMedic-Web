
import React, {Component} from 'react';
import "./Logo";
import "./Search";
import "./PatientSearch";


import Logo from './Logo';
import NavBar from "./NavBar";
import SearchPatient from "./Search";


class App extends Component {
    constructor(props) {
      super(props);
    }

  render(){
    require("./App.css");
    return (
      <div>
        <NavBar />
        <div className="App">
          <header className="App-header">
            <Logo />
              {sessionStorage.getItem('doctor') && <SearchPatient/>}
              {this.props.component}
            <br />
          </header>
        </div>
      </div>
    )
  }
}

export default App;
