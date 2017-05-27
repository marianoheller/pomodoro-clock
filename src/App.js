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
        diffMin: 0,
        diffSecs: 0,
      }
    }
  }

  calculateTimeDiff( date1, date2) {

    const newDiffMin = date1.diff(date2, "minutes");
    const newDiffSecs = date1.diff(date2, "seconds") % 60;

    console.log("Calculated", date1.diff(date2) );

    return { newDiffMin, newDiffSecs };
  }

  clockTick() {
    const newDate = new moment();

    let newPomodoroState = this.state.pomodoroState;
    let newStartedDate = this.state.clock.started;

    let { newDiffMin, newDiffSecs } = this.calculateTimeDiff(newDate, this.state.clock.started);
    if ( this.state.pomodoroState === "Running" ) {
      if ( newDiffMin >= this.state.values.session ) {
        newPomodoroState = "Resting";
        newStartedDate = (new moment()).subtract(500, "ms");
        const timeDiffsAux = this.calculateTimeDiff(newDate, newStartedDate);
        newDiffMin = timeDiffsAux.newDiffMin;
        newDiffSecs = timeDiffsAux.newDiffSecs;
      }
    }
    if ( this.state.pomodoroState === "Resting" ) {
      if ( newDiffMin >= this.state.values.break ) {
        newPomodoroState = "Running";
        newStartedDate = (new moment()).subtract(500, "ms");
        const timeDiffsAux = this.calculateTimeDiff(newDate, newStartedDate);
        newDiffMin = timeDiffsAux.newDiffMin;
        newDiffSecs = timeDiffsAux.newDiffSecs;
      }
    }
    console.log("Tick", newPomodoroState, newDiffMin, newDiffSecs);
    
    this.setState( {
      ...this.state,
      pomodoroState: newPomodoroState,
      clock: {
        ...this.state.clock,
        now: newDate, //tick
        started: newStartedDate,
        diffMin: newDiffMin,
        diffSecs: newDiffSecs
      }
    });
    
  }

  componentDidMount() {
    setInterval(this.clockTick.bind(this), 1000);
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

    // const newDate = new Date();
    // 

    return function () {
      const newStarted = (new moment(this.state.clock.now)).subtract(500,"ms");
      const { newDiffMin, newDiffSecs } = this.calculateTimeDiff(this.state.clock.now, newStarted);

      this.setState({
        ...this.state,
        pomodoroState: newPomodoroState,
        clock: {
          ...this.state.clock,
          started: newStarted,
          diffMin: newDiffMin,
          diffSecs: newDiffSecs
        }
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
            <RangeArea pomodoroState={this.state.pomodoroState} pomodoroValues={this.state.values} pomodoroSetters={this.getValuesSetters()}></RangeArea>
            <Clock clock={this.state.clock} pomodoroValues={this.state.values} pomodoroState={this.state.pomodoroState}></Clock>
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

  pad(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
  }

  getClockCount() {
    let ret = -1;
    const { diffMin, diffSecs } = this.props.clock;

    console.log("Render", this.props.pomodoroState, diffMin, diffSecs);

    switch( this.props.pomodoroState ) {
      case "Running":
        ret = (
          <div className="clock-span">
            <div>Study time!</div>
            <div className="clock-number" >{`${diffMin}:${this.pad(diffSecs,2)}`}</div>
          </div>
        );
        break;
      case "Resting":
        ret = (
          <div className="clock-span">
            <div>Take a break!</div>
            <div className="clock-number" >{`${diffMin}:${this.pad(diffSecs,2)}`}</div>
          </div>
        );
        break;
      case "Stopped":
        ret = (
          <div className="clock-span">
            <div className="row">
              <div className="col-md-12">
                <div>Session</div>
                <div className="clock-number" >{this.props.pomodoroValues.session} / {this.props.pomodoroValues.break}</div>
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
          <Ranger title="Break length" pomodoroState={this.props.pomodoroState} value={this.props.pomodoroValues.break} setValue={this.props.pomodoroSetters.break}></Ranger>
          <Ranger title="Session length" pomodoroState={this.props.pomodoroState} value={this.props.pomodoroValues.session} setValue={this.props.pomodoroSetters.session}></Ranger>
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

  handleClick(e) {
    const simbol = e.target.textContent;
    let newValue = this.state.value;
    switch (simbol) {
      case "+":
        newValue++;
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
    return (
      <div className={`pure-g ranger ${this.isDisabled()}`}>
        <div className="pure-u-1 ranger-titulo">
          {this.props.title}
        </div>
        <div className="pure-u-1 ranger-values">
          <div onClick={this.handleClick.bind(this)} className="ranger-val-element value-changer">-</div>
          <div className="ranger-val-element">{this.state.value}</div>
          <div onClick={this.handleClick.bind(this)} className="ranger-val-element value-changer">+</div>
        </div>
      </div>
    )
  }
}

export default App;
