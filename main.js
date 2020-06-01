
class App {

  /**
   * Init application.
   */
  constructor () {
    // Setup DOM elements
    this.dom = {
      tone: document.getElementById('tone')
    };

    // Setup MIDI object
    const midi = this.initMIDIAccess();

    // Iff success, start MIDI loop
    if (midi) {
      this.initMIDILoop(midi);
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
  initMIDILoop (midi) {
    try {
      const inputs = midi.inputs.values();
      // const outputs = midi.outputs.values();

      for (const input = inputs.next();
          input && !input.done;
          input = inputs.next()) {
        input.value.onmidimessage = this.onMIDIMessage;
      }
    } catch (e) {
      this.error(e);
    }
  }

  /**
   * Handler for MIDI messages.
   */
  onMIDIMessage (message) {
    // message.data[2] -> keydown / up
    console.log(message.data[2]);
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

// Start the app
new App();
