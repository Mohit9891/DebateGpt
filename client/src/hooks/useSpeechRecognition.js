import { useState, useRef, useCallback } from "react";

const SpeechRecognitionCtor =
  typeof window !== "undefined"
    ? window.SpeechRecognition || window.webkitSpeechRecognition
    : null;

export function useSpeechRecognition({ lang = "en-US" } = {}) {
  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const callbackRef = useRef(null);
  const finalTextRef = useRef("");

  const isSupported = Boolean(SpeechRecognitionCtor);

  const startListening = useCallback(
    (onFinalTranscript) => {
      if (!SpeechRecognitionCtor) return;

      // Stop any existing instance
      try { recognitionRef.current?.abort(); } catch {}

      callbackRef.current = onFinalTranscript || null;
      finalTextRef.current = "";

      const recognition = new SpeechRecognitionCtor();
      recognition.lang = lang;
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event) => {
        let interim = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const text = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTextRef.current = text;  // always keep the latest final
            setTranscript(text);
          } else {
            interim += text;
            setTranscript(interim);
          }
        }
      };

      recognition.onerror = (event) => {
        console.warn("[STT] error:", event.error);
        setIsListening(false);
        recognitionRef.current = null;
      };

      recognition.onend = () => {
        setIsListening(false);
        recognitionRef.current = null;
        // Fire the callback with whatever final transcript we have
        const text = finalTextRef.current;
        if (text && callbackRef.current) {
          console.log("[STT] onend, firing callback:", text);
          callbackRef.current(text);
          callbackRef.current = null;
        }
      };

      recognitionRef.current = recognition;
      setTranscript("");
      setIsListening(true);

      try {
        recognition.start();
        console.log("[STT] started");
      } catch (e) {
        console.warn("[STT] start failed:", e);
        setIsListening(false);
        recognitionRef.current = null;
      }
    },
    [lang]
  );

  const stopListening = useCallback(() => {
    const rec = recognitionRef.current;
    if (!rec) return;
    console.log("[STT] stopListening called");
    try {
      rec.stop();
    } catch {}
    // onend will fire the callback
  }, []);

  return {
    transcript,
    isListening,
    isSupported,
    startListening,   // startListening(onFinalTranscript)
    stopListening,
  };
}
