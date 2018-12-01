import React from 'react'; 
import {connect} from 'react-redux'; 
import {Link, Redirect} from 'react-router-dom'; 
import '../Styles/main.css'; 
import Login from './Login'; 

export function MainPage(props) { 
  //console.log('loggedIn', props.loggedIn); 
  if(props.loggedIn) { 
    console.log('logged in'); 
    return <Redirect to="/home" />
  }

  return (  
    <div>
      <header className="header">
        <h2>Spine Saver Main Page</h2>

        <section className="account">
          <Login className="login"/>
          <Link to="/signup">SignUp</Link>
        </section>
      </header>
      <main>
        {/* <img src="https://media.gettyimages.com/videos/the-vertebral-column-video-idtdf000001003?s=640x640"></img> */}
      </main>
    </div>
  ); 
}

const mapStateToProps = state => ({ 
  loggedIn: state.auth.currentUser !== null
}); 

export default connect(mapStateToProps)(MainPage); 