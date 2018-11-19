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
    this.frameRate = 150;  

    //constant height and widths
    this.width = 500; 
    this.height = 500; 

    //calibration rect size
    this.sizeDecrease = 100; 
    this.calibWidth = this.width - this.sizeDecrease; 
    this.calibHeight = this.width - this.sizeDecrease; 
    
    //constants for webcam
    this.videoConstraints = { 
      width : this.width,  
      height : this.height, 
      facingMode: "user"
    }; 

    this.state = { 
      slouch : 0, 
      isLoaded : false, 
      posenet : null,
      capture : null, 
      feedback : null
    }; 
  }
  
  componentDidMount(){ 
    this.setState({feedback : "isLoading"});
    this.loadPoseNet(); 
  }

  loadPoseNet(){ 
    posenet.load()
      .then((posenet) => { 
        this.setState(
          {posenet, isLoaded : true, feedback : "Posenet is loaded"}); 
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
    const leftEye = pose.keypoints[0].position; 
    const rightEye = pose.keypoints[1].position; 
    const leftShoulder = pose.keypoints[4].position; 
    const rightShoulder = pose.keypoints[5].position; 

    //TODO: better calculation fro slouch
    const slouch = (((leftEye.y - leftShoulder.y) + (rightEye.y - rightShoulder.y))/2) + 34; 
    
    //console.log('slouch', slouch);
    this.setState({slouch}); 
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
            <Rect
              // id={'calibration-rect'}
              x={this.sizeDecrease/2}
              y={this.sizeDecrease/2}
              width={this.calibWidth}
              height={this.calibHeight}
              stroke={'black'}
              shadowBlur={5}
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
        <input 
          type="range" 
          name="slouchSlider" 
          value={this.state.slouch} 
          step="1" 
          // The min and max will be provided from the calibration
          min="0" 
          max="40"
          onChange={(e) => console.log(e.currentTarget.value) }
          >
        </input>
        {/* <br> elements are temp so the img element which is needed
        for the pose detection is off the screen / not viewable */}
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <img src={this.state.capture} alt="pose" ref={this.setImage} width="200" height="200"></img>
      </div>
    ); 
  }
}

