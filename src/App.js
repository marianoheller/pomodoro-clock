import React, { Component } from 'react';
import moment from 'moment';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup' // ES6
import './App.css';


class App extends Component {


  constructor(props) {
    super(props);

    this.state = {
      pomodoroState: "Stopped",
      values: {
        session: 25,
        break: 5
      },
      clock: {
        now: new moment(),
        started: new moment(),
        minClock: 0,
        secClock: 0,
        intervalID: null,
      }
    }
  }

  onReset() {
    this.audioBeep.pause();
    this.audioBeep.currentTime = 0;
    this.setState({
      pomodoroState: "Stopped",
      values: {
        session: 25,
        break: 5
      },
      clock: {
        tickCount: 0,
        minClock: 0,
        secClock: 0,
        intervalID: null,
      }
    })
  }

  calculateTimeDiff( date1, date2) {

    const newminClock = date1.diff(date2, "minutes");
    const newDiffSecs = date1.diff(date2, "seconds") % 60;

    return { newminClock, newDiffSecs };
  }

  clockTick() {

    let newPomodoroState = this.state.pomodoroState;
    const { tickCount } = this.state.clock;
    const newTickCount = tickCount + 1;
    let minClock = Math.floor( newTickCount / 60 );
    let secClock = newTickCount - ( minClock * 60 );

    if ( this.state.pomodoroState === "Running" ) {
      if ( minClock >= this.state.values.session ) {
        newPomodoroState = "Resting";
        minClock = secClock = 0;
      }
    }
    if ( this.state.pomodoroState === "Resting" ) {
      if ( minClock >= this.state.values.break ) {
        newPomodoroState = "Running";
        minClock = secClock = 0;
      }
    }
    this.setState( {
      ...this.state,
      pomodoroState: newPomodoroState,
      clock: {
        ...this.state.clock,
        tickCount: newTickCount,
        minClock: minClock,
        secClock: secClock
      }
    });
  }


  getValuesSetters() {
    const setSession = function (val) {
      this.setState( {
        ...this.state,
        values: {
          ...this.state.values,
          session: val
        }
      })
    }.bind(this);

    const setBreak = function (val) {
      this.setState( {
        ...this.state,
        values: {
          ...this.state.values,
          break: val
        }
      })
    }.bind(this);

    return {
      session: setSession,
      break: setBreak
    };
  }


  setPomodoroState( newPomodoroState ) {
    return function () {
      const { intervalID } = this.state.clock;
      let newIntervalID = intervalID;

      clearInterval(intervalID);
      switch (newPomodoroState) {
        case "Resting":
        case "Running":
          newIntervalID = setInterval(this.clockTick.bind(this), 1000);
          break;
        case "Stopped":
          newIntervalID = null;
          break;
        default:
          throw new Error(`Estado incorrecto. newPomodoroState: ${newPomodoroState}`);
          break;
      }

      this.setState({
        ...this.state,
        pomodoroState: newPomodoroState,
        clock: {
          ...this.state.clock,
          tickCount: 0,
          minClock: 0,
          secClock: 0,
          intervalID: newIntervalID,
        }
      });
    }.bind(this);
  } 



