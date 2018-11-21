import React from 'react'; 
import '../Styles/display.css'; 
import {API_BASE_URL} from '../config'; 

export default class Display extends React.Component { 
  constructor(props){
    super(props); 
    
    this.state = { 
      username : 'Steve Ramirez', 
      loggedHours : 0, 
      slouchedHours : 0, 
      improvement : 0
    }; 
  }
  
  getDisplay() { 
    fetch(`${API_BASE_URL}/display`)
    .then(res=> { return res.json(); })
    .then(data => { 
      console.log('display', data); 
      this.setState({
      loggedHours : data.timeElapsed, 
      slouchedHours : data.slouchElapsed, 
      improvement : data.improvement})
      })
    .catch(err => { 
      console.log(err)
    })
  }
  componentDidMount(){ 
    this.getDisplay(); 
  }

  render(){ 
    return (
      <div className="display">
        <p>Hi {this.state.username}!</p>
        <p>You've logged {this.state.loggedHours} hours.</p>
        <p>You've slouched for {this.state.slouchedHours} hours.</p>
        <p>This is a {this.state.improvement}% improvement.</p>
        <input type="button" value="Refresh" onClick={() => this.getDisplay()}></input>
      </div>
    );
  }

} 