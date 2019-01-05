import React from 'react'; 
import {connect} from 'react-redux'; 
import {Link, Redirect} from 'react-router-dom'; 
import '../Styles/signup.css'; 

import SignUpForm from './signUpForm'; 

export function SignUpPage(props) { 


  if(props.loggedIn) { 
    return <Redirect to="/home" />; 
  } 

  return (
    <div>
      <header className="header">
        <h2 className="header-title">SignUp</h2>
        <Link to="/">
          <img className="home" alt="home" src="https://cdn2.iconfinder.com/data/icons/web-application-icons-part-i/100/Artboard_43-512.png"></img>
        </Link>
      </header>
      <SignUpForm className="signup"></SignUpForm>
    </div>
  ); 
}

const mapStateToProps = state => ({ 
  loggedIn: state.auth.currentUser !== null
}); 

export default connect(mapStateToProps)(SignUpPage)