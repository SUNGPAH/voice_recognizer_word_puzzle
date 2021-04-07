import React, {useEffect, useState} from 'react';

var SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition 

var recognition;
recognition = new SpeechRecognition();
recognition.continuous = true;
recognition.lang = 'en-US';
recognition.interimResults = true;
recognition.maxAlternatives = 1;
console.log('recognition global variable');

export const useRecognizer = () => {
  console.log('use recognizer');
  const [outputText, setOutputText] = useState("");
  const [interim, setInterim] = useState("");
  const [error, setError] = useState("");
  const [state, setState] = useState("idle");
  //idle, started, stopped, ended

  useEffect(() => {
    recognition.onresult = function(event) {
      let final_transcript = "";
      let interim_transcript = "";
    
      for (var i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          final_transcript += event.results[i][0].transcript;
        } else {
          interim_transcript += event.results[i][0].transcript;
        }
      }

      if(interim_transcript){
        setInterim(interim_transcript);
      }
    
      if(final_transcript){
        setOutputText(final_transcript);
      }
    }

    recognition.onend = (evt) => {
      setState('ended');
    }

    recognition.onspeechend = (evt) => {
      setState('ended');
    }

    recognition.onerror = (evt) => {
      setError(evt.error)
    }
  }, [])
  
  const startRecognizer = () => {
    setState('started');
    recognition.start();
  }

  const endRecognizer = () => {
    setState('stopped');
    recognition.stop()
  }

  return [outputText, interim, startRecognizer, endRecognizer, error, state]
}