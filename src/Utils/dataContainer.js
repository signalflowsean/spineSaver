
const API_URL = 'http://localhost:8080/api/hi'; 
let slouchData = []; 

export default function DataContainer(data) { 
  slouchData.push(data); 
  
  //printData(); 
  if (slouchData.length === 10){ 
    console.log('making a post request');
    //POST REQUEST
    slouchData = []; 
  }
}

function printData(){ 
  console.log(JSON.stringify(slouchData));
}