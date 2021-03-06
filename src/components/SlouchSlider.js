import React from 'react';
import Webcam from 'react-webcam'; 
import * as posenet from '@tensorflow-models/posenet';  
import { Stage, Layer, Rect } from 'react-konva';
import { connect } from 'react-redux'; 
import { Redirect } from 'react-router-dom'; 
import requiresLogin from './requires-login'; 
import {CalculateSlouch} from '../Utils/pose'; 
import {fetchDisplayData} from '../actions/display';
import '../Styles/camCalibStack.css'; 
import Constants from '../Utils/constants'; 

import {
  handleCalibrateButtonClick,
  setWebCamRef, 
  setScreenShotRef, 
  newSlouchDataPoint,
  postSlouchData, 
  posenetSuccess, 
  posenetError,
  updateBoundingBox, 
  webcamLoaded,
  takeScreenShot, 
  setupLoaded, 
  postCalibrationData,
  resetValues, 
  updateSlouchBehavior
} from '../actions/slouch'; 

export class SlouchSlider extends React.Component{
  constructor(props){ 
    super(props); 
    this.tempDataContainer = []; 
  }

  componentWillMount() { 
    this.props.dispatch(resetValues()); 
  }

  componentDidMount(){
    posenet.load()
      .then(posenet => {
        this.props.dispatch(posenetSuccess(posenet)); 
        this.isEverythingLoaded(); 
      })
      .catch(error => { 
        console.log('posenet error', error); 
        this.props.dispatch(posenetError()); 
      });  
  }

  onWebcamLoaded = () => { 
    this.props.dispatch(webcamLoaded());
    this.isEverythingLoaded(); 
  }

  setWebcamRef = webcam => { 
    this.props.dispatch(setWebCamRef(webcam)); 
    this.isEverythingLoaded(); 
  };
  
  setScreenShotRef = screenCapHTML => { 
    this.props.dispatch(setScreenShotRef(screenCapHTML)); 
    this.isEverythingLoaded(); 
  };

  handleCalibrateButtonClick = () => { 
    this.props.dispatch(handleCalibrateButtonClick()); 
  } 

  isEverythingLoaded = () => {
    if (this.props.isPosenetLoaded && this.props.isWebcamLoaded 
      && !this.captureInterval && this.props.HTMLImage !== null) { 
      this.props.dispatch(setupLoaded()); 
      this.captureInterval = setInterval(
        () => this.capture(), Constants.frameRate); 
    }
  }

  capture = () => {
    const screenShot = this.props.webcam.getScreenshot(); 
    this.props.dispatch(takeScreenShot(screenShot));  

    //If we're calibrated or we have calibrated find pose
    if (this.props.hasCalibValUpdatedThisSession|| this.props.hasUserEverCalibrated || this.props.isCalibrating) {
      this.props.posenet.estimateSinglePose(this.props.HTMLImage, 
        Constants.imageScaleFactor, Constants.flipHorizontal, Constants.outputStride)
          .then(pose => { 
            if (this.props.isCalibrating) { 
              this.drawBoundingBox(  
                pose.keypoints[1].position, 
                pose.keypoints[2].position, 
                pose.keypoints[5].position, 
                pose.keypoints[6].position);  
            }
            else if (!this.props.isCalibrating) { 
              this.calculateSlouch(pose); 
            }
          })
          .catch(error => { 
            console.log('posenet error:', error); 
          });
    }  
  };

  alert(){ 
      if (this.props.slouch > Constants.threshold ){ 
      
        this.props.dispatch(updateSlouchBehavior('Sit up straight!')); 
      }
      else {
        this.props.dispatch(updateSlouchBehavior('Good job sitting')); 
      }
  } 
  
  calculateSlouch = pose => {
    const slouch = Math.abs((this.props.calibValBeckEnd / CalculateSlouch(pose))-1);   
  
    this.props.dispatch(newSlouchDataPoint(slouch)); 

    this.tempDataContainer.push(slouch); 

    // Reached packet size - post to backend
    if (this.tempDataContainer.length === Constants.packetSize){
      if (slouch !== 0) { 
        //Action digestable format
        const slouchDataObj = {
          id:  this.props.currentUser.id, 
          slouch : this.tempDataContainer
        }
        this.props.dispatch(postSlouchData(slouchDataObj)); 
        this.tempDataContainer = []; 
      }
      //is this in the right spo
      this.props.dispatch(fetchDisplayData(this.props.currentUser.id)); 
    } 

    this.alert(); 
  } 

  drawBoundingBox = (leftEye, rightEye, leftShoulder) => {  
    const boundingBox = { 
      width : (rightEye.x - leftEye.x), 
      height : (leftEye.y - leftShoulder.y), 
      x : leftEye.x, 
      y : (leftEye.y - this.props.bBoxHeight), 
      tempSlouch : (this.props.bBoxWidth / this.props.bBoxHeight)
    };

    this.props.dispatch(updateBoundingBox(boundingBox)); 
  }

  componentDidUpdate(prevProps) { 
    //IF WE JUST CALIBRATED GET THE CALIBRATION VALUE AND POST IT TO THE BACKEND
    if(prevProps.feedback === 'Calibrating...' && this.props.feedback === 'Calibrated') { 
      const calibrationObj = { 
        id : this.props.currentUser.id, 
        calibrateVal : this.props.tempSlouch
      }; 

      this.props.dispatch(postCalibrationData(calibrationObj));
    }
  }

  componentWillUnmount(){ 
    clearInterval(this.captureInterval); 
  }
  
  render() {
    if (this.props.isCalibrationPosted){ 
      return <Redirect to="/home"></Redirect>; 
    }
  
    return ( 
      <div>
        <header className="header">
          <h2 className="header-title">Spine Saver</h2>
        </header>π
        <main>
          <section className="calib-container">
            {/* MAKE OWN COMPONENT */}
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
            {/* END */}

            {/* MAKE OWN COMPONENT */}
            <div className="feedback">
              <p><b>{this.props.feedback}</b></p>
              <p><b>{this.props.instructions}</b></p>
              <input className="calibrate " type="button" value={!this.props.isCalibrating ? 'CALIBRATE' : 'STOP CALIBRATING'} onClick={() => this.handleCalibrateButtonClick()}></input>
            </div>
            {/* END */}
            <img className="screen-shots" src={this.props.screenCap} alt="pose" ref={this.setScreenShotRef} width={Constants.width} height={Constants.height}></img>
          </section>
        </main>
      </div>
    ); 
  }
}

const mapStateToProps = state => ({ 
  currentUser : state.auth.currentUser, 
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
  isLoaded : state.slouch.isLoaded, 
  isWebcamLoaded : state.slouch.isWebcamLoaded, 
  isPosenetLoaded : state.slouch.isPosenetLoaded,  
  posenet : state.slouch.posenet,
  feedback : state.slouch.feedback, 
  instructions : state.slouch.instructions, 
  loading: state.slouch.loading, 
  error: state.slouch.error, 
  pose : state.slouch.pose,
  isCalibrationPosted : state.slouch.isCalibrationPosted,
  calibrateButtonCount : state.slouch.calibrateButtonCount, 
  hasCalibValUpdatedThisSession : state.slouch.hasCalibValUpdatedThisSession,
  hasUserEverCalibrated : state.display.hasUserEverCalibrated
}); 

export default requiresLogin()(connect(mapStateToProps)(SlouchSlider)); 


