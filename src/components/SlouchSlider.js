import React from 'react';
import Webcam from 'react-webcam'; 
import * as posenet from '@tensorflow-models/posenet';  
import { Stage, Layer, Rect } from 'react-konva';
import { connect } from 'react-redux'; 
import { Link } from 'react-router-dom'; 
import requiresLogin from './requires-login'; 
import {CalculateSlouch} from '../Utils/pose'; 
import {fetchDisplayData} from '../actions/display';
import '../Styles/camCalibStack.css'; 
import Constants from '../Utils/constants'; 

import {
  handleCalibrateButtonClick,
  setWebCamRef, 
  setScreenShotRef, 
  newPoseDataPoint, 
  newSlouchDataPoint,
  postSlouchData, 
  posenetSuccess, 
  posenetError,
  updateBoundingBox, 
  webcamLoaded,
  takeScreenShot, 
  setupLoaded, 
  postCalibrationData,
  resetValues
} from '../actions/slouch'; 

export class SlouchSlider extends React.Component{
  constructor(props){ 
    super(props); 

    //VARIABLES WHERE STATE IS NOT SUPER NESSESARY
    this.tempDataContainer = []; 
    this.isSlouching = ''; 
  }

  componentDidMount(){
    //NOTE RENAME THIS TO RESET OR SOMEHTING
    this.props.dispatch(resetValues()); 
    
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
      && !this.captureInterval && this.props.screenCapHTML !== null) { 
      // console.log('everything is loaded');
      this.props.dispatch(setupLoaded()); 
      this.captureInterval = setInterval(
      () => this.capture(), Constants.frameRate); 
    }
  }

  capture = () => {
    const screenShot = this.props.webcam.getScreenshot(); 
    this.props.dispatch(takeScreenShot(screenShot));  

    //If we're calibrated or we have calibrated find pose
    if (this.props.isCalibrating || this.props.hasCalibrated || this.props.isCalibrated) { 
      this.props.posenet.estimateSinglePose(this.props.HTMLImage, 
        Constants.imageScaleFactor, Constants.flipHorizontal, Constants.outputStride)
          .then(pose => { 
            console.log('detecting pose'); 
            if (this.props.isCalibrating) { 
              
              this.drawBoundingBox(  
                pose.keypoints[1].position, 
                pose.keypoints[2].position, 
                pose.keypoints[5].position, 
                pose.keypoints[6].position);  
            }
            //has calibrated on the settings page
            else if (this.props.hasCalibrated) {
              this.props.dispatch(newPoseDataPoint(pose));      
              this.calculateSlouch(pose); 
              this.alert(); 
            }
          })
          .catch(error => { 
            console.log('posenet error:', error); 
          });
    }  
  };

  alert(){ 
      if (this.props.slouch > Constants.threshold ){ 
        this.isSlouching = 'Sit up straight!'
      }
      else {
        this.isSlouching = 'Great job sitting!'
      }
  }
  
  calculateSlouch = (pose) => {
    const slouch = Math.abs((this.props.calibratedVal / CalculateSlouch(pose))-1); 
    
    this.props.dispatch(newSlouchDataPoint(slouch)); 

    this.tempDataContainer.push(slouch); 

    //Reached packet size - post to backend
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
      this.props.dispatch(fetchDisplayData(this.props.currentUser.id)); 
    } 
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
    if(!prevProps.hasCalibrated && this.props.hasCalibrated) {       

      const calibrationObj = { 
        id : this.props.currentUser.id, 
        calibrateVal : this.props.calibratedVal
      }; 

      this.props.dispatch(postCalibrationData(calibrationObj));
    }
  }

  componentWillUnmount(){ 
    if (!this.captureInterval) { return; }
    clearInterval(this.captureInterval); 
  }
  
  render() {
    // console.log('isCalibrating', this.props.isCalibrating); 
    return ( 
      <div>
        <header className="header">
          <h2>Spine Saver</h2>
          <section >
            <Link to="/home">Dashboard</Link>
          </section>
        </header>
        <main>
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
              <input type="button" value={!this.props.isCalibrating ? 'CALIBRATE' : 'STOP CALIBRATING'} onClick={() => this.handleCalibrateButtonClick()}></input>
            </p>
            <p>{this.isSlouching}</p>
            <p>Slouch Amount:  </p>
              <input 
                type="range" 
                name="slouchSlider" 
                value={this.props.slouch} 
                step=".01" 
                min="0" 
                max="1"
                onChange={() => console.log('')}
                >
              </input>
          </div>
          <img className="screen-shots" src={this.props.screenCap} alt="pose" ref={this.setScreenShotRef} width={Constants.width} height={Constants.height}></img>
        </main>
      </div>
    ); 
  }
}

const mapStateToProps = state => ({ 
  currentUser : state.auth.currentUser, 
  calibratedVal : state.slouch.calibratedVal, 
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
  calibrateButtonCount : state.slouch.calibrateButtonCount, 
  calibVal : state.display.calibVal, 
  isCalibrated : state.display.isCalibrated
}); 

export default requiresLogin()(connect(mapStateToProps)(SlouchSlider)); 


