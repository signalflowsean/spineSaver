import React from 'react'; 


export default class Display extends React.Component { 
  constructor(props){
    super(props); 
    
    //console.log('hi'); 
    this.state = { 
      username : 'Steve Ramirez', 
      loggedHours : 0, 
      slouchedHours : 0, 
      improvement : 0
    }; 
  }

  render(){ 
    return (
      <div>
        <p>Hi {this.state.username}!</p>
        <p>You've logged {this.state.loggedHours} hours.</p>
        <p>You've slouched for {this.state.slouchedHours} hours.</p>
        <p>This is a {this.state.improvement}% improvement.</p>
      </div>
    )
  }

} 