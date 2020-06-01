
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
        this.initMIDILoop();
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
      return await navigator.requestMIDIAccess();
    } catch (e) {
      throw e;
    }
  }

  /**
   * Init MIDI loop and assign handler for messages.
   */
  initMIDILoop () {
    try {
      const inputs = this.midi.inputs.values();
      // const outputs = midi.outputs.values();

      for (let input = inputs.next();
          input && !input.done;
          input = inputs.next()) {
        input.value.onmidimessage = (message) => {
          this.onMIDIMessage(message);
        };
      }
    } catch (e) {
      throw e;
    }
  }

  /**
   * Handler for MIDI messages.
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
        this.error(new Error('Unknown MIDI input command: ', command, e));
    }
  }

  noteOn (note) {
    this.dom.tone.innerHTML = 'Note ON: ' + parseInt(note);
  }

  noteOff (note) {
    this.dom.tone.innerHTML = 'Note OFF: ' + parseInt(note);
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
  } catch (e) { 
    console.log("YOU'RE FUCKED!", e);
  }
})();