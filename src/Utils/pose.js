//import * as posenet from '@tensorflow-models/posenet';

export function CalculateSlouch(pose){ 
  
  const leftEye = pose.keypoints[1].position; 
  const rightEye = pose.keypoints[2].position; 
  const leftShoulder = pose.keypoints[5].position; 
  //const rightShoulder = pose.keypoints[6].position; 

  const currBoundingBoxWidth = rightEye.x - leftEye.x; 
  const currBoundingBoxHeight = leftEye.y - leftShoulder.y;
  
  const newRatio = currBoundingBoxHeight/currBoundingBoxWidth;  
  return newRatio; 
  
}

export function CalculatePose(img){ 

}