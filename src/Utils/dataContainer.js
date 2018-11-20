import {API_BASE_URL} from '../config'; 
const size = 10; 
let slouchData = []; 

export default function DataContainer(data) { 
  slouchData.push(data); 
  //TODO: there's a bit of odd asyncronicity
  //console.log(slouchData.length);
  if (slouchData.length === size){ 
    fetch(`${API_BASE_URL}/slouchData`, { 
      method: 'post',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({slouchData})
    }).then(res => {
      return res.json(); 
    }).then(slouchData => {  
      //console.log('Slouch Data: ', JSON.stringify(slouchData)); 
    }).catch(error => { 
      console.log('Error:', error);
    });
    
    slouchData = [];    
  }
}

