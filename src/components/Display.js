import React from 'react'; 
import '../Styles/display.css'; 
import {connect} from 'react-redux'; 
import requiresLogin from './requires-login'; 
import SlouchSlider from './slouchSlider'; 
import {fetchDisplayData} from '../actions/display'; 

export class Display extends React.Component { 
 
  fetchDisplayData(){ 
    this.props.dispatch(fetchDisplayData(this.props.currentUser.id));
  }

  render(){ 
    console.log(JSON.stringify(this.props.currentUser));
    if (this.props.currentUser === undefined){ 
      return (
        <div>User is not valid</div>
      ); 
    }
    
    //once user is loaded then fetch display data
    // if (this.props.loading === false){ 
    //   return (
    //     <div>Please wait loading user...</div>
    //   )
    // }
    // else { 
    //   this.fetchDisplayData(); 
    // }
    this.fetchDisplayData(); 

 
    return (
      <div className="display">
        <p>Hi {this.props.name}!</p>
        <p>You've logged {this.props.loggedHours} hours.</p>
        <p>You've slouched for {this.props.slouchedHours} hours.</p>
        <p>This is a {this.props.improvement}% improvement.</p>
        <input type="button" value="Refresh" onClick={() => this.getDisplay()}></input>
        {/* SlouchSlider is running, but not visible */}
        <div className="slouchSlider">
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