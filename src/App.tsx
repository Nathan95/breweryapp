import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';
import Brewerlist from './components/Brewerlist';


function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Brewerlist} />
          <div className="App">
            <Brewerlist />
          </div>
      </Switch>
    </Router>
  );
}

export default App;
