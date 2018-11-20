import React from 'react';
import Webcam from 'react-webcam'; 
import * as posenet from '@tensorflow-models/posenet';
import { Stage, Layer, Rect } from 'react-konva';
import './Styles/camCalibStack.css'; 
import {CalculateSlouch} from './Utils/pose'; 
import Constants from './Utils/constants'; 
import DataContainer from './Utils/dataContainer'; 


export default class SlouchSlider extends React.Component{
  constructor(props){ 
    super(props); 
    
    this.state = { 
      HTMLImage : null, 
      screenCap : null, 
      webcam : null,
      tempSlouch : null, 
      slouch : 0, 
      bBoxHeight : 0, 
      bBoxWidth : 0, 
      bBoxX: 0, 
      bBoxY: 0, 
      isCalibrating: false, 
      hasCalibrated: false, 
      isLoaded : false,  
      posenet : null,
      feedback : null, 
      instructions : null
    }; 
  }
  
  componentDidMount(){ 
    this.setState({feedback : "Loading...", isLoaded : false});

    posenet.load().then(posenet => this.setState({posenet, feedback: 'Loaded', isLoaded: true}));  
  }

  ///WEBCAM METHODS START
  setWebcamRef = webcam => { 
    this.setState({webcam}); 
  };
  
  setScreenShotRef = screenCapHTML => { 
    this.setState({HTMLImage : screenCapHTML}); 
  };

  capture = () => { 
    const capture = this.state.webcam.getScreenshot(); 

    this.setState({capture}, 
      () => this.findPose(this.state.HTMLImage)); 
  };

  onWebcamLoaded = () => { 
    console.log('hi');
    this.setState(
      {feedback : 'Loaded', instructions: 'Hit the CALIBRATE button to get started', isLoaded: true}, 
      () => setInterval(this.capture, Constants.frameRate)); 
  }

  setImage = (image) => { 
    this.image = image; 
  }
  //WEBCAM MTHODS STOP
  
  findPose = (img) => {     
      this.state.posenet.estimateSinglePose(img, 
        Constants.imageScaleFactor, 
        Constants.flipHorizontal, 
        Constants.outputStride)
          .then((pose) => this.calculateSlouch(pose))
  }

  calculateSlouch = (pose) => {
    if (this.state.hasCalibrated && !this.state.isCalibrating){
      const slouch = (this.state.tempSlouch / CalculateSlouch(pose)) -1; 
      this.setState({slouch, feedback: 'Realtime slouch amount is showing.'}); 
      DataContainer(this.state.slouch); 
    }
    else if (this.state.isCalibrating){ 
      this.drawBoundingBox(pose.keypoints[1].position, pose.keypoints[2].position, pose.keypoints[5].position, pose.keypoints[6].position); 
    }
  } 

  handleCalibrateButtonClick = () => { 
    this.setState({
      isCalibrating: !this.state.isCalibrating, feedback: 'Calibrated'  
    }, () => {
      if(!this.state.isCalibrating) {
        //Done calibrating reset values
        this.zeroOutBBoxValues(); 
      }     
      this.state.isCalibrating ? 
      this.setState({feedback : 'Calibrating...', instructions: 'Move your body into a upright position. Then click the STOP CALIBRATING button.'}) : 
      this.setState({instructions: null, hasCalibrated: true }) 
    });
  } 

  zeroOutBBoxValues(){ 
    const leftEye = {x: 0, y: 0}; 
    const rightEye = {x: 0, y: 0}; 
    const leftShoulder = {x: 0, y: 0}; 
    this.drawBoundingBox(leftEye, rightEye, leftShoulder); 
  }

  drawBoundingBox = (leftEye, rightEye, leftShoulder) => {   
      this.setState( {
        boundingBoxWidth : (rightEye.x - leftEye.x),  
        boundingBoxHeight :(leftEye.y - leftShoulder.y),
        boundingBoxX : leftEye.x, 
        boundingBoxY : (leftEye.y - this.state.boundingBoxHeight), 
        tempSlouch : (this.state.boundingBoxHeight / this.state.boundingBoxWidth)
      }); 
  }

  render() { 
    if (this.state.isLoaded === false){ 
      return ( 
        <p>{this.state.feedback}</p>
      ); 
    }

    return ( 
      <div>
        <Stage 
          className={'calibration-stage'} 
          width={Constants.width} 
          height={Constants.height}>
          <Layer>
            {/* USER BOUNDING BOX */}
            <Rect
              x={this.state.boundingBoxX}
              y={this.state.boundingBoxY}
              width={this.state.boundingBoxWidth}
              height={this.state.boundingBoxHeight}
              stroke={'red'}
            />
          </Layer>  
        </Stage>
        <Webcam 
          className={'webcam'}
          audio={false}
          height={Constants.height}
          width={Constants.width}
          screenshotFormat="image/png"
          videoConstraints={Constants.videoConstraints}
          onUserMedia={() => this.onWebcamLoaded()}
          ref={this.setWebcamRef}
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
            >
          </input>
        </p>
        <img className="screen-shots" src={this.state.capture} alt="pose" ref={this.setScreenShotRef} width={Constants.width} height={Constants.height}></img>
      </div>
    ); 
  }
}

