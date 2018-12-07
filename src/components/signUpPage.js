import React from 'react'; 
import {connect} from 'react-redux'; 
import {Redirect} from 'react-router-dom'; 
import '../Styles/signup.css'; 

import SignUpForm from './signUpForm'; 

export function SignUpPage(props) { 

  //If logged go to home
  if(props.loggedIn) { 
    return <Redirect to="/home" />; 
  } 

  return (
    <div>
      <header>
        <h2>SignUp</h2>
        {/* <Link className="icon" to="/">
          <img src="https://image.flaticon.com/icons/svg/25/25694.svg" alt="home"></img>
        </Link> */}
      </header>
      <SignUpForm className="signup"></SignUpForm>
    </div>
  ); 
}

const mapStateToProps = state => ({ 
  loggedIn: state.auth.currentUser !== null
}); 

export default connect(mapStateToProps)(SignUpPage)