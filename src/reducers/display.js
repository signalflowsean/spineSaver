import { 
  FETCH_DISPLAY_DATA_LOADING, 
  FETCH_DISPLAY_DATA_SUCCESS, 
  FETCH_DISPLAY_DATA_ERROR, 
  FETCH_CALIBRATION_DATA_SUCCESS_PAYLOAD, 
  FETCH_CALIBRATION_DATA_SUCCESS_EMPTY
} from '../actions/display.js'; 

const initialState = {
  error: null, 
  loading : 'false',
  username : '', 
  loggedHours : 0, 
  slouchedHours : 0, 
  improvement : 0, 
  calibVal: null, 
  notCalibrated : null
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
  else if (action.type === FETCH_CALIBRATION_DATA_SUCCESS_PAYLOAD){ 
    return Object.assign({}, state, { calibVal : action.calibration, notCalibrated: false}); 
  }
  else if (action.type === FETCH_CALIBRATION_DATA_SUCCESS_EMPTY){ 
    console.log('farge'); 
    return Object.assign({}, state, {notCalibrated : true})
  }
  return state; 
}