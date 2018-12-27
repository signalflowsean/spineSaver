import React from 'react'; 
import '../Styles/display.css'; 
import {connect} from 'react-redux'; 
import {Link, Redirect} from 'react-router-dom'; 
import requiresLogin from './requires-login'; 
import SlouchSlider from './SlouchSlider'; 
import {fetchCalibrationData, resetValsOnLogOut} from '../actions/display'; 
import { clearAuth } from '../actions/auth';
import gear from './gear.png'; 
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
    console.log(this.props.isSlouching, 'poop')
    return (

      <div>
        <header className="header">
            <ul className="header-ul">
            <li className="header-li">
              <h2 className="header-title">Spine Saver</h2>
            </li>
            <li  className="header-li">  
              <Link className="header-nav-link" to="/settings">
                <img className="header-nav-icon" src={gear} alt="settings"></img>
              </Link>
            </li>
          </ul>
        </header>
        <main className="display-data-container">
          <section className="display-data-section">
          <p className="display-text">Hi {this.props.name}!</p>
          <p className="display-text">You've logged {this.props.loggedHours} minutes.</p>
          <p className="display-text">You've slouched for {this.props.slouchedHours} minutes.</p>
          <p className="display-text"> This is a {this.props.improvement}% improvement.</p>
          
          <p>{this.isSlouching}</p>
          <p className="display-text">Slouch Amount:  </p>
          <p className="display-text">{this.props.isSlouching}</p>
          <input 
            className="slouch-slider" 
            type="range" 
            name="slouchSlider" 
            value={(this.props.slouch) ? this.props.slouch : 0} 
            step=".01" 
            min="0" 
            max="1"
            onChange={() => console.log('')} >
          </input>
          <input
            className="log-out" 
            type="button" 
            value="Log Out" 
            onClick={() => this.logOut()}>
          </input>
          </section>
          <div className="slouch-slider-component">
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
    slouch : state.slouch.slouch,
    isSlouching: state.slouch.isSlouching
  }); 

export default requiresLogin()(connect(mapStateToProps)(Display)); 
