import React from 'react'; 
import {connect} from 'react-redux'; 
import {Link, Redirect} from 'react-router-dom'; 
import '../Styles/main.css'; 
import '../Styles/landing.css';

export function MainPage(props) { 
  
  if(props.loggedIn) { 
    return <Redirect to="/home" />
}
  
  return (  

    <div >
    <div className="navBar">
      <div className="navBarLeft">
      </div>
      <div className="navBarMiddle">
        <h2 className="header-title">Spine Saver</h2>
      </div>
      <div className="navBarRight">
        <Link className="account login" to="/login">Log In</Link>
        <Link className="account" to="/signup">Sign-Up</Link>
      </div>
    </div>

    <div className="descriptionBox">
      <p className="main-description">
        Track your slouching. All you need is a webcam!
      </p>
    </div>
    <div className="centerMainImageContainer">
    
        <img className='slouch-img' alt="slouch" src="https://us.123rf.com/450wm/logo3in1/logo3in11601/logo3in1160100026/51908340-stock-vector-correct-alignment-of-human-body-in-standing-posture-for-good-personality-and-healthy-of-spine-and-bo.jpg?ver=6"></img>
    </div>
    <div className="featureContainer">
        <div className="featureBox">
            <img alt="tracking" className="featureImages" src="https://static.thenounproject.com/png/30117-200.png"></img>
            <h3>Live Tracking</h3>
            <div className="featureText">
                <p>Tracks user's slouching in realtime. Alerts the user if they are souching. Spine Saver only requires access to your webcam, no additional sensors needed!</p>
            </div>
        </div>
        <div className="featureBox">
            <img  alt="telemetry" className="featureImages" src="https://prd-mp-images.azureedge.net/ad417ac7-c753-43c0-a131-b1d4aad122e9/images/0eab7317-0c6c-4f60-a7de-8941dafb9657/alertingicon.png"></img>
            <h3>Telemetry</h3>
            <div className="featureText">
                <p>Allows users to view their progress. Currently, users can see how long they are slouching durring a session and if it was an improvement from last session. More metrics to come! </p>
            </div>
        </div>
        <div className="featureBox">
            <img alt="about me" className="featureImages" src="http://s16574.pcdn.co/wp-content/uploads/2018/05/About-icon.png"></img>
            <h3>About Me</h3>
            <div className="featureText">
                <p>Signalflowsean is a software developer in the Boston area. Checkout his other works at his <a href="https://www.signalflowsean.com">website</a>
                </p>
            </div>
        </div>
    </div>
    <div className="center">
    </div>
    {/* <div className="footer">

    </div> */}
</div>
);
}

const mapStateToProps = state => ({ 
  loggedIn: state.auth.currentUser !== null
}); 

export default connect(mapStateToProps)(MainPage); 