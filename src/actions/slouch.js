import {API_BASE_URL} from '../config'; 
import {loadAuthToken} from '../local-storage'; 

export const POST_SLOUCH_DATA_LOADING = 'POST_SLOUCH_DATA_LOADING'; 
export const postSlouchDataLoading = () => ({ 
  type: POST_SLOUCH_DATA_LOADING
}); 

export const POST_SLOUCH_DATA_SUCCESS = 'POST_SLOUCH_DATA_SUCCESS'; 
export const postSlouchDataSuccess = data => ({ 
  type: POST_SLOUCH_DATA_SUCCESS,
  data
}); 

export const POST_SLOUCH_DATA_ERROR = 'POST_SLOUCH_DATA_ERROR'; 
export const postSlouchDataError = error => ({ 
  type: POST_SLOUCH_DATA_ERROR, 
  error
});

export const POSENET_LOADING = 'POSENET_LOADING'; 
export const posenetLoading = () => ({ 
  type: POSENET_LOADING
}); 

export const POSENET_SUCCESS = 'POSENET_SUCCESS'; 
export const posenetSuccess = posenet => ({ 
  type: POSENET_SUCCESS, 
  posenet
});

export const POSENET_ERROR = 'POSENET_ERROR'; 
export const posenetError = error => ({ 
  type: POSENET_ERROR, 
  error
}); 

export const SLOUCH_CALCULATION_LOADING = 'SLOUCH_CALCULATION_LOADING'; 
export const slouchCalculationLoading = capture => ({ 
  type: SLOUCH_CALCULATION_LOADING, 
  capture
}); 

export const SLOUCH_CALCULATION_SUCCESS = 'SLOUCH_CALCULATION_SUCCESS'; 
export const slouchCalculationSuccess = slouch => ({ 
  type: SLOUCH_CALCULATION_SUCCESS, 
  slouch
}); 

export const SLOUCH_CALCULATION_ERROR = 'SLOUCH_CALCULATION_ERROR'; 
export const slouchCalculationError = error => ({ 
  type: SLOUCH_CALCULATION_ERROR, 
  error
}); 

export const CLEAR_SCREENSHOT_FRAME_RATE_INTERVAL = 'CLEAR_SCREENSHOT_FRAME_RATE_INTERVAL'; 
export const clearScreenshotFrameRateInterval = () => ({ 
  type: CLEAR_SCREENSHOT_FRAME_RATE_INTERVAL 
}); 

export const SET_SCREENSHOT_FRAME_RATE_INTERVAL = 'SET_SCREENSHOT_FRAME_RATE_INTERVAL'; 
export const setScreenshotFrameRateInterval = (capture) => ({ 
  type: SET_SCREENSHOT_FRAME_RATE_INTERVAL, 
  capture
}); 

export const SET_WEB_CAM_REF = 'SET_WEB_CAM_REF'; 
export const setWebCamRef = webcam => ({ 
  type: SET_WEB_CAM_REF, 
  webcam
}); 

export const SET_SCREENSHOT_REF = 'SET_SCREENSHOT_REF'; 
export const setScreenShotRef = camera => ({ 
  type: SET_SCREENSHOT_REF, 
  camera
}); 

export const TAKE_SCREENSHOT = 'TAKE_SCREENSHOT'; 
export const takeScreenShot = capture => ({ 
  type: TAKE_SCREENSHOT, 
  capture
});

export const NEW_SLOUCH_DATA_POINT = 'NEW_SLOUCH_DATA_POINT'; 
export const newSlouchDataPoint = slouch => ({ 
  type: NEW_SLOUCH_DATA_POINT, 
  slouch
}); 

export const UPDATE_SLOUCH_BEHAVIOR = 'UPDATE_SLOUCH_BEHAVIOR'; 
export const updateSlouchBehavior = behavior => ({ 
  type: UPDATE_SLOUCH_BEHAVIOR, 
  behavior
});

