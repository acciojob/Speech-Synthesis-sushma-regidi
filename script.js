// Your script here.
// Wait for the DOM to load
window.addEventListener("DOMContentLoaded", () => {
  const textInput = document.getElementById("text");
  const voiceSelect = document.getElementById("voices");
  const rateSlider = document.getElementById("rate");
  const pitchSlider = document.getElementById("pitch");
  const speakBtn = document.getElementById("speakBtn");
  const stopBtn = document.getElementById("stopBtn");

  const synth = window.speechSynthesis;
  let voices = [];
  let currentUtterance = null;

  // Load available voices
  function loadVoices() {
    voices = synth.getVoices();
    voiceSelect.innerHTML = "";

    if (voices.length === 0) {
      const option = document.createElement("option");
      option.textContent = "No voices available";
      voiceSelect.appendChild(option);
      return;
    }

    voices.forEach((voice, i) => {
      const option = document.createElement("option");
      option.value = i;
      option.textContent = `${voice.name} (${voice.lang})`;
      voiceSelect.appendChild(option);
    });
  }

  // Voices may load asynchronously
  synth.addEventListener("voiceschanged", loadVoices);
  loadVoices();

  // Speak function
  function speakText() {
    const text = textInput.value.trim();

    if (!text) return; // don't speak empty text

    // Stop any ongoing speech
    synth.cancel();

    currentUtterance = new SpeechSynthesisUtterance(text);

    // Apply selected voice
    const selectedVoice = voices[voiceSelect.value];
    if (selectedVoice) {
      currentUtterance.voice = selectedVoice;
    }

    // Apply rate & pitch
    currentUtterance.rate = parseFloat(rateSlider.value);
    currentUtterance.pitch = parseFloat(pitchSlider.value);

    synth.speak(currentUtterance);
  }

  // Stop function
  function stopSpeech() {
    synth.cancel();
  }

  // Event Listeners
  speakBtn.addEventListener("click", speakText);
  stopBtn.addEventListener("click", stopSpeech);

  // Change voice while speaking → restart speech
  voiceSelect.addEventListener("change", () => {
    if (synth.speaking) {
      speakText();
    }
  });

  // Update pitch & rate during speech
  rateSlider.addEventListener("input", () => {
    if (synth.speaking) speakText();
  });

  pitchSlider.addEventListener("input", () => {
    if (synth.speaking) speakText();
  });
});
