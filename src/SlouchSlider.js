import React from 'react';
import Webcam from 'react-webcam'; 
import * as posenet from '@tensorflow-models/posenet';
import { Stage, Layer, Rect } from 'react-konva';
import './Styles/camCalibStack.css'; 
 
export default class SlouchSlider extends React.Component{
  constructor(props){ 
    super(props); 
    
    //image element
    this.image = null;
    
    //posenet constants
    this.imageScaleFactor = 0.5; 
    this.flipHorizontal = false; 
    this.outputStride = 16;

    //TODO: figure out a reasonable frame rate
    this.frameRate = 50;  

    //constant height and widths
    this.width = 500; 
    this.height = 500; 

    //bounding box
    this.boundingBoxHeight = 0;  
    this.boundingBoxWidth = 0; 
    this.boundingBoxX = 0; 
    this.boundingBoxY = 0;
    
    //constants for webcam
    this.videoConstraints = { 
      width : this.width,  
      height : this.height, 
      facingMode: "user"
    }; 

    this.state = { 
      slouch : 0, 
      ratio : 0, 
      isLoaded : false, 
      isCalibrating : false, 
      distanceToCalibration : null, 
      posenet : null,
      capture : null, 
      feedback : null, 
      instructions : null
    }; 
  }
  
  componentDidMount(){ 
    this.setState({feedback : "isLoading"});
    this.loadPoseNet(); 
  }

  loadPoseNet(){ 
    posenet.load()
      .then((posenet) => { 
        this.setState({
          posenet, isLoaded : true, 
          feedback : 'Posenet is loaded'}); 
      }); 
  }

  setRef = webcam => { 
    this.webcam = webcam; 
  }; 

  capture = () => { 
    const capture = this.webcam.getScreenshot(); 

    //set the screenshot to the state, set the src of html image
    //to the capture, find the pose from the reference of the 
    //html image element
    this.setState({capture}, this.findPose(this.image)); 
  };
  
  findPose = (img) => {     
      this.state.posenet.estimateSinglePose(img, 
        this.imageScaleFactor, 
        this.flipHorizontal, 
        this.outputStride)
          .then((pose) => { 
            this.calculateSlouch(pose);     
      })
  }

  calculateSlouch = (pose) => { 
    //console.log(pose.keypoints); 
    const leftEye = pose.keypoints[1].position; 
    const rightEye = pose.keypoints[2].position; 
    const leftShoulder = pose.keypoints[5].position; 
    const rightShoulder = pose.keypoints[6].position; 

    //TODO: better calculation fro slouch
    const slouch = Math.abs((((leftEye.y - leftShoulder.y) + (rightEye.y - rightShoulder.y))/2)+235); 
    
    //console.log('slouch', slouch);
    this.setState({slouch}); 

    if(this.state.isCalibrating){ 
      this.drawBoundingBox(leftEye, rightEye, leftShoulder, rightShoulder); 
      this.findDistanceToCalibration();
    } 
  } 

  handleCalibrateButtonClick = () => { 
    this.setState({
      isCalibrating: !this.state.isCalibrating, 
      feedback: 'Spine Save is calibrating', 
      instructions : 'Move your body into a upright position, then click the calibrate button again'}); 
  }

  drawBoundingBox = (leftEye, rightEye, leftShoulder, rightShoulder) => {   
    this.boundingBoxWidth = rightEye.x - leftEye.x; 
    this.boundingBoxHeight = leftEye.y - leftShoulder.y;
    
    this.boundingBoxX = leftEye.x; 
    this.boundingBoxY = (leftEye.y - this.boundingBoxHeight); 
  }

  findDistanceToCalibration = () => { 
    const ratio = this.boundingBoxHeight / this.boundingBoxWidth; 
    this.setState({ratio}); 
  }

  onWebcamloaded = () => { 
    setInterval(this.capture, this.frameRate); 
  }

  setImage = (image) => { 
    this.image = image; 
  }

  render() { 
    if (this.state.isLoaded === false){ 
      return ( 
        <p>{this.state.feedback}</p>
      ); 
    }

    return ( 
      <div>
        {/* Stage, Layer and Rect is for rendering calibration visuals */}
        <Stage 
          className={'calibration-stage'} 
          width={this.width} 
          height={this.height}>
          <Layer>
            {/* USER BOUNDING BOX */}
            <Rect
              x={this.boundingBoxX}
              y={this.boundingBoxY}
              width={this.boundingBoxWidth}
              height={this.boundingBoxHeight}
              stroke={'red'}
            />
          </Layer>
        </Stage>
        <Webcam 
          className={'webcam'}
          audio={false}
          height={this.height}
          width={this.width}
          screenshotFormat="image/png"
          videoConstraints={this.videoConstraints}
          onUserMedia={this.onWebcamloaded}
          ref={this.setRef}
        />
        <p>{this.state.feedback}</p>
        <p>{this.state.instructions}</p>
        <input type="button" value="CALIBRATE" onClick={() => this.handleCalibrateButtonClick()}></input>
        <br></br>
        <p>Slouch Amount: 
          <input 
            type="range" 
            name="slouchSlider" 
            value={this.state.slouch} 
            step="1" 
            // The min and max will be provided from the calibration
            min="0" 
            max="60"
            onChange={(e) => console.log(e.currentTarget.value) }
            >
          </input>
        </p>
        <img className="screen-shots" src={this.state.capture} alt="pose" ref={this.setImage} width={this.width} height={this.height}></img>
      </div>
    ); 
  }
}

