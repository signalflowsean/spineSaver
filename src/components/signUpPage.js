import React from 'react'; 
import {connect} from 'react-redux'; 
import {Link, Redirect} from 'react-router-dom'; 

import SignUpForm from './signUpForm'; 

export function SignUpPage(props) { 

  //If logged go to home
  if(props.loggedIn) { 
    return <Redirect to="/home" />; 
  }

  return (
    <div>
      <h2>SignUp for Spine Saver</h2>
      <SignUpForm></SignUpForm>
      <Link to="/">Login</Link>
    </div>
  ); 
}

const mapStateToProps = state => ({ 
  loggedIn: state.auth.currentUser !== null
}); 

export default connect(mapStateToProps)(SignUpPage)