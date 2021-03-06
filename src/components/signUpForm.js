import React from 'react'; 
import { Redirect } from 'react-router-dom';  
import {Field, reduxForm, focus } from 'redux-form'; 
import { signUpUser } from '../actions/signup'; 
import {login} from '../actions/auth'; 
import Input from './input'
import {required, nonEmpty, length, isTrimmed} from '../validators'; 
const passwordLength = length({min: 10, max: 72}); 

export class SignUpForm extends React.Component{ 
  constructor(props){
    super(props) 
    this.state = { 
      redirect: false, 
      error: null
    }
  }
  onSubmit(values) { 
    const {username, password, fullname} = values; 
    const user = {username, password, fullname}; 

    this.props 
      .dispatch(signUpUser(user))
      .then(() => this.props.dispatch(login(username, password)))
      .then(() => this.setState({redirect: true}))
      .catch(error => this.setState(error));  
  }

  render(){ 
    if (this.state.redirect) return <Redirect to='/settings' />
    return (
      <form onSubmit={this.props.handleSubmit(values => this.onSubmit(values))}>
        <label htmlFor="fullName">Full Name</label>
        <Field 
          className="signup-form"
          component={ Input } 
          type="text" 
          placeholder="Jane Doe" 
          name="fullname"
          validate={ [required, nonEmpty, isTrimmed] }>
        </Field>
        <label htmlFor="username">Username</label>
        <Field
          className="signup-form"
          component={ Input }
          type="text" 
          placeholder="JayD23" 
          name="username"
          validate={[required, nonEmpty, isTrimmed]}>
        </Field>
        <label htmlFor="password ">Password</label>
        <Field 
          className="signup-form"
          component={ Input }
          type="password" 
          placeholder="password123"
          name="password"
          validate={[required, passwordLength, isTrimmed]}>
        </Field>
        <button
          type="submit"
          disabled={this.props.pristine || this.props.submitting}>
          Register
        </button>
      </form>
    ); 
  }
}

export default reduxForm({
  form: 'registration', 
  onSubmitFail: (errors, dispatch) => 
    dispatch(focus('registration', Object.keys(errors)[0]))
})(SignUpForm); 