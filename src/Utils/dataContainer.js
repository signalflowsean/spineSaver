import {API_BASE_URL} from '../config'; 
const size = 10; 
let slouchData = []; 

export default function DataContainer(data) { 
  slouchData.push(data); 
  //console.log(slouchData.length, slouchData);
  if (slouchData.length === size){ 
    fetch(`${API_BASE_URL}/slouchData`, { 
      method: 'post',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({slouchData})
    }).then(res => {
      console.log('res', res);
      return res.json(); 
    }).then(slouchData => {  
      console.log('Slouch Data: ', JSON.stringify(slouchData)); 
    }).catch(error => { 
      console.log('Error:', error);
    });
    
    slouchData = [];    
  }
}

