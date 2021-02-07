const kDefaultBreak = 5;
const kDefaultSession = 25;

class Clock extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      breakVal: kDefaultBreak,
      sessionVal: kDefaultSession,
      timeLeftS: 0,
      timeLeftM: kDefaultSession,
      status: "Paused",
    };
    
    this.onBreak = false;
    this.pausedS = this.state.timeLeftS;
    this.pausedM = this.state.timeLeftM;
    this.timer = null;
  }
  
  playSound = () => {
    let beep = document.getElementById("beep");
    beep.volume = 0.2;
    beep.currentTime = 0.0;
    beep.play();
  }
  
  decrement = () => {
    let tickMinute = false;
    let timeS = this.state.timeLeftS - 1;
    let timeM = this.state.timeLeftM;
    
    if (timeS === 0 && timeM -1 === -1) {
      this.playSound();
    }
    
    if (timeS === -1) {
      timeS = 59;
      timeM -= 1;
      if (timeM === -1) {
        if (!this.onBreak) {
          this.onBreak = true;
          timeS = 0;
          timeM = this.state.breakVal;
          $("body").addClass("break");
        }
        else {
          this.onBreak = false;
          timeS = 0;
          timeM = this.state.sessionVal;
          $("body").removeClass("break");
        }
      }
    }
    
    this.setState((s) => {
      return {
        timeLeftS: timeS,
        timeLeftM: timeM,
        status: this.onBreak ? "Break" : "Session",
      };
    });
  }
  
  componentWillUnmount() {
      clearInterval(this.countdown);
  }
  
  decBreak = () => {
    const newVal = Math.max(this.state.breakVal-1, 1);
    this.setState((s) => {
      return {
        breakVal: newVal,
      };
    });
  }
  
  incBreak = () => {
    const newVal = Math.min(this.state.breakVal+1, 60);
    this.setState((s) => {
      return {
        breakVal: newVal,
      };
    });
  }
  
  decSession = () => {
    const newVal = Math.max(this.state.sessionVal-1, 1);
    this.pausedM = newVal;
    
    this.setState((s) => {
      return {
        sessionVal: newVal,
        timeLeftM: newVal,
      };
    });
  }
  
  incSession = () => {
    const newVal = Math.min(this.state.sessionVal+1, 60);
    this.pausedM = newVal;
    
    this.setState((s) => {
      return {
        sessionVal: newVal,
        timeLeftM: newVal,
      };
    });
  }
  
  pause = () => {
    this.pausedS = this.state.timeLeftS;
    this.pausedM = this.state.timeLeftM;
    
    this.setState({
      status: "Paused",
    });
    
    clearInterval(this.timer);
    this.timer = null;
  }
  
  start = () => {
    this.setState({
      timeLeftS: this.pausedS,
      timeLeftM: this.pausedM,
      status: this.onBreak ? "Break" : "Session",
    }, () => { this.timer = setInterval(this.decrement, 1000); });
  }
  
  startPause = () => {
    if (this.timer)
      this.pause();
    else
      this.start();
  }
  
  reset = () => {
    this.setState({
      breakVal: kDefaultBreak,
      sessionVal: kDefaultSession,
      timeLeftS: 0,
      timeLeftM: kDefaultSession,
      status: "Paused",
    });
    
    this.running = false;
    this.pausedS = 0;
    this.pausedM = kDefaultSession;
    this.onBreak = false;
    
    let beep = document.getElementById("beep");
    beep.currentTime = 0.0;
    beep.pause();
    
    $("body").removeClass("break");
    
    clearInterval(this.timer);
    this.timer = null;
  }
  
  render() {
    const secLeft = this.state.timeLeftS === 60 ? 0 : this.state.timeLeftS;
    const minLeft = this.state.timeLeftM;
    const timeLeft = minLeft.toString().padStart(2, '0') + ":" + secLeft.toString().padStart(2, '0');
    
    return (
      <main>
        <div id="config">
          <div className="config-box">
            <p id="break-label">Break</p>
            <p>
              <i id="break-decrement" onClick={this.decBreak} className="fas fa-arrow-circle-left"></i> <span id="break-length">{this.state.breakVal}</span> <i id="break-increment" onClick={this.incBreak} className="fas fa-arrow-circle-right"></i>
            </p>
          </div>
          <div className="config-box">
            <p id="session-label">Session</p>
            <p>
              <i id="session-decrement" onClick={this.decSession} className="fas fa-arrow-circle-left"></i> <span id="session-length">{this.state.sessionVal}</span> <i id="session-increment" onClick={this.incSession} className="fas fa-arrow-circle-right"></i>
            </p>
          </div>
        </div>
        <div id="timer">
          <div id="heart">
          </div>
          <span id="time-left">{timeLeft}</span>
        </div>
        <div id="controls">
          <div id="start_stop" onClick={this.startPause}>Start/Pause</div>
          <div id="reset" onClick={this.reset}>Reset</div>
        </div>
        <p id="timer-label">{this.state.status}</p>
        <audio id="beep" src="https://raw.githubusercontent.com/michaelpm54/fcc/master/Usb-connection-sound-effect.mp3" />
      </main>
    );
  }
}

ReactDOM.render(<Clock />, document.getElementById("root"));
