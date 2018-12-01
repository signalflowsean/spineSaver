import React from 'react'; 
import {Field, reduxForm, focus} from 'redux-form'; 
import Input from './input'; 
import {login} from '../actions/auth'; 
import {required, nonEmpty} from '../validators'; 
import '../Styles/login.css'; 
export class Login extends React.Component{ 
  onSubmit(values) { 
    return this.props.dispatch(login(values.username, values.password)); 
  }

  render(){ 
    let error; 
    if (this.props.error) { 
      error = (
        <div>{this.props.error}</div>
      )
    }
    
    return (
      <form onSubmit={this.props.handleSubmit(values => this.onSubmit(values))}>
        {error}
        <label htmlFor="username">Username</label>
        <Field 
          component={Input} 
          type="text" 
          placeholder="urUsername" 
          name="username"
          id="username"
          validate ={[required, nonEmpty]}>
        </Field>
        <label htmlFor="password">Password</label>
        <Field 
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
      </form>
    ); 
  }
}

export default reduxForm({ 
 form: 'login', 
 onSubmitFail: (errors, dispatch) => dispatch(focus('login', 'username')) 
})(Login); 