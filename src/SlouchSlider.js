import React from 'react';
import Webcam from 'react-webcam'; 
//import SlouchDetection from './SlouchDetection'; 
import * as posenet from '@tensorflow-models/posenet';

export default class SlouchSlider extends React.Component{
  constructor(props){ 
    super(props); 
 
    this.state = { 
      isLoaded : false, 
      posenet : null, 
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
    image.src = this.webcam.getScreenshot(); 
    image.width = 600; 
    image.height = 500; 
    
    this.findPose(image);
  }; 

  findPose = (img) => {     
    this.state.posenet.estimateSinglePose(img, 
      this.state.imageScaleFactor, 
      this.state.flipHorizontal, 
      this.state.outputStride)
      .then((res) => { 
        console.log('pose', res);
      })
  }

  init = () => { 
    
    setInterval(this.capture, 300); 
  }

  render() { 
    const videoConstraints = { 
      width : 200, 
      height: 200, 
      facingMode: "user"
    }; 

    // console.log('feedback', this.state.feedback);

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
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
          onUserMedia={this.init}
          ref={this.setRef}
        />
        <input 
          type="range" 
          name="slouchSlider" 
          value="50"  
          step="1" 
          min="0" 
          max="100"
          onChange={(e) => console.log(e.currentTarget.value) }
          >
        </input>
      </div>
    ); 
  }
}

