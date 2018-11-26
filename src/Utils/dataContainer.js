import {API_BASE_URL} from '../config'; 
const size = 10; 
let slouchData = []; 

export default function DataContainer(data) { 
  slouchData.push(data); 
  //console.log(slouchData.length, slouchData);
  if (slouchData.length === size) { 
    //dispatch action
    slouchData = []; 
  }
}

