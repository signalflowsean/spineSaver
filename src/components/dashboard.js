import React from 'react'; 
import '../Styles/display.css'; 
import {connect} from 'react-redux'; 
import {Link, Redirect} from 'react-router-dom'; 
import requiresLogin from './requires-login'; 
import SlouchSlider from './SlouchSlider'; 
import {fetchCalibrationData, resetValsOnLogOut} from '../actions/display'; 
import { clearAuth } from '../actions/auth';

export class Display extends React.Component { 

  componentWillMount() { 
    this.props.dispatch(fetchCalibrationData(this.props.currentUser.id)); 
  }

  componentDidUpdate(prevProps) { 
    if(prevProps.loggedIn && !this.props.loggedIn) {    
      this.props.dispatch(clearAuth()); 
    }
  }

  logOut(){ 
    this.props.dispatch(resetValsOnLogOut()); 
  }

  render(){ 
    if (this.props.isCalibLoading ){
      return (<p>Loading...</p>); 
    }

    if (this.props.hasUserEverCalibrated === false && this.props.hasCalibValUpdatedThisSession === false) {  
      return (<Redirect to="/settings" />); 
    }
   
    return (
      <div>
        <header className="header">
          <h2>Spine Saver</h2>
          <section>
            <Link className="icon" to="/settings">
              <img src="https://banner2.kisspng.com/20180211/xje/kisspng-gear-data-icon-ppt-design-gear-icon-5a80761ca95662.7998225215183682846936.jpg" alt="settings"></img>
            </Link>
          </section>
        </header>
        <main>
          <p>Hi {this.props.name}!</p>
          <p>You've logged {this.props.loggedHours} minutes.</p>
          <p>You've slouched for {this.props.slouchedHours} minutes.</p>
          <p>This is a {this.props.improvement}% improvement.</p>
          
          <p>{this.isSlouching}</p>
          <p>Slouch Amount:  </p>
          <input 
            type="range" 
            name="slouchSlider" 
            value={(this.props.slouch) ? this.props.slouch : 0} 
            step=".01" 
            min="0" 
            max="1"
            onChange={() => console.log('')} >
          </input>
          
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
    isCalibLoading : state.display.isCalibLoading,
    isDisplayLoading : state.display.isDisplayLoading, 
    loggedHours : state.display.loggedHours, 
    slouchedHours : state.display.slouchedHours, 
    improvement : state.display.improvement, 
    calibVal : state.display.calibVal, 
    loggedIn : state.display.loggedIn, 
    hasUserEverCalibrated : state.display.hasUserEverCalibrated, 
    hasCalibValUpdatedThisSession : state.slouch.hasCalibValUpdatedThisSession, 
    slouch : state.slouch.slouch
  }); 

export default requiresLogin()(connect(mapStateToProps)(Display)); 
