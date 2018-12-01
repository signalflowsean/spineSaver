import React from 'react'; 
import {connect} from 'react-redux'; 
import {Link, Redirect} from 'react-router-dom'; 
import '../Styles/main.css'; 

export function MainPage(props) { 
  
  if(props.loggedIn) { 
    console.log('logged in'); 
    return <Redirect to="/home" />
  }
  console.log(props.loggedIn); 

  return (  

    <div>
      <header className="header">
        <h2>Spine Saver</h2>
        <section>
          <Link className="account" to="/signup">SignUp</Link>
          <Link className="account" to="/login">Login</Link>
          {/* <Login className="login account"/> */}
        </section>
      </header>
      <main>
        <img src="https://santispilates.files.wordpress.com/2009/11/fotolia_9063035_s-spine1.jpg" alt="Spine"></img>
      </main>
      <footer>
        <p>Thanks for watching</p>
      </footer>
    </div>
  ); 
}

const mapStateToProps = state => ({ 
  loggedIn: state.auth.currentUser !== null
}); 

export default connect(mapStateToProps)(MainPage); 