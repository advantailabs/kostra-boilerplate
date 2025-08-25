'use client';

import { RiMicLine } from '@remixicon/react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { Button } from './Button';

// Define SpeechRecognition interfaces for TypeScript
interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionResultList {
  length: number;
  item(_index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onresult: ((_ev: SpeechRecognitionEvent) => void) | null;
  onerror: ((_ev: SpeechRecognitionErrorEvent) => void) | null;
  start(): void;
  stop(): void;
}

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

interface SpeechRecognitionButtonProps {
  onTranscript: (_transcript: string | null) => void;
  onInterimTranscript?: (_transcript: string | null) => void;
  onSpeechStart?: () => void;
  onSpeechStop?: () => void;
  className?: string;
  disabled?: boolean;
}

export function SpeechRecognitionButton({
  onTranscript,
  onInterimTranscript,
  onSpeechStart,
  onSpeechStop,
  className = '',
  disabled = false,
}: SpeechRecognitionButtonProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeechSupported, setIsSpeechSupported] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const isStartingRef = useRef(false);
  const isListeningRef = useRef(false);

  // Add refs to track accumulated text and manage continuous recognition
  const accumulatedTextRef = useRef('');
  const restartTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSpeechTimeRef = useRef<number>(0);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        setIsSpeechSupported(true);
      }
    }
  }, []);

  // Cleanup speech recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // Ignore cleanup errors
        }
      }
      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current);
      }
    };
  }, []);

  // Create a fresh recognition instance
  const createRecognitionInstance = useCallback(() => {
    if (typeof window === 'undefined') return null;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return null;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      if (isStartingRef.current) {
        setIsListening(true);
        setIsStarting(false);
        isStartingRef.current = false;
        isListeningRef.current = true;

        if (onSpeechStart) {
          onSpeechStart();
        }
      }
    };

    recognition.onend = () => {
      // Only restart if we're still supposed to be listening
      if (isListeningRef.current) {
        const now = Date.now();
        const timeSinceLastSpeech = now - lastSpeechTimeRef.current;

        // If it's been more than 2 seconds since last speech, restart recognition
        if (timeSinceLastSpeech > 2000) {
          // Restart recognition after pause
          if (recognitionRef.current) {
            try {
              recognitionRef.current.stop();
            } catch {
              // Ignore stop errors
            }
          }

          const newRecognition = createRecognitionInstance();
          if (newRecognition) {
            recognitionRef.current = newRecognition;
            newRecognition.start();
          }
        } else {
          // Set a timeout to restart after 2 seconds of no speech
          if (restartTimeoutRef.current) {
            clearTimeout(restartTimeoutRef.current);
          }
          restartTimeoutRef.current = setTimeout(() => {
            if (isListeningRef.current) {
              if (recognitionRef.current) {
                try {
                  recognitionRef.current.stop();
                } catch {
                  // Ignore stop errors
                }
              }

              const newRecognition = createRecognitionInstance();
              if (newRecognition) {
                recognitionRef.current = newRecognition;
                newRecognition.start();
              }
            }
          }, 2000);
        }
      } else {
        // We're actually stopping, so update state
        setIsListening(false);
        setIsStarting(false);
        isStartingRef.current = false;
        isListeningRef.current = false;

        if (onSpeechStop) {
          onSpeechStop();
        }
      }
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      if (!isListeningRef.current) {
        return;
      }

      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const { transcript } = event.results[i][0];
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      // Update last speech time
      if (finalTranscript || interimTranscript) {
        lastSpeechTimeRef.current = Date.now();
      }

      // Clear restart timeout since we're getting speech input
      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current);
        restartTimeoutRef.current = null;
      }

      // Handle final results - accumulate with existing text
      if (finalTranscript) {
        accumulatedTextRef.current += `${finalTranscript} `;
        onTranscript(accumulatedTextRef.current.trim());
      }

      // Handle interim results - show accumulated + current interim
      if (interimTranscript && onInterimTranscript) {
        const fullInterimText = accumulatedTextRef.current + interimTranscript;
        onInterimTranscript(fullInterimText.trim());
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      // Only reset state if it's a fatal error
      if (event.error === 'no-speech' || event.error === 'audio-capture') {
        // These are recoverable errors, try to restart
        if (isListeningRef.current) {
          setTimeout(() => {
            if (isListeningRef.current) {
              if (recognitionRef.current) {
                try {
                  recognitionRef.current.stop();
                } catch {
                  // Ignore stop errors
                }
              }

              const newRecognition = createRecognitionInstance();
              if (newRecognition) {
                recognitionRef.current = newRecognition;
                newRecognition.start();
              }
            }
          }, 1000);
        }
      } else {
        // Fatal error, reset state
        setIsListening(false);
        setIsStarting(false);
        isStartingRef.current = false;
        isListeningRef.current = false;
        accumulatedTextRef.current = '';
      }
    };

    return recognition;
  }, [onInterimTranscript, onSpeechStart, onSpeechStop, onTranscript]);

  const toggleListening = useCallback(() => {
    if (!isSpeechSupported || disabled) return;

    if (isListening) {
      // Stop listening
      try {
        // Clear accumulated text
        accumulatedTextRef.current = '';

        // Clear any pending interim results
        if (onInterimTranscript) {
          onInterimTranscript(null);
        }

        // Clear restart timeout
        if (restartTimeoutRef.current) {
          clearTimeout(restartTimeoutRef.current);
          restartTimeoutRef.current = null;
        }

        // Update state
        setIsListening(false);
        setIsStarting(false);
        isStartingRef.current = false;
        isListeningRef.current = false;

        // Stop recognition
        if (recognitionRef.current) {
          try {
            recognitionRef.current.stop();
          } catch {
            // Ignore stop errors
          }
          recognitionRef.current = null;
        }
      } catch {
        // Handle any errors silently
      }
    } else {
      // Start listening
      try {
        // Reset accumulated text
        accumulatedTextRef.current = '';

        // Set starting state
        setIsStarting(true);
        setIsListening(false);
        isStartingRef.current = true;
        isListeningRef.current = false;

        // Clear any previous speech input
        if (onInterimTranscript) {
          onInterimTranscript(null);
        }

        // Create instance and start
        const recognition = createRecognitionInstance();
        if (recognition) {
          recognitionRef.current = recognition;
          recognition.start();

          // Fallback timeout
          setTimeout(() => {
            if (isStartingRef.current && !isListening) {
              setIsStarting(false);
              setIsListening(false);
              isStartingRef.current = false;
              isListeningRef.current = false;
              recognitionRef.current = null;
            }
          }, 2000);
        } else {
          throw new Error('Failed to create recognition instance');
        }
      } catch {
        // Reset state on error
        setIsStarting(false);
        setIsListening(false);
        isStartingRef.current = false;
        isListeningRef.current = false;
        recognitionRef.current = null;
      }
    }
  }, [isListening, isSpeechSupported, disabled, onInterimTranscript, createRecognitionInstance]);

  const isDisabled = disabled || !isSpeechSupported;

  return (
    <Button
      type="button"
      variant="ghost"
      onClick={toggleListening}
      disabled={isDisabled}
      className={`h-5 w-5 p-0 transition-all duration-200 sm:h-6 sm:w-6 ${className} ${
        isListening
          ? 'animate-pulse bg-red-500 text-white hover:bg-red-600'
          : isStarting
            ? 'animate-pulse bg-blue-500 text-white'
            : 'bg-gray-200 text-gray-600 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
      } ${isDisabled ? 'cursor-not-allowed opacity-50' : ''}`}
      title={
        isSpeechSupported
          ? isListening
            ? 'Stop listening'
            : isStarting
              ? 'Starting...'
              : 'Start listening'
          : 'Speech recognition not supported'
      }
    >
      <RiMicLine className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
    </Button>
  );
}
