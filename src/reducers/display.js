import { 
  FETCH_DISPLAY_DATA_LOADING, 
  FETCH_DISPLAY_DATA_SUCCESS, 
  FETCH_DISPLAY_DATA_ERROR
} from '../actions/display.js'; 

const initialState = {
  error: null, 
  loading : 'false',
  username : '', 
  loggedHours : 0, 
  slouchedHours : 0, 
  improvement : 0
};

export default function reducer(state = initialState, action) { 
  if (action.type === FETCH_DISPLAY_DATA_LOADING) { 
    return Object.assign({}, state, {loading : true}); 
  }
  else if (action.type === FETCH_DISPLAY_DATA_SUCCESS) { 
    return Object.assign({}, state, {
      loading : false, 
      username : action.username, 
      loggedHours : action.loggedHours, 
      slouchedHours : action.slouchedHours, 
      improvement : action.improvement
    })
  }
  else if (action.type === FETCH_DISPLAY_DATA_ERROR) { 
     return Object.assign({}, state, { error: action.error})
  }
}