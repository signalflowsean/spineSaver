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

  handleSubmit(e){ 

    const user = {
      fullname : this.state.fullname, 
      username : this.state.username, 
      password : this.state.password, 
    }; 
    //console.log(user); 
    this.postSubmitData(user);   
  }

  postSubmitData(user){
    fetch(`${API_BASE_URL}/signup`, { 
      method: 'post',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(user)
    }).then(res => {
      //console.log('res', res);
      return res.json(); 
    }).then(signup => {  
      console.log('Signup: ', JSON.stringify(signup)); 
    }).catch(error => { 
      console.log('Error:', error);
    });

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
        <input type="text" placeholder="Jane Doe" value={this.state.fullname} onChange={(e) => this.handleFullnameChange(e)}></input>
        <label>Username</label>
        <input type="text" placeholder="JayD23" value={this.state.username} onChange={(e) => this.handleUsernameChange(e)}></input>
        <label>Password</label>
        <input type="password" placeholder="password123" value={this.state.password} onChange={(e) => this.hanldePasswordChange(e)}></input>
        <label>Email</label>
        <input type="email" placeholder="jdoe23@fawn.com" value={this.state.email} onChange={(e) => this.handleEmailChange(e)}></input>
        <input type="button" value="submit" onClick={() => this.handleSubmit()}></input>
      </form>
    ); 
  }
}