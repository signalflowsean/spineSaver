# Spine Saver
Spine saver is a web app the helps users slouch less.

[Deployed Link Client](https://spine-saver-client-side.herokuapp.com/home)
[Deployed Link Server](https://spine-sasaver-server.herokuapp.com/api)

# Demo Account
Username: Demo
Password: password123

## Installation
Use the package manager [npm] to install the dependencies
`npm install`
To start the app run 
`npm start`

## Tech Stack
  ### Frontend
  tensorflow.js library PoseNet
  tensorflow-models
  tensorflow/tfjs
  jwt-decode
  konva
  react
  react-dom
  react-konva
  react-redux
  react-router
  react-router-dom
  react-scripts
  react-webcam
  redux
  redux-form
  redux-thunk
  ### Backend
  bcryptjs
  body-parser
  cors
  dotenv
  express
  jsonwebtoken
  moment
  mongoose
  morgan
  nodemon
  passport
  passport-jwt
  passport-local

## Screenshots
[Screenshots](https://drive.google.com/drive/folders/1ELgjeBQvTMdappEBht64_8LHTWZdVTtZ)
## Main Components
### Frontent
Dashboard 
Slouch Slider
### Backend
Display
Slouch

# SPINE SAVER API DOCS
## DISPLAY
### GET /api/display

**Purpose**: Recieve slouching metrics back to client and display them on the dashboard. 
**Place**: Dashboard
**Protected End Point**

**Response body:** 
```
  {
    "timeElapsed": "20",
    "slouchElapse": "12",
    "improvement": "20%",
  }
```

## LOGIN
### POST /api/login

**Purpose**: For a user to login into their account
**Place**: Login page

**Reqested Body**: 
```
  { 
    "username": "jim jim"
    "password": "password123"
  }
```

**Response Body:**
```
  { 
    "authToken": ""supersecrettoken"
  }
```

## REFRESH
### POST /api/refresh

**Purpose**: to obtain a renewed access token

**Response Body:**
```
  { 
    "authToken": ""supersecrettoken"
  }
```

## SIGNUP
### POST /api/signup

**Purpose**: to signup for a new account

**Request Body:**
```
  { 
    "username": "signalflowsean", 
    "password": "password123", 
    "fullname": "Sean Nealon"
  }
```

## SLOUCH
### POST /api/slouch

**Purpose**: Add slouch data from to the database
**Place**: Any place where the user is logged in
**Protected End Point**

**Request Body:**
```
  { 
    "slouch": "2.1"  
  }
```

### GET /api/slouch/calibration
**Purpose**: To retrieve user's calibration data
**Place**: On loggin
**Protected End Point

**Response Body:**
```
  { 
    "calibrationValue": "2.3"
  }
```

### POST /api/slouch/calibration
**Purpose**: To update user's calibaration data
**Place**: Settings page, when user clicks the stop calibration button
**Protected End Point

**Request Body:**
```
  { 
    "calibrateVal": "2.5"
  }
```
### THIS APP CANNOT BE USED WITHOUT PERMISSION



This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
