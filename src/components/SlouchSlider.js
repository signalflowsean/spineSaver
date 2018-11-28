import React from 'react';
import Webcam from 'react-webcam'; 
import * as posenet from '@tensorflow-models/posenet';  
import { Stage, Layer, Rect } from 'react-konva';
import { connect } from 'react-redux'; 
import { Link } from 'react-router-dom'; 
import requiresLogin from './requires-login'; 
import {CalculateSlouch} from '../Utils/pose'; 
import {fetchDisplayData, userHasCalibrated} from '../actions/display';
import '../Styles/camCalibStack.css'; 
import Constants from '../Utils/constants'; 

import {
  handleCalibrateButtonClick,
  setWebCamRef, 
  setScreenShotRef, 
  showSlouchCompliment, 
  showSlouchReprimand,
  newPoseDataPoint, 
  newSlouchDataPoint,
  postSlouchData, 
  posenetSuccess, 
  posenetError,
  updateBoundingBox, 
  webcamLoaded,
  takeScreenShot, 
  setupLoaded, 
  postCalibrationData
} from '../actions/slouch'; 

export class SlouchSlider extends React.Component{
  constructor(props){ 
    super(props); 
    this.tempDataContainer = []; 
  }

  componentDidUpdate(prevProps) { 
    if(!prevProps.hasCalibrated && this.props.hasCalibrated) { 
      console.log('STOP CALIBRATION button pressed'); 

      const calibrationObj = { 
        id : this.props.currentUser, 
        calibrateVal : this.props.tempSlouch
      }; 

      this.props.dispatch(postCalibrationData(calibrationObj)); 
      this.props.dispatch(userHasCalibrated()); 
      //NOT CALIBRATED
    }

    if(!prevProps.notCalibrated && this.props.notCalibrated){ 
      if (this.props.notCalibrated === false) { 
        console.log('We have calibrated and it\'s ok to hit the dashboard component')
      }
    }
 
  }

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
        this.props.dispatch(posenetSuccess(posenet)); 
        this.isEverythingLoaded(); 
      })
      .catch(error => { 
        console.log('posenet error'); 
        this.props.dispatch(posenetError()); 
      });  
  }

  onWebcamLoaded = () => { 
    this.props.dispatch(webcamLoaded());
    this.isEverythingLoaded(); 
  }

  isEverythingLoaded = () => { 
    if (this.props.isPosenetLoaded && this.props.isWebcamLoaded){ 
      console.log('Everything is loaded'); 
      this.props.dispatch(setupLoaded()); 
      this.captureInterval = setInterval(
      () => this.capture(), Constants.frameRate); 
    }
  }

  capture = () => {

    const screenShot = this.props.webcam.getScreenshot(); 
    this.props.dispatch(takeScreenShot(screenShot));  

    this.props.posenet.estimateSinglePose(this.props.HTMLImage, 
      Constants.imageScaleFactor, 
      Constants.flipHorizontal, 
      Constants.outputStride)
        .then(pose => { 
          this.props.dispatch(newPoseDataPoint(pose)); 

          if (this.props.isCalibrating){ 
            this.drawBoundingBox(  
              pose.keypoints[1].position, 
              pose.keypoints[2].position, 
              pose.keypoints[5].position, 
              pose.keypoints[6].position);  
          }
          else if (!this.props.isCalibrating) { 
            const resetObj = {width : 0, height: 0, x: 0, y: 0}; 
            this.props.dispatch(updateBoundingBox(resetObj)); 
          }
          //has calibrated on the settings page
          if (this.props.hasCalibrated) {     
            this.calculateSlouch(pose); 
            this.alert(); 
          }
          //user has calibrated before
          else if (!this.props.notCalibrated){ 
            this.calculateSlouch(pose); 
            this.alert(); 
          }
        })
        .catch(error => { 
          console.log('posenet error:', error); 
        });  
  
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
    const slouch = (this.props.calibVal / CalculateSlouch(pose)); 
    
    this.addSlouchToTempContainer(slouch); 
    this.props.dispatch(newSlouchDataPoint(slouch)); 
  } 

  addSlouchToTempContainer = slouch => { 

    this.tempDataContainer.push(slouch); 
    console.log('packetSize', Constants.packetSize)
    if (this.tempDataContainer.length === Constants.packetSize){
      console.log('posting `packet` of slouches'); 
      if (slouch !== 0) { 
        const slouchDataObj = {
          id:  this.props.currentUser.id, 
          slouch : this.tempDataContainer
        }
        this.props.dispatch(postSlouchData(slouchDataObj)); 
        this.tempDataContainer = []; 
        console.log('emptying array'); 
      }
      this.props.dispatch(fetchDisplayData(this.props.currentUser.id)); 
    } 
  }

  handleCalibrateButtonClick = () => { 
    this.props.dispatch(handleCalibrateButtonClick()); 
  } 

  drawBoundingBox = (leftEye, rightEye, leftShoulder) => {   
    const ratio = this.props.bBoxWidth / this.props.bBoxHeight; 
    const boundingBox = { 
      width : (rightEye.x - leftEye.x), 
      height : (leftEye.y - leftShoulder.y), 
      x : leftEye.x, 
      y : (leftEye.y - this.props.bBoxHeight), 
      tempSlouch : ratio
    }; 
    this.props.dispatch(updateBoundingBox(boundingBox)); 
  }

  render() {   

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
              max="0.14"
              onChange={() => console.log('')}
              >
            </input>
            {/* Can't go to dashboard when not calibrated */}
            <Link to="/home">Dashboard</Link>
        </div>
        <p>{this.props.isSlouching}</p>
        <img  className="screen-shots" src={this.props.screenCap} alt="pose" ref={this.setScreenShotRef} width={Constants.width} height={Constants.height}></img>
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
  notCalibrated : state.display.notCalibrated, 
  calibVal : state.display.calibVal
}); 

export default requiresLogin()(connect(mapStateToProps)(SlouchSlider)); 


