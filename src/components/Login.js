import React from 'react'; 
import {API_BASE_URL} from '../config';

export default class Login extends React.Component{ 
  constructor(props){ 
    super(props); 

    this.state = { 
      username : '', 
      password : ''
    }
  }

  handleUsernameChange(username){ 
    this.setState({username}); 

  }

  handlePasswordChange(password){ 
    this.setState({password}); 
  }

  handleSubmit(){ 
    const login = { 
      username : this.state.username, 
      password : this.state.password
    }
    this.postSubmitData(login); 
  }

  postSubmitData(login){
    fetch(`${API_BASE_URL}/login`, { 
      method: 'post',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(login)
    }).then(res => {
      //console.log('res', res);
      return res.json(); 
    }).then(signup => {  
      console.log('Signup: ', JSON.stringify(signup)); 
    }).catch(error => { 
      console.log('Error:', error);
    });
  }

  render(){ 
    return (
      <form>
        <label>Username</label>
        <input type="text" placeholder="urUsername" value={this.state.username} onChange={e => this.handleUsernameChange(e.target.value)}></input>
        <label>Password</label>
        <input type="password" placeholder="urPassword" value={this.state.password} onChange={e => this.handlePasswordChange(e.target.value)}></input>
        <input type="button" value="submit" onClick={() => this.handleSubmit()}></input>
      </form>
    ); 
  }
}