import { 
  FETCH_DISPLAY_DATA_LOADING, 
  FETCH_DISPLAY_DATA_SUCCESS, 
  FETCH_DISPLAY_DATA_ERROR, 
  FETCH_CALIBRATION_DATA_SUCCESS_PAYLOAD, 
  FETCH_CALIBRATION_DATA_SUCCESS_EMPTY, 
  USER_HAS_CALIBRATED
} from '../actions/display.js'; 

const initialState = {
  error: null, 
  loading : 'false',
  username : '', 
  loggedHours : 0, 
  slouchedHours : 0, 
  improvement : 0, 
  calibVal: null, 
  notCalibrated : true
};

export default function reducer(state = initialState, action) { 
  if (action.type === FETCH_DISPLAY_DATA_LOADING) { 
    return Object.assign({}, state, {loading : true}); 
  }
  else if (action.type === FETCH_DISPLAY_DATA_SUCCESS) { 
    return Object.assign({}, state, {
      loading : false, 
      username : action.username, 
      loggedHours : action.data.timeElapsed, 
      slouchedHours : action.data.slouchElapsed, 
      improvement : action.data.improvement
    })
  }
  else if (action.type === FETCH_DISPLAY_DATA_ERROR) { 
     return Object.assign({}, state, { error: action.error})
  }
  else if (action.type === FETCH_CALIBRATION_DATA_SUCCESS_PAYLOAD){ 
    return Object.assign({}, state, { calibVal : action.calibration, notCalibrated: false}); 
  }
  else if (action.type === FETCH_CALIBRATION_DATA_SUCCESS_EMPTY){ 
    return Object.assign({}, state, {}); 
  }
  else if (action.type === USER_HAS_CALIBRATED) { 
    return Object.assign({}, state, {notCalibrated : false}); 

  }
  //USER HAS CALIBRATED
  return state; 
}