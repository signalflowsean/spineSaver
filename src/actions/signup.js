import {SubmissionError} from 'redux-form'; 

import {API_BASE_URL} from '../config';
import {normalizeResponseErrors} from './utils'; 

export const signUpUser = user => dispatch => {
  console.log('user', user); 
  return fetch(`${API_BASE_URL}/signup`, { 
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify(user)
  })
    .then(res => normalizeResponseErrors(res))
    .then(res => res.json())
    .catch(err => { 
      const {reason, message, location} = err; 
      if( reason === 'ValidationError') { 
        return Promise.reject(
          new SubmissionError({ 
            [location] : message 
          })
        ); 
      }
    }); 
  }; 