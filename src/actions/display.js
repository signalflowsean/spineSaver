import {API_BASE_URL} from '../config'; 
import {normalizeResponseErrors} from './utils'; 
import {loadAuthToken} from '../local-storage'; 

export const FETCH_DISPLAY_DATA_LOADING = 'FETCH_DISPLAY_DATA_LOADING'; 
export const fetchDisplayDataLoading = () => ({ 
  type: FETCH_DISPLAY_DATA_LOADING
}); 

export const FETCH_DISPLAY_DATA_SUCCESS = 'FETCH_DISPLAY_DATA_SUCCESS'; 
export const fetchDisplayDataSucess = data => ({ 
  type: FETCH_DISPLAY_DATA_SUCCESS, 
  data
}); 

export const FETCH_DISPLAY_DATA_ERROR = 'FETCH_DISPLAY_DATA_ERROR'; 
export const fetchDisplayDataError = error => ({ 
  type: FETCH_DISPLAY_DATA_ERROR, 
  error
}); 

export const FETCH_CALIBRATION_DATA_LOADING = 'FETCH_CALIBRATION_DATA_LOADING'; 
export const fetchCalibrationDataLoading = () => ({ 
  type: FETCH_CALIBRATION_DATA_LOADING
}); 

export const FETCH_CALIBRATION_DATA_SUCCESS_PAYLOAD = 'FETCH_CALIBRATION_DATA_PAYLOAD'; 
export const fetchCalibrationSucessPayload = calibration => ({ 
  type: FETCH_CALIBRATION_DATA_SUCCESS_PAYLOAD, 
  calibration
}); 

export const FETCH_CALIBRATION_DATA_SUCCESS_EMPTY = 'FETCH_CALIBRATION_DATA_SUCCESS_EMPTY'; 
export const fetchCalilibrationDataSuccessEmpty = () => ({ 
  type: FETCH_CALIBRATION_DATA_SUCCESS_EMPTY
}); 

export const FETCH_CALIBRATION_DATA_ERROR = 'FETCH_CALIBRATION_DATA_ERROR'; 
export const fetchCalibrationError = () => ({
  type: FETCH_CALIBRATION_DATA_ERROR
}); 

export const fetchDisplayData = (id) => (dispatch, getState) => { 
  dispatch(fetchDisplayDataLoading());   
  
  const authToken = loadAuthToken(); 
  
  return fetch(`${API_BASE_URL}/display/${id}`, { 
    method: 'GET', 
    headers: { 
      Authorization: `Bearer ${authToken}`
    }
  })
    .then(res => normalizeResponseErrors(res))
    .then(res => res.json())
    .then((data) => { 
      // console.log('display data', data); 
      dispatch(fetchDisplayDataSucess(data)); 
    })
    .catch(err => { 
      console.log('Error fetching display data: ', err); 
      dispatch(fetchDisplayDataError(err))
    }); 
}

export const fetchCalibrationData = (id) => (dispatch, getState) => { 
  //console.log('fetchingCalibrationData')
  dispatch(fetchCalibrationDataLoading()); 

  const authToken = loadAuthToken(); 

  return fetch(`${API_BASE_URL}/slouch/calibration/${id}`, { 
    method: 'GET', 
    headers: { 
      Authorization: `Bearer ${authToken}`
    }
  })
    .then(res => normalizeResponseErrors(res))
    .then(res => res.json()) 
    .then((data) => {
 
      if (data.calibrationValue > 0){ 
        console.log('calibrationValue', data.calibrationValue);  
        dispatch(fetchCalibrationSucessPayload(data.calibrationValue)); 
      }
      else  if (data.calibrationValue === 0){ 
        dispatch(fetchCalilibrationDataSuccessEmpty())
      }
    })
    .catch(err => { 
      dispatch(fetchCalibrationError(err)); 
    }); 
}; 

