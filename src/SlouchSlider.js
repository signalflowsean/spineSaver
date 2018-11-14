import React from 'react';
import Webcam from 'react-webcam'; 

export default function SlouchSlider () { 
  return ( 
    <div>
      <Webcam />
      <input type="range" name="slouchSlider" value="50"  step="1" min="0" max="100"></input>
    </div>
  ); 
}