  render() {
    return (
      <div className="App">
        <div className="pure-g">
          <div className="pure-u-0 pure-u-sm-3-24 pure-u-md-6-24 pure-u-lg-8-24"></div>
          <div className="pure-u-1 pure-u-sm-18-24 pure-u-md-12-24 pure-u-lg-8-24">
            <Title></Title>
            <RangeArea 
              onReset={this.onReset.bind(this)} 
              pomodoroState={this.state.pomodoroState} 
              pomodoroValues={this.state.values} 
              pomodoroSetters={this.getValuesSetters()}
            ></RangeArea>
            <Clock 
              clock={this.state.clock} 
              pomodoroValues={this.state.values} 
              pomodoroState={this.state.pomodoroState}
            ></Clock>
            <ButtonArea 
              setPomodoroState={this.setPomodoroState.bind(this)} 
              pomodoroState={this.state.pomodoroState}
            ></ButtonArea>
          </div>
          <div className="pure-u-0 pure-u-sm-3-24 pure-u-md-6-24 pure-u-lg-8-24"></div>
          <audio 
            id="beep" 
            preload="auto" 
            src="https://goo.gl/65cBl1"
            ref={(audio) => { this.audioBeep = audio; }} 
          />
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

  pad(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
  }

  getClockCount() {
    let ret = -1;
    const { minClock, secClock } = this.props.clock;
    const { pomodoroValues } = this.props;

    //console.log("Render", this.props.pomodoroState, minClock, secClock);

    switch( this.props.pomodoroState ) {
      case "Running":
        ret = (
          <div className="clock-span">
            <div id="timer-label">Study time!</div>
            <div 
              id="time-left" 
              className="clock-number" 
            >
            {`
            ${this.pad(pomodoroValues.session - 1 - minClock,2)}
            :
            ${this.pad(60  - 1 - secClock,2)}
            `}
            </div>
          </div>
        );
        break;
      case "Resting":
        ret = (
          <div className="clock-span">
            <div id="timer-label">Take a break!</div>
            <div 
              id="time-left" 
              className="clock-number" 
            >
            {`
            ${this.pad(pomodoroValues.break - 1 - minClock,2)}
            :
            ${this.pad(60 - 1 - secClock,2)}
            `}
            </div>
          </div>
        );
        break;
      case "Stopped":
        ret = (
          <div className="clock-span">
            <div className="row">
              <div className="col-md-12">
                <div id="timer-label">Session</div>
                <div className="clock-number" >
                  <div id="session-length">
                    {pomodoroValues.session} 
                  </div>
                  /
                  <div id="break-length">
                    {pomodoroValues.break}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
        break;
      default:
        ret = (
          <div  className="clock-span">
            <p>Error en clock component</p>
          </div>
        );
        break;
    }
    return ret;
  }

  render() {
    return (
      <div className="pure-g">
        <div className="pure-u-1 " id="clock-container">
          <div id="clock">
            {this.getClockCount()}
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
          <Button id="start_stop" key={this.props.pomodoroState + (i++)} onClick={this.props.setPomodoroState("Running")} type="play"></Button>
          <Button key={this.props.pomodoroState + (i++)} onClick={this.props.setPomodoroState("Resting")} type="coffee"></Button>
        </div>
        );
        break;
      case "Running":
        ret = (
        <div>
          <Button id="start_stop" key={this.props.pomodoroState + (i++)} onClick={this.props.setPomodoroState("Stopped")} type="stop"></Button>
        </div>
        );
        break;
      case "Resting":
        ret = (
        <div>
          <Button key={this.props.pomodoroState + (i++)} onClick={this.props.setPomodoroState("Running")} type="step-forward"></Button>
          <Button id="start_stop" key={this.props.pomodoroState + (i++)} onClick={this.props.setPomodoroState("Stopped")} type="stop"></Button>
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
      <a id={this.props.id} onClick={this.props.onClick}>
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
          <Ranger 
            idVal="session" 
            title="Session length" 
            pomodoroState={this.props.pomodoroState} 
            value={this.props.pomodoroValues.session} 
            setValue={this.props.pomodoroSetters.session}
          ></Ranger>
          <RangeReseter onClick={this.props.onReset}></RangeReseter>
          <Ranger 
            idVal="break" 
            title="Break length" 
            pomodoroState={this.props.pomodoroState} 
            value={this.props.pomodoroValues.break} 
            setValue={this.props.pomodoroSetters.break}
          ></Ranger>
        </div>
      </div>
    )
  }
}

class Ranger extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: this.props.value
    }
  }

  componentWillReceiveProps(nextProps){
    this.setState({
      ...this.state,
      value: nextProps.value,
    });
  }

  handleClick(e) {
    const simbol = e.target.textContent;
    let newValue = this.state.value;
    switch (simbol) {
      case "+":
        newValue++;
        newValue = newValue > 60 ? 60 : newValue;
        break;
      case "-":
        newValue--;
        newValue = newValue < 1 ? 1 : newValue;
        break;
      default:
        console.log("Error de parseo de simbolo");
        break;
    }
    this.setState( {
      ...this.state,
      value: newValue
    });
    
    this.props.setValue(newValue);
  }

  isDisabled() {
    return this.props.pomodoroState === "Stopped" ? "" : "disabled";
  }

  render() {
    const { idVal } = this.props;
    return (
      <div className={`pure-u-9-24 ranger ${this.isDisabled()}`}>
        <div id={`${idVal}-label`} className="pure-u-1 ranger-titulo">
          {this.props.title}
        </div>
        <div className="pure-u-1 ranger-values">
          <div id={`${idVal}-decrement`} onClick={this.handleClick.bind(this)} className="ranger-val-element value-changer">-</div>
          <div id={`${idVal}-length`}  className="ranger-val-element">{this.state.value}</div>
          <div id={`${idVal}-increment`} onClick={this.handleClick.bind(this)} className="ranger-val-element value-changer">+</div>
        </div>
      </div>
    )
  }
}


class RangeReseter extends Component {
  render() {
    return (
      <div className="pure-u-3-24 ranger">
        <a id="reset" onClick={this.props.onClick}>
          <i className="fa fa-refresh fa-2x fa-inverse fa-fw " aria-hidden="true"></i>
        </a>
      </div>
    )
  }
}

export default App;

