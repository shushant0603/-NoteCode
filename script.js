document.getElementById("play-btn").addEventListener("click", () => {
    const message = `कर्मण्येवाधिकारस्ते मा फलेषु कदाचन ।
    मा कर्मफलहेतुर्भूर्मा ते संगोऽस्त्वकर्मणि ॥`;
  
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = "hi-IN";
  
    // Krishna-like voice simulation (pitch and rate)
    utterance.pitch = 1.6; // higher pitch
    utterance.rate = 0.85; // slow and calm
  
    // Optional: You can loop through available voices to pick one manually
    const voices = window.speechSynthesis.getVoices();
    const hindiVoice = voices.find(v => v.lang === "hi-IN");
    if (hindiVoice) {
      utterance.voice = hindiVoice;
    }
  
    window.speechSynthesis.speak(utterance);
  });
  