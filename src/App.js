import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import './App.css';
import Dashboard from './components/Dashboard';
import AddNewApp from './components/AddNewApp';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Router>
        <Route path="/" exact component={Dashboard} />
        <Route path="/addnew" component={AddNewApp} />
        </Router>
      </div>
    );
  }
}

export default App;
