import React from 'react'; 
import {connect} from 'react-redux'; 
import {Link, Redirect} from 'react-router-dom'; 
import '../Styles/main.css'; 

export function MainPage(props) { 
  
  if(props.loggedIn) { 
    return <Redirect to="/home" />
}
  
  return (  
    <div>
      <header className="header">
        <ul className="header-ul">
          <li className="header-li">
            <h2 className="header-title">Spine Saver</h2>
          </li>
          <li className="header-li">
            <Link className="account" to="/signup">Sign Up</Link>
          </li>
          <li className="header-li">
          <Link className="account" to="/login">Login</Link>
          </li>
        </ul>
      </header>
      <main>
        <section className="main-page-container">
          <img className="spine-image" src="https://static.thenounproject.com/png/1043916-200.png" alt="Spine"></img>
          <div className="landing-container">
            <h3 className="header-landing ">REALTIME SLOUCH TRACKING</h3>
          
            <p className="landing-page">Tracks how much you are slouching 
            using a webcam. Notifies you when you need to sit up straight.</p>
            <h3 className="header-landing ">SLOUCHING ANALYTICS</h3>
            <p className="landing-page">View your slouch data over time 
            see if you are improving.</p>
            <p className="landing-page">Demo Account: Username: demo, Password: password123 </p>
          </div>
        </section>
      </main>
    </div>
  ); 
}

const mapStateToProps = state => ({ 
  loggedIn: state.auth.currentUser !== null
}); 

export default connect(mapStateToProps)(MainPage); 