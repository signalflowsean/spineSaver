import { 
  FETCH_DISPLAY_DATA_LOADING, 
  FETCH_DISPLAY_DATA_SUCCESS, 
  FETCH_CALIBRATION_DATA_LOADING, 
  FETCH_DISPLAY_DATA_ERROR, 
  FETCH_CALIBRATION_DATA_SUCCESS_PAYLOAD, 
  FETCH_CALIBRATION_DATA_SUCCESS_EMPTY, 
} from '../actions/display.js'; 

const initialState = {
  error: null, 
  loading : 'false',
  username : '', 
  loggedHours : 0, 
  slouchedHours : 0, 
  improvement : 0,
  calibVal: null, 
  isDisplayLoading : false, 
  isCalibLoading : false,
  isCalibrated : null
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
  else if (action.type === FETCH_CALIBRATION_DATA_LOADING) { 
    return Object.assign({}, state, { isCalibLoading : true, isCalibrated : null}); 
  }
  else if (action.type === FETCH_DISPLAY_DATA_ERROR) { 
     return Object.assign({}, state, { error: action.error})
  }
  else if (action.type === FETCH_CALIBRATION_DATA_SUCCESS_PAYLOAD){  
    console.log('calibration'); 
    return Object.assign({}, state, { isCalibLoading: false, calibVal : action.calibration, isCalibrated: true}); 
  }
  else if (action.type === FETCH_CALIBRATION_DATA_SUCCESS_EMPTY){ 
    console.log('Getting empty calibration data?'); 
    return Object.assign({}, state, { isCalibLoading: false, isCalibrated : false, feedback: 'Welcome you\'re new here', instructions: 'Please calibrate'}); 
  }
  return state; 
}