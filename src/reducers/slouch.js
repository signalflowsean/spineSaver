import { 
  POST_SLOUCH_DATA_LOADING,
  POST_SLOUCH_DATA_SUCCESS,
  POST_SLOUCH_DATA_ERROR 
} from '../actions/slouch'; 

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
  hasCalibrated: false, 
  isLoaded : false,  
  posenet : null,
  feedback : null, 
  instructions : null, 
  loading: '', 
  error: null
}; 

export default function reducer(state = initialState, action){ 
  if (action.type === POST_SLOUCH_DATA_LOADING){
    return Object.assign({}, state, {});  
  } 
  else if (action.type === POST_SLOUCH_DATA_SUCCESS){ 
    return Object.assign({}, state, {})
  }
  else if (action.type === POST_SLOUCH_DATA_ERROR){ 
    return Object.assign({}, state, {});
  }
  return state; 
}