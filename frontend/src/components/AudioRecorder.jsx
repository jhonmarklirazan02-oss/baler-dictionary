import { useState, useEffect, useRef } from 'react';

function AudioRecorder({ onRecordingComplete, onError, maxDuration = 120 }) {
  const [status, setStatus] = useState('idle'); // 'idle' | 'requesting' | 'recording' | 'recorded' | 'error'
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioURL, setAudioURL] = useState(null);
  const [errorType, setErrorType] = useState(null);

  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    const isSupported = !!(
      navigator.mediaDevices &&
      navigator.mediaDevices.getUserMedia &&
      window.MediaRecorder
    );

    if (!isSupported) {
      setStatus('error');
      setErrorType('not-supported');
    }
  }, []);

  useEffect(() => {
    return () => {
      cleanup();
    };
  }, []);

  const cleanup = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (audioURL) {
      URL.revokeObjectURL(audioURL);
    }
  };

  const getSupportedMimeType = () => {
    const types = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/ogg;codecs=opus',
      'audio/mp4'
    ];
    return types.find(type => MediaRecorder.isTypeSupported(type)) || 'audio/webm';
  };

  const requestMicrophoneAccess = async () => {
    try {
      setStatus('requesting');

      const constraints = {
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 48000,
          channelCount: 1
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      return stream;

    } catch (error) {
      let errorMessage = '';

      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        setErrorType('permission-denied');
        errorMessage = 'Microphone permission denied. Please allow access in browser settings.';
      } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        setErrorType('no-microphone');
        errorMessage = 'No microphone found. Please connect a microphone.';
      } else if (error.name === 'NotSupportedError') {
        setErrorType('not-supported');
        errorMessage = 'Your browser does not support audio recording.';
      } else {
        setErrorType('unknown');
        errorMessage = `Could not access microphone: ${error.message}`;
      }

      setStatus('error');
      if (onError) {
        onError(new Error(errorMessage));
      }
      return null;
    }
  };

  const startRecording = async () => {
    let stream = streamRef.current;

    if (!stream) {
      stream = await requestMicrophoneAccess();
      if (!stream) return;
    }

    try {
      chunksRef.current = [];
      const mimeType = getSupportedMimeType();

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType,
        audioBitsPerSecond: 64000
      });

      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        handleStopRecording();
      };

      mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder error:', event.error);
        setStatus('error');
        setErrorType('recording-failed');
        if (onError) {
          onError(new Error('Recording failed. Please try again.'));
        }
        cleanup();
      };

      mediaRecorder.start(100);
      setStatus('recording');
      setRecordingTime(0);
      startTimeRef.current = Date.now();

      timerRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        setRecordingTime(elapsed);

        if (elapsed >= maxDuration) {
          stopRecording();
        }
      }, 100);

    } catch (error) {
      console.error('Error starting recording:', error);
      setStatus('error');
      setErrorType('recording-failed');
      if (onError) {
        onError(new Error('Could not start recording. Please try again.'));
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleStopRecording = () => {
    const mimeType = getSupportedMimeType();
    const audioBlob = new Blob(chunksRef.current, { type: mimeType });

    const url = URL.createObjectURL(audioBlob);
    setAudioURL(url);

    setStatus('recorded');
  };

  const reRecord = () => {
    if (audioURL) {
      URL.revokeObjectURL(audioURL);
      setAudioURL(null);
    }
    chunksRef.current = [];
    setRecordingTime(0);
    setStatus('idle');
  };

  const useRecording = () => {
    if (!audioURL) return;

    const mimeType = getSupportedMimeType();
    const extension = mimeType.includes('webm') ? 'webm' :
                     mimeType.includes('ogg') ? 'ogg' :
                     mimeType.includes('mp4') ? 'mp4' : 'webm';

    const timestamp = Date.now();
    const filename = `recording-${timestamp}.${extension}`;

    fetch(audioURL)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], filename, {
          type: mimeType,
          lastModified: timestamp
        });

        if (onRecordingComplete) {
          onRecordingComplete(file);
        }

        cleanup();
        setStatus('idle');
        setRecordingTime(0);
      })
      .catch(error => {
        console.error('Error converting recording:', error);
        if (onError) {
          onError(new Error('Could not process recording. Please try again.'));
        }
      });
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const retryAccess = () => {
    setStatus('idle');
    setErrorType(null);
    startRecording();
  };

  if (status === 'error') {
    const errors = {
      'permission-denied': {
        icon: '⚠️',
        title: 'Microphone Access Required',
        message: 'Please allow microphone access in your browser settings.',
        showRetry: true
      },
      'no-microphone': {
        icon: '❌',
        title: 'No Microphone Found',
        message: 'Please connect a microphone and try again.',
        showRetry: true
      },
      'not-supported': {
        icon: '⚠️',
        title: 'Recording Not Supported',
        message: 'Your browser doesn\'t support audio recording. Please use the Upload File option.',
        showRetry: false
      },
      'recording-failed': {
        icon: '⚠️',
        title: 'Recording Failed',
        message: 'Could not record audio. Please try again or use the Upload File option.',
        showRetry: true
      },
      'unknown': {
        icon: '⚠️',
        title: 'Error',
        message: 'An error occurred. Please try again.',
        showRetry: true
      }
    };

    const error = errors[errorType] || errors['unknown'];

    return (
      <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6 text-center">
        <div className="text-4xl mb-3">{error.icon}</div>
        <div className="text-red-400 font-semibold mb-2">{error.title}</div>
        <div className="text-red-300 text-sm mb-4">{error.message}</div>
        {error.showRetry && (
          <button
            type="button"
            onClick={retryAccess}
            className="bg-red-500/20 hover:bg-red-500/30 text-red-300 px-4 py-2 rounded-lg text-sm transition-colors"
          >
            Try Again
          </button>
        )}
      </div>
    );
  }

  if (status === 'requesting') {
    return (
      <div className="glass rounded-lg p-8 text-center">
        <div className="text-4xl mb-3">🎤</div>
        <div className="text-themed font-semibold mb-2">Requesting Microphone Access...</div>
        <div className="text-themed-secondary text-sm">Please allow access in your browser</div>
      </div>
    );
  }

  if (status === 'idle') {
    return (
      <div className="glass rounded-lg p-8 text-center">
        <div className="text-5xl mb-4">🎙️</div>
        <div className="text-themed font-semibold mb-2">Ready to Record</div>
        <div className="text-themed-secondary text-sm mb-6">
          Record pronunciation (max {formatTime(maxDuration)})
        </div>
        <button
          type="button"
          onClick={startRecording}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold px-6 py-3 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all glow"
        >
          ⏺ Start Recording
        </button>
      </div>
    );
  }

  if (status === 'recording') {
    return (
      <div className="glass rounded-lg p-8 text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse mr-3"></div>
          <div className="text-red-400 font-semibold text-lg">RECORDING</div>
        </div>
        <div className="text-3xl font-bold text-themed mb-2 font-mono">
          {formatTime(recordingTime)} / {formatTime(maxDuration)}
        </div>
        <div className="text-themed-secondary text-sm mb-6">
          Speak clearly into your microphone
        </div>
        <button
          type="button"
          onClick={stopRecording}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
        >
          ⏹ Stop Recording
        </button>
      </div>
    );
  }

  if (status === 'recorded') {
    return (
      <div className="glass rounded-lg p-6">
        <div className="text-center mb-4">
          <div className="text-2xl mb-2">✅</div>
          <div className="text-themed font-semibold mb-1">Recording Complete</div>
          <div className="text-themed-secondary text-sm">
            Duration: {formatTime(recordingTime)}
          </div>
        </div>

        {/* Audio preview */}
        <div className="mb-6">
          <audio
            src={audioURL}
            controls
            className="w-full"
            preload="metadata"
          />
        </div>

        {}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={reRecord}
            className="flex-1 glass-hover px-4 py-3 rounded-lg font-semibold transition-colors"
          >
            🔄 Re-record
          </button>
          <button
            type="button"
            onClick={useRecording}
            className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold px-4 py-3 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all glow"
          >
            ✓ Use This Recording
          </button>
        </div>
      </div>
    );
  }

  return null;
}

export default AudioRecorder;
