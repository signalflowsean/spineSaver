import React from 'react';
import Webcam from 'react-webcam'; 
import * as posenet from '@tensorflow-models/posenet';
import { Stage, Layer, Rect } from 'react-konva';
import { connect } from 'react-redux'; 
import requiresLogin from './requires-login'; 
import {CalculateSlouch} from '../Utils/pose'; 
import Constants from '../Utils/constants'; 
import DataContainer from '../Utils/dataContainer'; 
import '../Styles/camCalibStack.css'; 

export class SlouchSlider extends React.Component{

  componentWillUnmount(){ 
    this.setState({interval : clearInterval(this.state.interval)});   
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
    this.setState(
      {feedback : 'Loaded', instructions: 'Hit the CALIBRATE button to get started', isLoaded: true}, 
      () => {
        this.setState({interval : setInterval(this.capture, Constants.frameRate)})
      }); 
  }

  // setImage = (image) => { 
  //   this.image = image; 
  // }
  //WEBCAM MTHODS STOP
  
  findPose = (img) => {     
      this.state.posenet.estimateSinglePose(img, 
        Constants.imageScaleFactor, 
        Constants.flipHorizontal, 
        Constants.outputStride)
          .then((pose) => this.calculateSlouch(pose))

    this.alert(); 
  }

  alert(){ 
    const thresh = 0.5; 
    if (this.state.feedback === 'Realtime slouch amount is showing.') {
      if (this.state.slouch > thresh ){ 
        this.setState({isSlouching : 'Sit up straight!'}); 
      }
      else {
        this.setState({isSlouching : 'Good job sitting'});  
      }
    }
  }
  
  dataContainer(data){ 
    // slouchData.push(data); 
    // //console.log(slouchData.length, slouchData);
    // if (slouchData.length === size) { 
    //   //dispatch action
    //   slouchData = []; 
    // }
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
        <div className="feedback">
          <p>{this.state.feedback}</p>
          <p>{this.state.instructions}
            <input type="button" value={!this.state.isCalibrating? 'CALIBRATE' : 'STOP CALIBRATING'} onClick={() => this.handleCalibrateButtonClick()}></input>
          </p>
          <br></br>
          <p>Slouch Amount:  </p>
            <input 
              type="range" 
              name="slouchSlider" 
              value={this.state.slouch} 
              step=".01" 
              min="0" 
              max="0.5"
              onChange={() => console.log('')}
              >
            </input>
        </div>
        <p>{this.state.isSlouching}</p>
        <img className="screen-shots" src={this.state.capture} alt="pose" ref={this.setScreenShotRef} width={Constants.width} height={Constants.height}></img>
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
  posenet : state.slouch.posenet,
  feedback : state.slouch.feedback, 
  instructions : state.slouch.instructions, 
  loading: state.slouch.loading, 
  error: state.slouch.error
}); 

export default requiresLogin()(connect(mapStateToProps(SlouchSlider)))


