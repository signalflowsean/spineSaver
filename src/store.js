import {createStore, applyMiddleware, combineReducers} from 'redux'; 
import thunk from 'redux-thunk'; 
import {loadAuthToken} from './local-storage'; 
import {reducer as fromReducer} from 'redux-form'; 
import authReducer from './reducers/auth'; 
import displayReducer from './reducers/display';
import slouchReducer from './reducers/slouch';  
import {setAuthToken, refreshAuthToken} from './actions/auth'; 

const store = createStore(
  combineReducers({ 
    form: fromReducer, 
    auth: authReducer, 
    display: displayReducer, 
    slouch: slouchReducer
  }), 
  applyMiddleware(thunk)
); 

const authToken = loadAuthToken(); 
if (authToken) { 
  const token = authToken; 
  store.dispatch(setAuthToken(token)); 
  store.dispatch(refreshAuthToken()); 
}

export default store; 