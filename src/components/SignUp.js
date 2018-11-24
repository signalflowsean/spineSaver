import React from 'react'; 
import '../Styles/signup.css'; 

export default class SignUp extends React.Component{ 
  constructor(props) { 
    super(props); 
    this.state = { 
      fullname : '', 
      username : '', 
      password : '', 
      email : '', 
    }; 
    
    this.handleFullnameChange = this.handleFullnameChange.bind(this); 
    this.handleUsernameChange = this.handleUsernameChange.bind(this); 
    this.hanldePasswordChange = this.hanldePasswordChange.bind(this); 
    this.handleEmailChange = this.handleEmailChange.bind(this); 

  }

  handleSubmit(e){ 
    e.preventDefault(); 
 
  

  }

  handleFullnameChange(e){ 
    this.setState({fullname: e.target.value}); 
    console.log(this.state.fullname, this.state.username, this.state.password, this.state.email); 
  }

  handleUsernameChange(e){ 
    this.setState({username : e.target.value}); 
    console.log(this.state.fullname, this.state.username, this.state.password, this.state.email); 
  }

  hanldePasswordChange(e){ 
    this.setState({password : e.target.value}); 
    console.log(this.state.fullname, this.state.username, this.state.password, this.state.email); 
  }

  handleEmailChange(e){ 
    this.setState({email : e.target.value}); 
    console.log(this.state.fullname, this.state.username, this.state.password, this.state.email); 
  }

  render(){ 
    return (
      <form onSubmit={this.handleSubmit}>
        <label>Full Name</label>
        <input type="text" placeholder="Jane Doe" value={this.state.fullname} onChange={this.handleFullnameChange}></input>
        <label>Username</label>
        <input type="text" placeholder="JayD23" value={this.state.username} onChange={this.handleUsernameChange}></input>
        <label>Password</label>
        <input type="password" placeholder="password123" value={this.state.password} onChange={this.hanldePasswordChange}></input>
        <label>Email</label>
        <input type="email" placeholder="jdoe23@fawn.com" value={this.state.email} onChange={this.handleEmailChange}></input>
        <input type="submit" ></input>
      </form>
    ); 
  }
}