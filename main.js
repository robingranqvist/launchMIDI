const tone = document.getElementById("tone");

if (navigator.requestMIDIAccess) {
    console.log('Browser supports MIDI!');
}

if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess()
        .then(success, failure);
}

function success (midi) {
    var inputs = midi.inputs.values();
    // var outputs = midi.outputs.values();

    for (var input = inputs.next();
        input && !input.done;
        input = inputs.next()) {

        input.value.onmidimessage = onMIDIMessage;
    }
    function onMIDIMessage (message) {
        // message.data[2] -> keydown / up
        console.log(message.data[2]);
        tone.innerHTML = parseInt(message.data[1]);
    }
    

}
 
function failure () {
    console.error('No access bitchboi')
}


