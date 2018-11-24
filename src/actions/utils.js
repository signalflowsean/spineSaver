

export const normalizeResponseErrors = res => { 
  if (!res.ok) { 
    if ( 
      res.headers.has('content-type') && 
      res.headers.has('content-type').startsWith('application/json')
    ) { 
      //A decable json error
      return res.json().then(err => Promise.reject(err)); 
    }
    
    //Hard to decode error
    return Promise.reject({ 
      code: res.status, 
      mesage: res.statusText
    }); 
  }
  return res; 
}