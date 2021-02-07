const kSounds = [
    "https://s3.amazonaws.com/freecodecamp/drums/Chord_1.mp3",
    "https://s3.amazonaws.com/freecodecamp/drums/Chord_2.mp3",
    "https://s3.amazonaws.com/freecodecamp/drums/Chord_3.mp3",
    "https://s3.amazonaws.com/freecodecamp/drums/Give_us_a_light.mp3",
    "https://s3.amazonaws.com/freecodecamp/drums/Dry_Ohh.mp3",
    "https://s3.amazonaws.com/freecodecamp/drums/Bld_H1.mp3",
    "https://s3.amazonaws.com/freecodecamp/drums/punchy_kick_1.mp3",
    "https://s3.amazonaws.com/freecodecamp/drums/side_stick_1.mp3",
    "https://s3.amazonaws.com/freecodecamp/drums/Brk_Snr.mp3",
];

const kAvailableKeys = [
  'Q', 'W', 'E', 'A', 'S', 'D', 'Z', 'X', 'C',
];

function genBindings(sounds, available) {
  let bindings = [];
  for (let i = 0; i < sounds.length; i++) {
    bindings.push({
      key: available[i % available.length],
      sound: {
        url: sounds[i],
        description: sounds[i].substring(sounds[i].lastIndexOf('/')+1),
      },
    });
  }
  return bindings;
}

class DrumMachine extends React.Component
{
  constructor(props)
  {
    super(props)
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.playPadByKey = this.playPadByKey.bind(this);
    this.bindings = genBindings(kSounds, kAvailableKeys);
    this.state = {
      lastClickedSound: null,
    };
  }
  
  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyPress);
  }
  
  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyPress);
  }
  
  handleKeyPress(event) {
    this.playPadByKey(event.keyCode);
  }
  
  playPadByKey(key) {
    const index = this.bindings.findIndex(e => e.key.charCodeAt(0) == key);
    if (typeof index === "undefined") {
      console.log("No binding for key " + key);
      return;
    }

    const pad = document.getElementById(String.fromCharCode(key));
    if (!pad) {
      console.log("No pad by id " + String.fromCharCode(key));
      return;
    }
    pad.currentTime = 0.0;
    pad.volume = 0.2;
    pad.play();
    this.setState({
      lastClickedSound: this.bindings[index].sound,
    });
  }
  
  render()
  {
    const description = (this.state.lastClickedSound && this.state.lastClickedSound.description) || "-";

    let index = 0;
    const pads = kSounds.map((sound) => {
      const idx = index++;
      const binding = this.bindings[idx];
      return (
         <div key={binding.sound.description+idx} className="drum-pad" id={binding.sound.description} onClick={() => this.playPadByKey(binding.key.charCodeAt(0))}>
            <audio className="clip" id={binding.key} src={binding.sound.url} />
            <span>{binding.key}</span>
         </div>
      );
    });
    
    return (
      <div>
        <div id="display">
          <span>{description}</span>
        </div>
        <div id="pads">
          {pads}
        </div>
      </div>
    );
  }
}

ReactDOM.render(<DrumMachine />, document.getElementById("drum-machine"));
