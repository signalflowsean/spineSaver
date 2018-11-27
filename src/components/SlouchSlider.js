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
  newSlouchDataPoint,
  postSlouchData, 
  posenetSuccess, 
  posenetError,
  updateBoundingBox, 
  webcamLoaded,
  takeScreenShot, 
  setupLoaded
} from '../actions/slouch'; 

export class SlouchSlider extends React.Component{
  constructor(props){ 
    super(props); 
    let tempDataContainer = []; 
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
            //console.log('hi'); 
            //this.drawBoundingBox({x: -1000, y: -1000}, {x: -10000, y:-1000}, {X:-10000, Y:-1000}); 
            const obj = {width : 0, height: 0, x: 0, y: 0}; 
            this.props.dispatch(updateBoundingBox(obj)); 
          }
          //has calibrated on the settings page
          if (this.props.hasCalibrated) { 
            console.log('hi');          
            this.calculateSlouch(pose); 
          }
          //If there is a value already from the backend no worries
          // if (this.props.calibValBackEnd !== null || this.props.calibValBackEnd !== 0){ 
          //   this.calculateSlouch(pose); 
          // }
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
    if (this.props.calibValBackEnd !== null || this.props.calibValBackEnd !== 0){ 
      
    }
    const slouch = (this.props.calibratedVal / CalculateSlouch(pose)); 
    //console.log(slouch); 
    this.props.dispatch(newSlouchDataPoint(slouch)); 

    
  } 

  addSlouchToTempContainer = slouch => { 
    this.tempDataContainer.push(slouch); 
    if (this.tempDataContainer.length === Constants.packetSize){ 

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
            <Link to="/home">Dashboard</Link>
        </div>
        <p>{this.props.isSlouching}</p>
        <img  className="screen-shots" src={this.props.screenCap} alt="pose" ref={this.setScreenShotRef} width={Constants.width} height={Constants.height}></img>
      </div>
    ); 
  }
}

const mapStateToProps = state => ({ 
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
  calibrateButtonCount : state.slouch.calibrateButtonCount
}); 

export default requiresLogin()(connect(mapStateToProps)(SlouchSlider)); 


