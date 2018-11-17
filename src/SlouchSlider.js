import React from 'react';
import Webcam from 'react-webcam'; 
import * as posenet from '@tensorflow-models/posenet';

export default class SlouchSlider extends React.Component{
  constructor(props){ 
    super(props); 
    
    this.image = null; 
    this.imageScaleFactor = 0.5; 
    this.flipHorizontal = false; 
    this.outputStride = 16; 

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
    let image = new Image(); 

    const capture = this.webcam.getScreenshot(); 

    image.src = capture; 
    image.width = 200; 
    image.height = 200; 
  
    this.setState({capture})
    
    this.findPose(this.image);
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
    const slouch = (((leftEye.y - leftShoulder.y) + (rightEye.y - rightShoulder.y))/2) + 34; 
    
    console.log('slouch', slouch);
    this.setState({slouch}); 
  } 

  onWebcamloaded = () => { 
    setInterval(this.capture, 300); 
  }

  setImage = (image) => { 
    this.image = image; 
  }

  render() { 
    const videoConstraints = { 
      width : 200, 
      height: 200, 
      facingMode: "user"
    }; 

    if (this.state.isLoaded === false){ 
      return ( 
        <p>{this.state.feedback}</p>
      ); 
    }

    return ( 
      <div>
        <p>{this.state.feedback}</p>
        <Webcam 
          audio={false}
          screenshotFormat="image/png"
          videoConstraints={videoConstraints}
          onUserMedia={this.onWebcamloaded}
          ref={this.setRef}
        />
        <input 
          type="range" 
          name="slouchSlider" 
          value={this.state.slouch} 
          step="1" 
          min="0" 
          max="40"
          onChange={(e) => console.log(e.currentTarget.value) }
          >
        </input>
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

