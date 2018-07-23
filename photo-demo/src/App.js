import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';

function takePhoto() {
  console.log('App.js takePhoto: entered');
  const imageCapture = new imageCapture();
  imageCapture.takePhoto();
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <div>
          <button onClick={takePhoto}>Take Photo</button>
          <input type="file" accept="image/*" capture="user" />
        </div>
      </div>
    );
  }
}

export default App;
