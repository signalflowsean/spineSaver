import Constants from '../Utils/constants'; 

import { 
  POSENET_LOADING, 
  POSENET_SUCCESS, 
  POSENET_ERROR,
  POST_SLOUCH_DATA_ERROR, 
  CLEAR_SCREENSHOT_FRAME_RATE_INTERVAL,
  SET_SCREENSHOT_FRAME_RATE_INTERVAL,
  SET_WEB_CAM_REF, 
  SET_SCREENSHOT_REF,
  TAKE_SCREENSHOT,
  RESET_VALUES, 
  SPINE_SAVER_IS_CALIBRATING,
  UPDATE_BOUNDING_BOX, 
  SETUP_LOADED, 
  WEBCAM_LOADED, 
  HANDLE_CALIBRATE_BUTTON_CLICK,
  NEW_POSE_DATA_POINT, 
  NEW_SLOUCH_DATA_POINT, 
  SLOUCH_CALCULATION_SUCCESS, 
  CALIBRATION_POSTING_SUCCESS
} from '../actions/slouch'; 

import { 
  RESET_VALS_ON_LOG_OUT
} from '../actions/display'; 

const initialState = { 
  interval : null,
  isSlouching : '', 
  HTMLImage : null, 
  screenCap : null, 
  webcam : null,
  tempSlouch : null, 
  slouch : 0, 
  bBoxHeight : 0, 
  bBoxWidth : 0, 
  bBoxX: 0, 
  bBoxY: 0, 
  isCalibrating: false, 
  isLoaded : false,  
  isPosenetLoaded: false, 
  isWebcamLoaded : false,
  posenet : null,
  feedback : 'Please Wait', 
  instructions : null, 
  loading: '', 
  error: null, 
  pose: null,
  calibrateButtonCount: 0,
  hasCalibValUpdatedThisSession : false
}; 

export default function reducer(state = initialState, action){ 
  if (action.type === POSENET_LOADING) { 
    return Object.assign({}, state, { isLoaded: false}); 
  }
  else if (action.type === RESET_VALS_ON_LOG_OUT){ 
    return Object.assign({}, state, {
      hasCalibValUpdatedThisSession:false}); 
  }
  else if (action.type === POSENET_SUCCESS) {  
    return Object.assign({}, state, {isPosenetLoaded : true, posenet: action.posenet}); 
  }
  else if (action.type === POSENET_ERROR) { 
    return Object.assign({}, state, {error: action.error})
  }
  else if (action.type === SET_WEB_CAM_REF) { 
    return Object.assign({}, state, {webcam: action.webcam})
  }
  else if (action.type === SET_SCREENSHOT_REF) { 
    return Object.assign({}, state, {HTMLImage : action.camera})
  }
  else if (action.type === TAKE_SCREENSHOT) { 
    return Object.assign({}, state, {screenCap: action.capture})
  }
  else if (action.type === POST_SLOUCH_DATA_ERROR){ 
    return Object.assign({}, state, {error : action.error});
  }
  else if (action.type === CLEAR_SCREENSHOT_FRAME_RATE_INTERVAL){ 
    return Object.assign({}, state, {interval: clearInterval(state.interval)}); 
  }
  else if (action.type === SET_SCREENSHOT_FRAME_RATE_INTERVAL){ 
    return Object.assign({}, state, {interval : setInterval(action.capture, Constants.frameRate), })
  }
  else if (action.type === RESET_VALUES){ 
    return Object.assign({}, state, {calibrateButtonCount :0, isLoaded: false, feedback :'Loading...'}); 
  }
  else if (action.type === WEBCAM_LOADED) { 
    return Object.assign({}, state, {isWebcamLoaded : true}); 
  }
  else if (action.type === SETUP_LOADED) {  
    return Object.assign({}, state, { feedback : 'Loaded', isLoaded : true, 
      instructions: 'Hit CALIBRATE button'}); 
  }
  else if (action.type === SPINE_SAVER_IS_CALIBRATING) { 
    return Object.assign({}, state, {feedback : 'Calibrating...'}); 
  }
  else if (action.type === NEW_SLOUCH_DATA_POINT) { 
    return Object.assign({}, state, {slouch : action.slouch})
  }
  else if (action.type === CALIBRATION_POSTING_SUCCESS) { 
    //SOMETHING SHOULD GO HERE 
    return Object.assign({}, state, {}); 
  }
  else if (action.type === UPDATE_BOUNDING_BOX) {
    return Object.assign({}, state, {
      bBoxHeight: action.boundingBox.height, 
      bBoxWidth: action.boundingBox.width, 
      bBoxX : action.boundingBox.x, 
      bBoxY : action.boundingBox.y,
      tempSlouch : action.boundingBox.tempSlouch
    }); 
  }

  else if (action.type === HANDLE_CALIBRATE_BUTTON_CLICK) { 
    let bBoxX = state.bBoxX; 
    let bBoxY = state.bBoxY; 
    let bBoxWidth = state.bBoxWidth; 
    let bBoxHeight = state.bBoxHeight; 
    let tempSlouch = state.tempSlouch; 
    let feedback = state.feedback; 
    let instructions = state.instructions; 
    let hasCalibValUpdatedThisSession = state.hasCalibValUpdatedThisSession; 

    if (!state.isCalibrating){ 
      feedback = 'Calibrating...';
      instructions = 'Sit up straight. \nThen click the STOP CALIBRATING button.'
    }
    else if (state.isCalibrating && state.isLoaded){ 
      instructions = 'Hit the CALIBRATE button to get started'; 
    }
  
    if (state.calibrateButtonCount >= 1){ 
      feedback = 'Calibrated'
      hasCalibValUpdatedThisSession = true; 
      instructions = 'You calibrated! Click the Dashboard link!'
      bBoxHeight = 0;  
      bBoxWidth = 0; 
      bBoxY = 0;
      bBoxX = 0;  
      tempSlouch = 0; 
    }
      
    return Object.assign({}, state, {
      isCalibrating : !state.isCalibrating,
      feedback, 
      hasCalibValUpdatedThisSession,
      instructions,
      bBoxHeight, 
      bBoxWidth, 
      tempSlouch,
      bBoxY, 
      bBoxX, 
      calibrateButtonCount : (state.calibrateButtonCount + 1) 
    }); 
  }
  else if (action.type === NEW_POSE_DATA_POINT) { 
    return Object.assign({}, state, {pose : action.pose}); 
  }
  else if (action.type === SLOUCH_CALCULATION_SUCCESS) { 
    return Object.assign({}, state); 
  }
  
  return state; 
}