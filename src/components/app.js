import React from 'react'; 
import {connect} from 'react-redux'; 
import {Route, withRouter} from 'react-router-dom'; 

import MainPage from './mainPage'; 
import SignUpPage from './signUpPage'; 
import Display from './dashboard'; 
import SlouchSlider from './SlouchSlider'; 
import LoginPage from './loginPage'; 

import {refreshAuthToken} from '../actions/auth'; 

import '../Styles/app.css'

export class App extends React.Component { 

  componentDidUpdate(nextProps) { 
    //Logged in refresh page
    if (nextProps.loggedIn && !this.props.loggedIn) { 
      this.startPeriodicRefresh(); 
    } else if (!nextProps.loggedIn && this.props.loggedIn) { 
      this.startPeriodicRefresh(); 
    }
  }

  componentWillUnmount(){ 
    this.stopPeriodicRefresh(); 
  }

  startPeriodicRefresh(){ 
    this.refreshInterval = setInterval(
      () => this.props.dispatch(refreshAuthToken()), 
      60 * 60 * 1000
    ); 
  }

  stopPeriodicRefresh() { 
    if(!this.refreshInterval) {
      return; 
    }

    clearInterval(this.refreshInterval); 
  }

  render() { 
    return (
      <div> 
        <Route exact path="/" component={MainPage} />
        <Route exact path="/home" component={Display} />
        <Route exact path="/settings" component={SlouchSlider} />
        <Route exact path="/signup" component={SignUpPage} />
        <Route exact path="/login" component={LoginPage} />
      </div>
    ); 
  }
}

const mapStateToProps = state => ({ 
  hasAuthToken: state.auth.authToken !== null,
  loggedIn: state.auth.currentUSer !== null
}); 

export default withRouter(connect(mapStateToProps)(App)); 
