import React, { Component } from 'react';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup' // ES6
import './App.css';


class App extends Component {


  constructor(props) {
    super(props);

    this.state = {
      pomodoroState: "Stopped"
    }

  }


  setPomodoroState( newPomodoroState ) {
    return function () {
      this.setState({
        ...this.state,
        pomodoroState: newPomodoroState
      });
    }.bind(this);
  } 



  render() {
    return (
      <div className="App">
        <div className="pure-g">
          <div className="pure-u-0 pure-u-sm-3-24 pure-u-md-6-24"></div>
          <div className="pure-u-1 pure-u-sm-18-24 pure-u-md-12-24">
            <Title></Title>
            <RangeArea></RangeArea>
            <Clock></Clock>
            <ButtonArea setPomodoroState={this.setPomodoroState.bind(this)} pomodoroState={this.state.pomodoroState}></ButtonArea>
          </div>
          <div className="pure-u-0 pure-u-sm-3-24 pure-u-md-6-24"></div>
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
        <div className="pure-u-1 " id="clock-container">
          <div id="clock">
            <p>Clock!</p>
          </div>
        </div>
      </div>
    )
  }
}


class ButtonArea extends Component {

  getButtons() {

    let ret = null;
    let i = 0;
    switch (this.props.pomodoroState) {
      case "Stopped":
        ret = (
        <div>
          <Button key={this.props.pomodoroState + (i++)} onClick={this.props.setPomodoroState("Running")} type="play"></Button>
          <Button key={this.props.pomodoroState + (i++)} onClick={this.props.setPomodoroState("Resting")} type="coffee"></Button>
        </div>
        );
        break;
      case "Running":
        ret = (
        <div>
          <Button key={this.props.pomodoroState + (i++)} onClick={this.props.setPomodoroState("Stopped")} type="stop"></Button>
        </div>
        );
        break;
      case "Resting":
        ret = (
        <div>
          <Button key={this.props.pomodoroState + (i++)} onClick={this.props.setPomodoroState("Running")} type="step-forward"></Button>
          <Button key={this.props.pomodoroState + (i++)} onClick={this.props.setPomodoroState("Stopped")} type="stop"></Button>
        </div>
        );
        break;
      default:
        console.log("Error de estado de botonera");
        ret = (
        <div>
          <Button key={this.props.pomodoroState + (i++)} onClick="" type="exclamation-triangle"></Button>
        </div>
        );
        break;
    }
    return ret;
  }

  componentWillReceiveProps(nextProps){
  }

  render() {
    return (
      <div className="pure-g">
        <div className="pure-u-1" id="buttons-container">
           <CSSTransitionGroup
            transitionName="button"
            transitionEnterTimeout={1000}
            transitionLeaveTimeout={1000}  >
            {this.getButtons()}
            </CSSTransitionGroup>
          

        </div>
      </div>
    )
  }
}


class Button extends Component {
  render() {
    return (
      <a  onClick={this.props.onClick}>
        <i className={`fa fa-${this.props.type} fa-2x fa-inverse fa-fw button`} aria-hidden="true"></i>
      </a>
    )
  }
}


class RangeArea extends Component {
  render() {
    return (
      <div className="pure-g">
        <div className="pure-u-1">
          <Ranger title="Break length"></Ranger>
          <Ranger title="Session length"></Ranger>
        </div>
      </div>
    )
  }
}

class Ranger extends Component {
  render() {
    return (
      <div className="pure-g ranger">
        <div className="pure-u-1 ranger-titulo">
          {this.props.title}
        </div>
        <div className="pure-u-1 ranger-values">
          <div className="ranger-val-element">-</div>
          <div className="ranger-val-element">22</div>
          <div className="ranger-val-element">+</div>
        </div>
      </div>
    )
  }
}

export default App;

