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

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        setIsSpeechSupported(true);
        // Don't create instance here - we'll create it fresh each time
      }
    }
  }, []);

  // Cleanup speech recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (error) {
          // Ignore cleanup errors
        }
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
      // Only update state if we're in starting mode
      if (isStartingRef.current) {
        setIsListening(true);
        setIsStarting(false);
        isStartingRef.current = false;
        isListeningRef.current = true;

        // Notify parent component that speech recognition has started
        if (onSpeechStart) {
          onSpeechStart();
        }
      }
    };

    recognition.onend = () => {
      // Only update state if we're in listening mode
      if (isListeningRef.current) {
        setIsListening(false);
        setIsStarting(false);
        isStartingRef.current = false;
        isListeningRef.current = false;

        // Notify parent component that speech recognition has stopped
        if (onSpeechStop) {
          onSpeechStop();
        }
      }
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      // Only process results if we're actually listening
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

      // Send interim results immediately for real-time typing
      if (interimTranscript && onInterimTranscript) {
        onInterimTranscript(interimTranscript);
      }

      // Send final results when sentence is complete
      if (finalTranscript) {
        onTranscript(finalTranscript);
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error);
      // Reset all states on error
      setIsListening(false);
      setIsStarting(false);
      isStartingRef.current = false;
      isListeningRef.current = false;
    };

    return recognition;
  }, [onInterimTranscript, onSpeechStart, onSpeechStop, onTranscript]);

  const toggleListening = useCallback(() => {
    if (!isSpeechSupported || disabled) return;

    if (isListening) {
      // Stop listening - based on current state
      try {
        // Clear any pending interim results immediately
        if (onInterimTranscript) {
          onInterimTranscript(null);
        }

        // Immediately update state to show we're stopping
        setIsListening(false);
        setIsStarting(false);
        isStartingRef.current = false;
        isListeningRef.current = false;

        // Stop the recognition and clear the reference
        if (recognitionRef.current) {
          try {
            recognitionRef.current.stop();
          } catch (error) {
            // Ignore stop errors
          }
          recognitionRef.current = null;
        }
      } catch (error) {
        console.error('Failed to stop speech recognition:', error);
        // State is already set to false above
      }
    } else {
      // Start listening - based on current state
      try {
        // Set starting state
        setIsStarting(true);
        setIsListening(false);
        isStartingRef.current = true;
        isListeningRef.current = false;

        // Clear any previous speech input when starting fresh
        if (onInterimTranscript) {
          onInterimTranscript(null);
        }

        // Create a fresh instance and start
        const recognition = createRecognitionInstance();
        if (recognition) {
          recognitionRef.current = recognition;
          recognition.start();

          // Fallback timeout in case events don't fire
          setTimeout(() => {
            if (isStartingRef.current && !isListening) {
              console.warn('Speech recognition start timeout, resetting state');
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
      } catch (error) {
        console.error('Failed to start speech recognition:', error);
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
