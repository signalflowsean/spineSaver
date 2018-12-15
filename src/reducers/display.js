import { 
  FETCH_DISPLAY_DATA_LOADING, 
  FETCH_DISPLAY_DATA_SUCCESS, 
  FETCH_CALIBRATION_DATA_LOADING, 
  FETCH_DISPLAY_DATA_ERROR, 
  FETCH_CALIBRATION_DATA_SUCCESS_PAYLOAD, 
  FETCH_CALIBRATION_DATA_SUCCESS_EMPTY, 
  RESET_VALS_ON_LOG_OUT
} from '../actions/display.js'; 

const initialState = {
  error: null, 
  loading : 'false',
  username : '', 
  loggedHours : 0, 
  slouchedHours : 0, 
  improvement : 0,
  calibVal: null, 
  isDisplayLoading : true, 
  isCalibLoading : true, 
  hasUserEverCalibrated : false, 
  loggedIn : false, 
};

export default function reducer(state = initialState, action) { 
  if (action.type === FETCH_DISPLAY_DATA_LOADING) { 
    return Object.assign({}, state, { isDisplayLoading : true }); 
  }
  else if (action.type === FETCH_DISPLAY_DATA_SUCCESS) { 
    return Object.assign({}, state, {
      isDisplayLoading : false, 
      username : action.username, 
      loggedHours : action.data.timeElapsed, 
      slouchedHours : action.data.slouchElapsed, 
      improvement : action.data.improvement
    })
  }
  else if (action.type === RESET_VALS_ON_LOG_OUT){ 
    return Object.assign({}, state, {hasUserEverCalibrated : false,  loggedIn: false}); 
  }
  else if (action.type === FETCH_DISPLAY_DATA_ERROR) { 
     return Object.assign({}, state, { isDisplayLoading : false, error: action.error}); 
  }
  else if (action.type === FETCH_CALIBRATION_DATA_LOADING) { 
    return Object.assign({}, state, { isCalibLoading : true, loggedIn : true}); 
  }
  else if (action.type === FETCH_CALIBRATION_DATA_SUCCESS_PAYLOAD){  
    return Object.assign({}, state, { isCalibLoading: false, calibVal : action.calibration, hasUserEverCalibrated: true}); 
  }
  else if (action.type === FETCH_CALIBRATION_DATA_SUCCESS_EMPTY){ 
    return Object.assign({}, state, { isCalibLoading: false, hasUserEverCalibrated : false, feedback: 'Welcome you\'re new here', instructions: 'Please calibrate'}); 
  }
  return state; 
}