import {API_BASE_URL} from '../config'; 
import {normalizeResponseErrors} from './utils'; 

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

export const CLEAR_SCREENSHOT_FRAME_RATE_INTERVAL = 'CLEAR_SCREENSHOT_FRAME_RATE_INTERVAL'; 
export const clearScreenshotFrameRateInterval = () => ({ 
  type: CLEAR_SCREENSHOT_FRAME_RATE_INTERVAL 
}); 

export const SET_SCREENSHOT_FRAME_RATE_INTERVAL = 'SET_SCREENSHOT_FRAME_RATE_INTERVAL'; 
export const setScreenshotFrameRateInterval = () => ({ 
  type: SET_SCREENSHOT_FRAME_RATE_INTERVAL
}); 

export const POSENET_IS_LOADING = 'POSENET_IS_LOADING'; 
export const posenetIsLoading = () => ({ 
  type: POSENET_IS_LOADING
}); 

export const POSENET_IS_LOADED = 'POSENET_IS_LOADED'; 
export const posenetISLoading = () => ({ 
  type: POSENET_IS_LOADED
});

export const SET_WEB_CAM_REF = 'SET_WEB_CAM_REF'; 
export const setWebCamREf = () => ({ 
  type: SET_WEB_CAM_REF
}); 

export const SET_SCREENSHOT_REF = 'SET_SCREENSHOT_REF'; 
export const setScreenShotRef = () => ({ 
  type: SET_SCREENSHOT_REF
}); 

export const TAKE_SCREENSHOT = 'TAKE_SCREENSHOT'; 
export const takeScreenShot = () => ({ 
  type: TAKE_SCREENSHOT
});

export const SHOW_SLOUCH_ALERT = 'SHOW_SLOUCH_ALERT'; 
export const showSlouchAlert = () => ({ 
  type: SHOW_SLOUCH_ALERT
});

export const SPINE_SAVER_HAS_CALIBRATED = 'SPINE_SAVER_HAS_CALIBRATED'; 
export const spineSaverHasCalibrated = () => ({ 
  type: SPINE_SAVER_HAS_CALIBRATED
}); 

export const SPINE_SAVER_IS_CALIBRATING = 'SPINE_SAVER_IS_CALIBRATING'; 
export const spineSaverIsCalibrating = () => ({ 
  type: SPINE_SAVER_IS_CALIBRATING
}); 

export const UPDATE_BOUNDING_BOX = 'UPDATE_BOUNDING_BOX'; 
export const updateBoundingBox = () => ({ 
  type: UPDATE_BOUNDING_BOX
})

export const postSlouchData = (slouchData) => (dispatch, getState) => { 
  dispatch(postSlouchDataLoading); 
  fetch(`${API_BASE_URL}/slouch`, { 
    method: 'post',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({slouchData})
  }).then(res => {
   //console.log('res', res);
    return res.json(); 
  }).then(slouchData => {  
    //console.log('Slouch Data: ', JSON.stringify(slouchData)); 
    dispatch(postSlouchDataSuccess(slouchData)); 
  }).catch(error => { 
    console.log('Error:', error);
    dispatch(postSlouchDataError(error)); 
  });
} 