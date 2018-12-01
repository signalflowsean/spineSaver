import React from 'react'; 
import '../Styles/display.css'; 
import {connect} from 'react-redux'; 
import {Link, Redirect} from 'react-router-dom'; 
import requiresLogin from './requires-login'; 
import SlouchSlider from './SlouchSlider'; 
import {fetchDisplayData, fetchCalibrationData} from '../actions/display'; 
import { clearAuth } from '../actions/auth';

export class Display extends React.Component { 
  constructor(props){ 
    super(props); 
    this.loggedIn = true; 
  }
  
  componentDidMount(){ 
    this.props.dispatch(fetchCalibrationData(this.props.currentUser.id)); 
  }

  componentDidUpdate(prevProps) { 
    if(!prevProps.calibVal && this.props.hasCalibrated) { 
      console.log('Calibration value has changed to:', this.props.calibVal)
    }
  }

  logOut(){ 
    console.log(`Logging out ${this.props.currentUser}`); 
    this.props.dispatch(clearAuth()); 
    this.loggedIn = false; 
  }

  fetchDisplayData(){ 
    this.props.dispatch(fetchDisplayData(this.props.currentUser.id));
  }

  render(){ 
    if (this.loggedIn === false){
      console.log('Not logged in, can\'t be here'); 
      return (<Redirect to="/"></Redirect>); 
    }

    if (this.props.currentUser === undefined){ 
      console.log('Current user is not defined'); 
      return (<div>User is not valid</div>); 
    }
        
    if (this.props.notCalibrated){  
      console.log('Not calibrated, redirecting back'); 
      return (<Redirect to="/settings" />); 
    }
  
    return (
      <div>
        <header className="header">
          <h2>Spine Saver</h2>
          <section>
            <Link to="/settings">Calibrate</Link>
          </section>
        </header>
        <main>
          <p>Hi {this.props.name}!</p>
          <p>You've logged {this.props.loggedHours} minutes.</p>
          <p>You've slouched for {this.props.slouchedHours} minutes.</p>
          <p>This is a {this.props.improvement}% improvement.</p>
          <input type="button" value="Log Out" onClick={() => this.logOut()}></input>
          <div className="slouchSlider">
            <SlouchSlider calibValBeckEnd={this.props.calibVal}/>
          </div>
        </main>
      </div>
    );
  }
};

const mapStateToProps = state => ({ 
  currentUser : state.auth.currentUser, 
  name : state.auth.currentUser.fullname, 
  error: state.display.error, 
  loading : state.display.loading,
  loggedHours : state.display.loggedHours, 
  slouchedHours : state.display.slouchedHours, 
  improvement : state.display.improvement, 
  calibVal : state.display.calibVal, 
  notCalibrated : state.display.notCalibrated 
}); 

export default requiresLogin()(connect(mapStateToProps)(Display)); 