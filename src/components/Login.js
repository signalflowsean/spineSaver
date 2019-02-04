import React from 'react'; 
import { Redirect } from 'react-router-dom'; 
import {Field, reduxForm, focus} from 'redux-form'; 
import Input from './input'; 
import {login} from '../actions/auth'; 
import {required, nonEmpty} from '../validators'; 
import '../Styles/login.css'; 
export class Login extends React.Component{ 
  constructor(props){
    super(props) 
    this.state = { 
      redirect: false, 
      error: null
    }
  }
  onSubmit(values) { 
    this.props.dispatch(login(values.username, values.password))
    .then(() => this.setState({redirect : true}))
    .catch(error => this.setState({error}));  
  }

  render(){ 
    if (this.state.redirect) return <Redirect to='home' />; 

    let error; 
    if (this.props.error) { 
      error = (<div>{this.props.error}</div>)
    }
    
    return (
      <section>
        <form onSubmit={this.props.handleSubmit(values => this.onSubmit(values))}>
          {error}
          <label htmlFor="username">Username</label>
          <Field 
            className="login-form"
            component={Input} 
            type="text" 
            placeholder="username" 
            name="username"
            id="username"
            validate ={[required, nonEmpty]}>
          </Field>
          <label htmlFor="password">Password</label>
          <Field 
            className="login-form"
            component={Input}
            type="password" 
            placeholder="urPassword" 
            name="password"
            id="password"
            validate ={[required, nonEmpty]}>
          </Field>
          <button disabled={this.props.pristine || this.props.submitting}>
            Log in
          </button>
          <div className="centerTitle">
          <p>Demo Account: Username: demo, Password: password123</p>
          </div>
        </form>
      </section>
    ); 
  }
}



export default reduxForm({ 
 form: 'login', 
 onSubmitFail: (errors, dispatch) => dispatch(focus('login', 'username')) 
})(Login); 