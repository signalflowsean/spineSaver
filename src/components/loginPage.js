import React from 'react'; 
import {connect} from 'react-redux'; 
import {Link} from 'react-router-dom'; 

import Login from './Login'; 

export function SignUpPage(props) { 

  return (
    <div>
      <header className="header">
        <h2 className="header-title">Login</h2>
        <Link to="/">
          <img className="home" alt="home" src="https://cdn2.iconfinder.com/data/icons/web-application-icons-part-i/100/Artboard_43-512.png"></img>
        </Link>
      </header>
    
    
      <Login></Login>

    </div>
  ); 
}

const mapStateToProps = state => ({ 
  loggedIn: state.auth.currentUser !== null
}); 

export default connect(mapStateToProps)(SignUpPage)