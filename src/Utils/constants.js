const width = 500; 
const height = 500; 

const Constants =  {
  imageScaleFactor : 0.5, 
  flipHorizontal : false, 
  outputStride: 16, 
  width, 
  height, 
  frameRate : 50,
  videoConstraints : { 
    width, 
    height, 
    facingMode: 'user'
  }, 
  threshold : 0.42, 
  packetSize: 20
}; 

export default Constants; 