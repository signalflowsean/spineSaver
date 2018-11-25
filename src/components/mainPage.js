import React from 'react'; 
import {connect} from 'react-redux'; 
import {Link, Redirect} from 'react-router-dom'; 

import Login from './login'; 

export function MainPage(props) { 

  if(props.loggedIn) { 
    return <Redirect to="/home" />
  }

  return (
    <div>
      <h2>Spine Saver Main Page</h2>
      <Login />
      <Link to="/signup">SignUp</Link>
    </div>
  ); 
}

const mapStateToProps = state => ({ 
  loggedIn: state.auth.currentUser !== null
}); 

export default connect(mapStateToProps)(MainPage); 