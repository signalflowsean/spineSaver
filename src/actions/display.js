import {API_BASE_URL} from '../config'; 
import {normalizeResponseErrors} from './utils'; 

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

export const fetchDisplayData = () => (dispatch, getState, id) => { 
  dispatch(fetchDisplayDataLoading()); 
  
  const authToken = getState().auth.authToken; 
  
  return fetch(`${API_BASE_URL}/display/:${id}`, { 
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

