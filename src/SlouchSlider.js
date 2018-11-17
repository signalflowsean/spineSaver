import React from 'react';
import Webcam from 'react-webcam'; 
import * as posenet from '@tensorflow-models/posenet';
import { SSL_OP_NETSCAPE_DEMO_CIPHER_CHANGE_BUG } from 'constants';

export default class SlouchSlider extends React.Component{
  constructor(props){ 
    super(props); 
    
    this.image = null; 

    this.state = { 
      slouch : 0, 
      isLoaded : false, 
      posenet : null,
      capture : null, 
      img : null,
      //POSENET CONSTANTS 
      feedback : null,
      imageScaleFactor : 0.5, 
      flipHorizontal : false, 
      outputStride : 16
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

    const src = this.webcam.getScreenshot(); 

    //console.log('src', src);
    image.src = src; 
    image.width = 600; 
    image.height = 500; 
  
    //document.body.appendChild(image); 
    this.setState({capture : src})
    
    //console.log('capture', this.state.capture);
    this.findPose(this.image);
  };
  
  findPose = (img) => {     
      this.state.posenet.estimateSinglePose(img, 
      this.state.imageScaleFactor, 
      this.state.flipHorizontal, 
      this.state.outputStride)
      .then((pose) => { 
        this.calculateSlouch(pose);     
      })
  }

  calculateSlouch = (pose) => { 
    //console.log(pose.keypoints);
    const leftEye = pose.keypoints[0].position; 
    const rightEye = pose.keypoints[1].position; 
    const leftShoulder = pose.keypoints[4].position; 
    const rightShoulder = pose.keypoints[5].position; 

    const slouch = (leftEye.y - leftShoulder.y); 
    console.log(slouch);
    this.setState({slouch}); 
    //console.log('slouch', slouch);
    //console.log('leftEye', leftEye, 'rightEye', rightEye, 'leftShoulder', leftShoulder, 'rightShoulder', rightShoulder);
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
          max="100"
          onChange={(e) => console.log(e.currentTarget.value) }
          >
        </input>
        <img src={this.state.capture} ref={this.setImage} width="500" height="600"></img>
      </div>
    ); 
  }
}

