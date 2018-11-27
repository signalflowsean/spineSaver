import React from 'react'; 
import '../Styles/display.css'; 
import {connect} from 'react-redux'; 
import {Link} from 'react-router-dom'; 
import requiresLogin from './requires-login'; 
import SlouchSlider from './slouchSlider'; 
import {fetchDisplayData, fetchCalibrationData} from '../actions/display'; 

export class Display extends React.Component { 
  componentDidMount(){ 
    this.props.dispatch(fetchCalibrationData(this.props.currentUser.id)); 
    //Fetch calibration data from backend
    
    //If calibration data is not found redirect user to settings page

  }

  fetchDisplayData(){ 
    this.props.dispatch(fetchDisplayData(this.props.currentUser.id));
  }

  render(){ 
    if (this.props.currentUser === undefined){ 
      return (
        <div>User is not valid</div>
      ); 
    }
  
    return (
      <div className="display">
        <Link to="/settings">Calibrate</Link>
        <p>Hi {this.props.name}!</p>
        <p>You've logged {this.props.loggedHours} hours.</p>
        <p>You've slouched for {this.props.slouchedHours} hours.</p>
        <p>This is a {this.props.improvement}% improvement.</p>
        <input type="button" value="Refresh" onClick={() => this.getDisplay()}></input>
        {/* SlouchSlider is running, but not visible */}
        <div className="slouchSlider">
          <SlouchSlider calibValBeckEnd={this.props.calibVal}/>
          {/* <SlouchSlider /> */}
        </div>
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
  improvement : state.display.improvement
}); 

export default requiresLogin()(connect(mapStateToProps)(Display)); 