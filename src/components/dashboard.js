import React from 'react'; 
import '../Styles/display.css'; 
import {connect} from 'react-redux'; 
import {Link, Redirect} from 'react-router-dom'; 
import requiresLogin from './requires-login'; 
import SlouchSlider from './SlouchSlider'; 
import {fetchCalibrationData} from '../actions/display'; 
import { clearAuth } from '../actions/auth';

export class Display extends React.Component { 
  constructor(props){ 
    super(props); 
    this.loggedIn = true; 
  }
  
  componentDidMount(){ 
    //CHECKING TO SEE IF THE USER HAS ALREADY CALIBRATED
    this.props.dispatch(fetchCalibrationData(this.props.currentUser.id)); 
  }

  componentDidUpdate(prevProps) { 
    if(!prevProps.calibVal && this.props.hasCalibrated) { 
      console.log('Calibration value has changed to:', this.props.calibVal)
    }
  }

  logOut(){ 
    this.props.dispatch(clearAuth()); 
    this.loggedIn = false; 
  }

  render(){ 
    console.log('calibloading', this.props.isCalibLoading); 
    console.log('display loading', this.props.isDisplayLoading); 
    console.log('notCalibrated', this.props.notCalibrated); 
    console.log('logged hours', this.props.loggedHours); 
    console.log('loading', this.props.isCalibLoading); 
    if (this.props.isCalibLoading){ 
      return (<p>Loading...</p>); 
    }

    if (this.loggedIn === false){
      console.log('Not logged in, can\'t be here'); 
      return (<Redirect to="/"></Redirect>); 
    }

    if (this.props.currentUser === undefined){ 
      console.log('Current user is not defined'); 
      return (<div>User is not valid</div>); 
    }
    console.log('not calibrated', this.props.notCalibrated); 
    if (this.props.notCalibrated && !this.props.isCalibLoading){  
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

const mapStateToProps = state => {
  // console.log('mapping state to props');  
  return { 
    currentUser : state.auth.currentUser, 
    name : state.auth.currentUser.fullname, 
    error: state.display.error, 
    isCalibLoading : state.display.isCalibloading,
    isDisplayLoading : state.display.isDisplayLoading, 
    loggedHours : state.display.loggedHours, 
    slouchedHours : state.display.slouchedHours, 
    improvement : state.display.improvement, 
    calibVal : state.display.calibVal, 
    notCalibrated : state.display.notCalibrated }; 

}; 

export default requiresLogin()(connect(mapStateToProps)(Display)); 
