import React from 'react'; 
import '../Styles/display.css'; 
import {connect} from 'react-redux'; 
import requiresLogin from './requires-login'; 
import SlouchSlider from './SlouchSlider'; 
import {fetchDisplayData} from '../actions/display'; 

export class Display extends React.Component { 
  componentDidMount(){ 
    this.props.dispatch(
      fetchDisplayData());
  }

  render(){ 
    return (
      <div className="display">
        <p>Hi {this.state.username}!</p>
        <p>You've logged {this.state.loggedHours} hours.</p>
        <p>You've slouched for {this.state.slouchedHours} hours.</p>
        <p>This is a {this.state.improvement}% improvement.</p>
        <input type="button" value="Refresh" onClick={() => this.getDisplay()}></input>
        {/* SlouchSlider is running, but not visible */}
        <div className="slouchSlider">
          <SlouchSlider />
        </div>
      </div>
    );
  }
};

const mapStateToProps = state => ({ 
    error: state.display.error, 
    loading : state.display.loading,
    username : state.display.username, 
    loggedHours : state.display.loggedHours, 
    slouchedHours : state.display.slouchedHours, 
    improvement : state.dispaly.improvement
  }); 

export default requiresLogin()(connect(mapStateToProps)(Display)); 