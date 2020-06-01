
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
    // message.data[2] -> keydown / up
    console.log(message.data[2]);
    console.log(this.dom);
    this.dom.tone.innerHTML = parseInt(message.data[1]);
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