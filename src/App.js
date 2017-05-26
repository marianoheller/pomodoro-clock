import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="pure-g">
          <div className="pure-u-0 pure-u-sm-3 pure-u-md-6"></div>
          <div className="pure-u-1 pure-u-sm-18 pure-u-md-12">
            <Title></Title>
            <Clock></Clock>
            <ButtonArea></ButtonArea>
            <ConfigDialog></ConfigDialog>
          </div>
          <div className="pure-u-0 pure-u-sm-3 pure-u-md-6"></div>
        </div>
      </div>
    );
  }
}



class Title extends Component {
  render() {
    return (
      <h1 id="title">Pomodori per Tutti</h1>
    )
  }
}



class Clock extends Component {
  render() {
    return (
      <div className="pure-g">
        <div className="pure-u-1">
          <div id="clock-container">
            <p>Clock!</p>
          </div>
        </div>
      </div>
    )
  }
}


class ButtonArea extends Component {
  render() {
    return (
      <div className="pure-g">
        <div className="pure-u-1">
          <ul>
            <li><button href="#popup1">A</button></li>
            <li><button>B</button></li>
            <li><button>C</button></li>
          </ul>
        </div>
      </div>
    )
  }
}


class ConfigDialog extends Component {
  render() {
    return (
      <div id="popup1" class="overlay">
        <div class="popup">
          <h2>Here i am</h2>
          <a class="close" href="#">&times;</a>
          <div class="content">
            Thank to pop me out of that button, but now i'm done so you can close this window.
          </div>
        </div>
      </div>
    )
  }
}

export default App;

