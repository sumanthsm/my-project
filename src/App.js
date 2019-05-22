import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import './App.css';
import Dashboard from './components/Dashboard';
import AddNewApp from './components/AddNewApp';
import AppList from './components/AppList';
import EditApp from './components/EditApp';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Router>
          <Route path="/" exact component={Dashboard} />
          <Route path="/addnew" component={AddNewApp} />
          <Route path="/applist" component={AppList} />
          <Route path="/editapp:id" component={EditApp} />
        </Router>
      </div>
    );
  }
}

export default App;
