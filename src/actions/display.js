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

export const FETCH_CALIBRATION_DATA_SUCCESS_PAYLOAD = 'FETCH_CALIBRATION_DATA_SUCCESS'; 
export const fetchCalibrationSucessPayload = calibration => ({ 
  type: FETCH_CALIBRATION_DATA_SUCCESS_PAYLOAD, 
  calibration
}); 

export const FETCH_CALIBRATION_DATA_SUCCESS_EMPTY = 'FETCH_CALIBRATION_DATA_SUCCESS_EMPTY'; 
export const fetchCalilibrationDataSuccessEmpty = () => ({ 

}); 

export const FETCH_CALIBRATION_DATA_ERROR = 'FETCH_CALIBRATION_DATA_ERROR'; 
export const fetchCalibrationError = () => ({
  type: FETCH_CALIBRATION_DATA_ERROR
}); 

export const fetchDisplayData = (id) => (dispatch, getState) => { 
  dispatch(fetchDisplayDataLoading());   

  //const authToken = getState().auth.authToken; 
  const authToken = loadAuthToken(); 
  
  //console.log('authToken', authToken); 
  return fetch(`${API_BASE_URL}/display/${id}`, { 
    method: 'GET', 
    headers: { 
      Authorization: `Bearer ${authToken}`
    }
  })
    .then(res => normalizeResponseErrors(res))
    .then(res => res.json())
    .then(({data}) => dispatch(fetchDisplayDataSucess(data)))
    .catch(err => { 
      dispatch(fetchDisplayDataError(err))
    }); 
}

export const fetchCalibrationData = (id) => (dispatch, getState) => { 
  //console.log('fetch calibration data')
  dispatch(fetchCalibrationDataLoading()); 

  //const authToken = getState().auth.authToken(); 
  const authToken = loadAuthToken(); 

  return fetch(`${API_BASE_URL}/slouch/calibration/${id}`, { 
    method: 'GET', 
    headers: { 
      Authorization: `Bearer ${authToken}`
    }
  })
    .then(res => normalizeResponseErrors(res))
    .then(res => {
      console.log('got res');  
      res.json(); 
    })
    .then(({data}) => { 
      console.log('fetching calibration data', data); 
      dispatch(fetchCalibrationSucessPayload(data)); 
    })
    .catch(err => { 
      dispatch(fetchCalibrationError(err)); 
    }); 
}; 

