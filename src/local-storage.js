export const loadAuthToken = () => { 
  const auth = localStorage.getItem('authToken'); 
  console.log('load auth', auth)
  return localStorage.getItem('authToken');
}; 

export const saveAuthToken = authToken => { 
  console.log('save auth', authToken)
  try { 
    localStorage.setItem('authToken', authToken);
    console.log('saved', authToken); 
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