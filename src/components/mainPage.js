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
          <h3 className="header-landing landing-page">REALTIME SLOUCH TRACKING</h3>
          <p className="landing-page">Tracks how much you are slouching 
          using a webcam. Notifies you when you need to sit up straight.</p>
          <h3 className="header-landing landing-page">SLOUCHING ANALYTICS</h3>
          <p className="landing-page">View your slouch data over time 
          see if you are improving.</p>
          <img className="spine-image" src="https://santispilates.files.wordpress.com/2009/11/fotolia_9063035_s-spine1.jpg" alt="Spine"></img>
        {/* DEMO ACCOUNT GOES HERE */}
        </section>
      </main>
    </div>
  ); 
}

const mapStateToProps = state => ({ 
  loggedIn: state.auth.currentUser !== null
}); 

export default connect(mapStateToProps)(MainPage); 