import React from 'react'; 
import {API_BASE_URL} from '../config';
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

  }

  handleSubmit(){ 
    const user = {
      fullname : this.state.fullname, 
      username : this.state.username, 
      password : this.state.password, 
    }; 
    this.postSubmitData(user);   
  }

  postSubmitData(user){
   
  }

  handleFullnameChange(fullname){ 
    this.setState({fullname}); 
  }

  handleUsernameChange(username){ 
    this.setState({username}); 
  }

  hanldePasswordChange(password){ 
    this.setState({password}); 
  }

  handleEmailChange(email){ 
    this.setState({email});  
  }

  render(){ 
    return (
      <form onSubmit={this.handleSubmit}>
        <label>Full Name</label>
        <input type="text" placeholder="Jane Doe" value={this.state.fullname} onChange={e => this.handleFullnameChange(e.target.value)}></input>
        <label>Username</label>
        <input type="text" placeholder="JayD23" value={this.state.username} onChange={e => this.handleUsernameChange(e.target.value)}></input>
        <label>Password</label>
        <input type="password" placeholder="password123" value={this.state.password} onChange={e => this.hanldePasswordChange(e.target.value)}></input>
        <label>Email</label>
        <input type="email" placeholder="jdoe23@fawn.com" value={this.state.email} onChange={e => this.handleEmailChange(e.target.value)}></input>
        <input type="button" value="submit" onClick={() => this.handleSubmit()}></input>
      </form>
    ); 
  }
}