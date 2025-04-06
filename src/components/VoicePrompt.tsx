
import React, { useEffect, useRef } from 'react';

interface VoicePromptProps {
  text: string;
  play: boolean;
  onComplete?: () => void;
}

const VoicePrompt: React.FC<VoicePromptProps> = ({ text, play, onComplete }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    if (play && text) {
      // Check if speech synthesis is available
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9; // Slightly slower for better clarity
        utterance.pitch = 1;
        utterance.volume = 1;
        
        // Different voices on different platforms
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(voice => 
          voice.name.includes('Female') || voice.name.includes('Google')
        );
        
        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }
        
        utterance.onend = () => {
          if (onComplete) onComplete();
        };
        
        window.speechSynthesis.cancel(); // Cancel any ongoing speech
        window.speechSynthesis.speak(utterance);
      } else {
        // Fallback for browsers without speech synthesis
        if (onComplete) {
          setTimeout(onComplete, 1000);
        }
      }
    }
  }, [play, text, onComplete]);
  
  return null; // No visual component needed
};

export default VoicePrompt;
