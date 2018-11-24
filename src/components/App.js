import React from 'react'; 
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';
import SlouchSlider from './SlouchSlider'; 
import Login from './Login'; 
import Signup from './SignUp'; 
import Display from './Display'; 
import '../Styles/app.css'

export default function App(props) { 
  return ( 
    <Router> 
      <div>
        <header>
          <h1>Spine Saver</h1>
          <Link to="/login">Login</Link>
          <br></br>
          <Link to="/signup">SignUp</Link>
          <br></br>
          <Link to="/home">Home</Link>
          <br></br>
          <Link to="/settings">Settings</Link>
        </header>
        <main>
          <Route exact path="/login" component={Login} />
          <Route exact path="/signup" component={Signup} />
          <Route exact path="/home" component={Display} />
          <Route exact path="/settings" component={SlouchSlider} />
        </main>
      </div>
    </Router>
  )
}