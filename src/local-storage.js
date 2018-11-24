export const loadAuthToken = () => { 
  return localStorage.getItem('authToken'); 
}; 

export const saveAuthToken = authToken => { 
  try { 
    localStorage.setItem('authToken', authToken); 
  } catch (e) { 
    // eslint-disable-next-line no-console
    console.error('Error with saving auth token:', e); 
  } 
}; 

export const clearAuthToken = () => { 
  try { 
    localStorage.removeItem('authToken'); 
  } catch(e){ 
    // eslint-disable-next-line no-console
    console.error('Error with clearing auth token:', e); 
  }
}