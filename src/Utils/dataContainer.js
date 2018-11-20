const API_URL = 'http://localhost:8080/api'; 
let slouchData = []; 

export default function DataContainer(data) { 
  slouchData.push(data); 
  
  printData(); 
  if (slouchData.length === 10){ 
    console.log('making a post request');
    //POST REQUEST
    postData(`${API_URL}/slouchData`, {slouchData})
      .then(data => { 
        console.log(data.data)
        //clearData
        slouchData = []; 
      })
      .catch(error => { 
        console.log('there is an error:', error);
      }); 
  }
}
function postData(url = '', data = {}) { 
  return fetch(url, { 
    method: "POST", 
    mode: "cors"
  })
  .then(res => res.json()); 
}

function printData(){ 
  //console.log(JSON.stringify(slouchData));
}