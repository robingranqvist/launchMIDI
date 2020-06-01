
class App {

  /**
   * Init application.
   */
  constructor () {
    // Setup DOM elements
    this.dom = {
      tone: document.getElementById('tone')
    };

    this.midi = null;
    this.output = null;
  }
  
  /**
   * Initializes midi
   */
  async initMIDI () {
    try {
      this.midi = await this.initMIDIAccess();
      console.log(this.midi);
      // If success, start MIDI loop
      if (this.midi) {
        this.initInputMIDILoop();
        this.initOutputMIDI();
      }
    } catch (e) {
      this.error(e);
    }
  }

  /**
   * Request midi object.
   */
  async initMIDIAccess () {
    try {
      if (!navigator.requestMIDIAccess) {
        throw new Error('No MIDI support in browser!');
      }
      return await navigator.requestMIDIAccess({ sysex: true });
    } catch (e) {
      throw e;
    }
  }

  /**
   * Init MIDI loop and assign handler for messages.
   */
  initInputMIDILoop () {
    try {
      const inputs = this.midi.inputs.values();

      for (let input = inputs.next();
          input && !input.done;
          input = inputs.next()) {
        input.value.onmidimessage = (message) => {
          try {
            this.onMIDIMessage(message);
          } catch (e) {
            this.error(e);
          }
        };
      }
    } catch (e) {
      throw e;
    }
  }

  initOutputMIDI () {
    try {
      const outputs = this.midi.outputs.values();

      for (const output of outputs) {
        this.output = output;
        console.log(output);
      }
    } catch (e) {
      throw e;
    }
  }

  /**
   * Handler for MIDI messages.
   * @param {MIDIMessageEvent} message Midi message object
   */
  onMIDIMessage (message) {
    // Parse MIDI message data
    const [ command, note, velocity ] = message.data;

    switch (command) {
      // Note on
      case 144:
          if (velocity > 0) {
            this.noteOn(note);
          } else {
            this.noteOff(note);
          }
        break;

      // Note off
      case 128:
          this.noteOff(note);
        break;

      // Unknown command
      default:
        throw new Error('Unknown MIDI input command: ', command);
    }
  }

  noteOn (note) {
    this.dom.tone.innerHTML = 'Note ON: ' + parseInt(note);
  }

  noteOff (note) {
    this.dom.tone.innerHTML = 'Note OFF: ' + parseInt(note);
  }

  setColor (button, color) {
    if (!this.output) {
      this.error(new Error("MIDI output not initialized"));
      return;
    }

    // Command, note, velocity
    this.output.send([144, button, color])
  }

  async blink (button, color, n, interval) {
    for (let i = 0; i < n; i++) {
      this.setColor(button, color);
      await sleep(interval);
      this.setColor(button, LP.COLOR.BLACK);
      await sleep(interval);
    }
  }
  
  doSequence () {
    // this.blink(LP.BUTTON.SIDE_0, LP.COLOR.GREEN, 10, 1000);
    // this.blink(LP.BUTTON.SIDE_1, LP.COLOR.GREEN, 10, 1000);
    // this.setColor(LP.BUTTON.SIDE_1, LP.COLOR.BLACK);
    // this.output.send([176, 0, 127]);
    // this.setColor(0x08, LP.COLOR.BLACK);
    
    this.marquee(":)", LP.COLOR.RED);
  }

  marquee (text, color) {
    // Convert string to byte-array
    const byteArr = [];
    for (let i = 0; i < text.length; i++) {
      byteArr.push(text.charCodeAt(i));
    }

    this.output.send([0xf0, 0x00, 0x20, 0x29, 0x09, color,...byteArr, 0xF7]);
  }

  reset () {
    this.output.send([176, 0, 0]);
  }
  
  /**
   * Handle an error in a nice way :)
   */
  error (e) {
    console.log('Oh no!, Error!');
    console.log(e);
  }
}

(async () => {
  try {
    // Start the app
    const app = new App();
    await app.initMIDI();
    app.doSequence();
  } catch (e) { 
    console.log("YOU'RE FUCKED!", e);
  }
})();