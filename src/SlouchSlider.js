import React from 'react';
import Webcam from 'react-webcam'; 
import * as posenet from '@tensorflow-models/posenet';
import { Stage, Layer, Rect } from 'react-konva';
import './Styles/camCalibStack.css'; 
import {CalculateSlouch} from './Utils/pose'; 
 
export default class SlouchSlider extends React.Component{
  constructor(props){ 
    super(props); 
    
    //image element
    this.image = null;

    this.tempRatio = null; 
    
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
      hasCalibrated : false, 
      distanceToCalibration : null, 
      posenet : null,
      capture : null, 
      feedback : null, 
      instructions : null
    }; 
  }
  
  componentDidMount(){ 
    this.setState({feedback : "isLoading"});
    posenet.load().then(posenet => this.setState(
      {posenet, isLoaded : true, feedback : 'Posenet is loaded', instructions: 'Hit the calibrate button to get started'}));  
  }

  ///WEBCAM METHODS START
  setRef = webcam => { 
    this.webcam = webcam; 
  }; 

  capture = () => { 
    const capture = this.webcam.getScreenshot(); 
    this.setState({capture}, this.findPose(this.image)); 
  };

  onWebcamloaded = () => { 
    setInterval(this.capture, this.frameRate); 
  }

  setImage = (image) => { 
    this.image = image; 
  }
  //WEBCAM MTHODS STOP
  
  findPose = (img) => {     
      this.state.posenet.estimateSinglePose(img, this.imageScaleFactor, this.flipHorizontal, this.outputStride)
        .then((pose) => this.calculateSlouch(pose))
  }

  calculateSlouch = (pose) => {
    if (this.state.hasCalibrated && !this.state.isCalibrating){
      const newRatio = CalculateSlouch(pose);
  
      const slouch = (this.tempRatio / newRatio) -1; 
      console.log(newRatio, this.tempRatio, slouch); 
      this.setState({slouch, feedback: 'is showing realtime slouch amount'}); 
    }
    else if (this.state.isCalibrating){ 
      this.drawBoundingBox(pose.keypoints[1].position, pose.keypoints[2].position, pose.keypoints[5].position, pose.keypoints[6].position); 
    }
  } 

  handleCalibrateButtonClick = () => { 
    if (this.state.isCalibrating){ 
      this.resetValues(); 
    }
    this.setState({
      isCalibrating: !this.state.isCalibrating,
      feedback: 'Is calibrating'  
    }, () => (this.state.isCalibrating) ? 
      this.setState({instructions: 'Move your body into a upright position. Then click the STOP CALIBRATING button.'}) : 
      this.setState({instructions: null, ratio: this.tempRatio, hasCalibrated: true})); 
  }

  resetValues = () => { 
    this.boundingBoxWidth = 0; this.boundingBoxHeight = 0; 
    this.boundingBoxX = 0; this.boundingBoxY = 0;  
  }

  drawBoundingBox = (leftEye, rightEye, leftShoulder, rightShoulder) => {   
    if (this.state.isCalibrating){ 
      this.boundingBoxWidth = rightEye.x - leftEye.x; 
      this.boundingBoxHeight = leftEye.y - leftShoulder.y;
      this.boundingBoxX = leftEye.x; 
      this.boundingBoxY = (leftEye.y - this.boundingBoxHeight); 
      this.tempRatio = this.boundingBoxHeight / this.boundingBoxWidth; 
    } 
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
        <p>{this.state.instructions}
          <input type="button" value={!this.state.isCalibrating? 'CALIBRATE' : 'STOP CALIBRATING'} onClick={() => this.handleCalibrateButtonClick()}></input>
        </p>
        <br></br>
        <p>Slouch Amount: 
          <input 
            type="range" 
            name="slouchSlider" 
            value={this.state.slouch} 
            step=".01" 
            min="0" 
            max="0.5"
            onChange={(e) => console.log(e.currentTarget.value) }
            >
          </input>
        </p>
        <img className="screen-shots" src={this.state.capture} alt="pose" ref={this.setImage} width={this.width} height={this.height}></img>
      </div>
    ); 
  }
}

