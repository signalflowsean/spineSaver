import React from 'react'; 
import {BrowserRouter as Router, Route, Link} from 'react-router-dom'; 
import SlouchSlider from './SlouchSlider'; 
import Display from './Display'; 

export default function App(props) { 
  return ( 
    <Router> 
      <div>
        <header>
          <h1>Spine Saver
            <input type="button" value="Home"></input>
            <input type="button" value="Settings"></input>
          </h1>
        </header>
        <main>
          <Route exact path="/home" component={Display} />
          <Route exact path="/settings" component={SlouchSlider} />
        </main>
      </div>
    </Router>
  )
}