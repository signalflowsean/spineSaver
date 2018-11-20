const API_URL = 'http://localhost:8080/api'; 
const size = 10; 
let slouchData = []; 

export default function DataContainer(data) { 
  slouchData.push(data); 
  
  if (slouchData.length === size){ 

    fetch(`${API_URL}/slouchData`, { 
      method: 'post',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({slouchData})
    }).then(res => { 
      return res.json(); 
    }).then(slouchData => {  
      console.log('slouch data', slouchData);
    }).catch(error => { 
      console.log('Error:', error);
    });   
  }
}