export const SPINE_SAVER_IS_CALIBRATING = 'SPINE_SAVER_IS_CALIBRATING'; 
export const spineSaverIsCalibrating = () => ({ 
  type: SPINE_SAVER_IS_CALIBRATING
}); 

export const RESET_VALUES = 'RESET_VALUES'
export const resetValues = () => ({ 
  type: RESET_VALUES
}); 

export const HANDLE_CALIBRATE_BUTTON_CLICK = 'HANDLE_CALIBRATE_BUTTON_CLICK'; 
export const handleCalibrateButtonClick = () => ({ 
  type: HANDLE_CALIBRATE_BUTTON_CLICK
}); 

export const UPDATE_BOUNDING_BOX = 'UPDATE_BOUNDING_BOX'; 
export const updateBoundingBox = boundingBox => ({ 
  type: UPDATE_BOUNDING_BOX, 
  boundingBox
}); 

export const UPDATE_BOUNDING_BOX_TEMP_SLOUCH = 'UPDATE_BOUNDING_BOX_TEMP_SLOUCH'; 
export const updateBoundingBoxTempSlouch = tempSlouch => ({ 
  type: UPDATE_BOUNDING_BOX_TEMP_SLOUCH, 
  tempSlouch
}); 

export const WEBCAM_LOADED = 'WEBCAM_LOADED'; 
export const webcamLoaded = () => ({ 
  type: WEBCAM_LOADED
}); 

export const SETUP_LOADED = 'SETUP_LOADED'; 
export const setupLoaded = () => ({ 
  type: SETUP_LOADED
}); 

export const CALIBRATION_POSTING_LOADING = 'CALIBRATION_POSTING_LOADING'; 
export const calibrationPotsingLoading = () => ({ 
  type: CALIBRATION_POSTING_LOADING 
});  

export const CALIBRATION_POSTING_SUCCESS = 'CALIBRATION_POSTING_SUCCESS'; 
export const calibrationPostingSuccess = () => ({ 
  type: CALIBRATION_POSTING_SUCCESS
}); 

export const CALIBRATION_POSTING_ERROR = 'CALIBRATION_POSTING_ERROR'; 
export const calibrationPostingError = () => ({ 
  type: CALIBRATION_POSTING_ERROR
}); 

export const ZERO_OUT_CALIBRATION_BUTTON_COUNT = 'ZERO_OUT_CALIBRATION_BUTTON_COUNT'; 
export const zeroOutCalibrationButtonCount = () => ({ 
  type: ZERO_OUT_CALIBRATION_BUTTON_COUNT
}); 

export const postSlouchData = (slouchDataObj) => (dispatch) => { 
  const {slouch} = slouchDataObj; 
  const authToken = loadAuthToken(); 
  
  if (!Array.isArray(slouch)){ 
    console.error('Error: Slouch must be an array slouches'); 
    return; 
  }
  
  dispatch(postSlouchDataLoading); 
  fetch(`${API_BASE_URL}/slouch`, { 
    method: 'post',
    headers: {'Content-Type':'application/json', Authorization: `Bearer ${authToken}`},
    body: JSON.stringify({slouch}),  
  }).then(res => {
    return res.json(); 
  }).then(slouchData => {  
    dispatch(postSlouchDataSuccess(slouchData)); 
  }).catch(error => { 
    console.log('Error:', error);
    dispatch(postSlouchDataError(error)); 
  });

} 

export const postCalibrationData = (calibrationData) => (dispatch) => { 
  dispatch(calibrationPotsingLoading()); 
 
  const authToken = loadAuthToken(); 
  const {calibrateVal} = calibrationData; 
  
  fetch(`${API_BASE_URL}/slouch/calibration`, { 
    method: 'post', 
    headers: {'Content-Type': 'application/json',  Authorization: `Bearer ${authToken}`}, 
    body: JSON.stringify({calibrateVal}), 
  }).then(res => { 
    return res.json(); 
  }).then(calibrationData => { 
    dispatch(calibrationPostingSuccess())
  }).catch(error => { 
    dispatch(calibrationPostingError())
    console.error('Error post calibration data to backend', error); 
  })
  
}
