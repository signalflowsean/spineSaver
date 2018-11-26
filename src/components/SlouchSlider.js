import React from 'react';
import Webcam from 'react-webcam'; 
import * as posenet from '@tensorflow-models/posenet';  
import { Stage, Layer, Rect } from 'react-konva';
import { connect } from 'react-redux'; 
import { Link } from 'react-router-dom'; 
import requiresLogin from './requires-login'; 
import {CalculateSlouch} from '../Utils/pose'; 
import '../Styles/camCalibStack.css'; 
import Constants from '../Utils/constants'; 
import {
  handleCalibrateButtonClick,
  setWebCamRef, 
  setScreenShotRef, 
  showSlouchCompliment, 
  showSlouchReprimand,
  newPoseDataPoint, 
  postSlouchData, 
  posenetSuccess, 
  posenetError,
  updateBoundingBox, 
  webcamLoaded,
  takeScreenShot, 
  setupLoaded
} from '../actions/slouch'; 

export class SlouchSlider extends React.Component{

  setWebcamRef = webcam => { 
    this.props.dispatch(setWebCamRef(webcam)); 
  };
  
  setScreenShotRef = screenCapHTML => { 
    this.props.dispatch(setScreenShotRef(screenCapHTML)); 
  };

  componentWillUnmount(){ 
    if (!this.captureInterval) { return; }
    clearInterval(this.captureInterval); 
  }

  componentDidMount(){
    posenet.load()
      .then(posenet => { 
        //console.log('hi'); 
        this.props.dispatch(posenetSuccess(posenet)); 
        this.isEverythingLoaded(); 
      })
      .catch(error => { 
        this.props.dispatch(posenetError()); 
      });  
  }
  onWebcamLoaded = () => { 
    this.props.dispatch(webcamLoaded());
    this.isEverythingLoaded(); 
  }

  isEverythingLoaded = () => { 
    if (this.props.isPosenetLoaded && this.props.isWebcamLoaded){ 
      this.props.dispatch(setupLoaded()); 
      this.captureInterval = setInterval(
      () => this.capture(), Constants.frameRate); 
    }
  }

  capture = () => {
    //console.log('capture'); 
    const screenShot = this.props.webcam.getScreenshot(); 
    this.props.dispatch(takeScreenShot(screenShot));  

    this.props.posenet.estimateSinglePose(this.props.HTMLImage, 
      Constants.imageScaleFactor, 
      Constants.flipHorizontal, 
      Constants.outputStride)
        .then(pose => { 
          this.props.dispatch(newPoseDataPoint(pose)); 
          if (this.props.isCalibrating){ 
            //console.log('draw'); 
            this.drawBoundingBox(  
              pose.keypoints[1].position, 
              pose.keypoints[2].position, 
              pose.keypoints[5].position, 
              pose.keypoints[6].position);  
          }
          if (this.props.hasCalibrated) { 
            this.calculateSlouch(pose); 
          }
        })
        .catch(error => { 
          console.log('posenet error:', error); 
        });  
    this.alert(); 
  };

  alert(){ 
    const thresh = 0.5; 
    if (this.props.feedback === 'Realtime slouch amount is showing.') {
      if (this.props.slouch > thresh ){ 
        this.props.dispatch(showSlouchReprimand()); 
      }
      else {
        this.props.dispatch(showSlouchCompliment()); 
      }
    }
  }
  
  calculateSlouch = (pose) => {
    const slouch = (this.props.tempSlouch / CalculateSlouch(pose)) -1; 
    this.props.dispatch(postSlouchData(slouch)); 
  } 

  handleCalibrateButtonClick = () => { 
    this.props.dispatch(handleCalibrateButtonClick()); 
  } 

  zeroOutBBoxValues(){ 
    const leftEye = {x: 0, y: 0}; 
    const rightEye = {x: 0, y: 0}; 
    const leftShoulder = {x: 0, y: 0}; 
    this.drawBoundingBox(leftEye, rightEye, leftShoulder); 
  }

  drawBoundingBox = (leftEye, rightEye, leftShoulder, rightShoulder) => {   
    const boundingBox = { 
      width : (rightEye.x - leftEye.x), 
      height : (leftEye.y - leftShoulder.y), 
      x : leftEye.x, 
      y : (leftEye.y - this.props.bBoxHeight) 
    }; 
    this.props.dispatch(updateBoundingBox(boundingBox)); 
  }

  render() {   
    console.log(this.props.bBoxWidth, this.props.bBoxHeight, this.props.bBoxX, this.props.bBoxY); 
    return ( 
      <div>
        <Stage 
          className={'calibration-stage'} 
          width={Constants.width} 
          height={Constants.height}>
          <Layer>
            <Rect
              x={this.props.bBoxX}
              y={this.props.bBoxY}
              width={this.props.bBoxWidth}
              height={this.props.bBoxHeight}
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
        <div className="feedback">
          <p>{this.props.feedback}</p>
          <p>{this.props.instructions}
            <input type="button" value={!this.props.isCalibrating? 'CALIBRATE' : 'STOP CALIBRATING'} onClick={() => this.handleCalibrateButtonClick()}></input>
          </p>
          <br></br>
          <p>Slouch Amount:  </p>
            <input 
              type="range" 
              name="slouchSlider" 
              value={this.props.slouch} 
              step=".01" 
              min="0" 
              max="0.5"
              onChange={() => console.log('')}
              >
            </input>
            <Link to="/home">Dashboard</Link>
        </div>
        <p>{this.props.isSlouching}</p>
        <img  className="screen-shots" src={this.props.screenCap} alt="pose" ref={this.setScreenShotRef} width={Constants.width} height={Constants.height}></img>
      </div>
    ); 
  }
}

const mapStateToProps = state => ({ 
  interval : state.slouch.interval,
  isSlouching : state.slouch.isSlouching, 
  HTMLImage : state.slouch.HTMLImage, 
  screenCap : state.slouch.screenCap, 
  webcam : state.slouch.webcam,
  tempSlouch : state.slouch.tempSlouch, 
  slouch : state.slouch.slouch, 
  bBoxHeight : state.slouch.bBoxHeight, 
  bBoxWidth : state.slouch.bBoxWidth, 
  bBoxX: state.slouch.bBoxX, 
  bBoxY: state.slouch.bBoxY, 
  isCalibrating: state.slouch.isCalibrating, 
  hasCalibrated: state.slouch.hasCalibrated, 
  isLoaded : state.slouch.isLoaded, 
  isWebcamLoaded : state.slouch.isWebcamLoaded, 
  isPosenetLoaded : state.slouch.isPosenetLoaded,  
  posenet : state.slouch.posenet,
  feedback : state.slouch.feedback, 
  instructions : state.slouch.instructions, 
  loading: state.slouch.loading, 
  error: state.slouch.error, 
  pose : state.slouch.pose,
  calibrateButtonCount : state.slouch.calibrateButtonCount
}); 

export default requiresLogin()(connect(mapStateToProps)(SlouchSlider)); 


